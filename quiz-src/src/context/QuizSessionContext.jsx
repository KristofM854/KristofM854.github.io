import { createContext, useContext, useCallback, Component } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'
import { getModeAdjustedQuestionSet } from '../utils/selectors.js'
import { allQuestions } from '../data/index.js'
import { MODE_CONFIG, DEFAULT_MODE } from '../utils/modes.js'

const QuizSessionContext = createContext(null)

const EMPTY_SESSION = {
  mode: DEFAULT_MODE,
  config: null,
  session: {
    id: null,
    startedAt: null,
    status: 'idle',
    currentIndex: 0,
    questions: [],
    answers: [],
    flaggedQuestionIds: [],
    uncertainQuestionIds: [],
    reviewQueueIds: [],
  },
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/** Validate that a stored session has the expected shape */
function validateSession(data) {
  if (!data || typeof data !== 'object') return EMPTY_SESSION
  if (!data.session || typeof data.session !== 'object') return EMPTY_SESSION
  if (!Array.isArray(data.session.questions)) return EMPTY_SESSION
  if (!Array.isArray(data.session.answers)) return EMPTY_SESSION
  // Ensure all answers have outcome field (migrate old format)
  data.session.answers = data.session.answers.map((a) => {
    if (a.outcome) return a
    return { ...a, outcome: a.correct ? 'correct' : 'incorrect' }
  })
  return data
}

/** Error boundary to catch render crashes */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error) {
    console.error('QuizSessionProvider error — clearing stale data:', error)
    // Clear potentially corrupted localStorage
    try {
      window.localStorage.removeItem('hab-quiz-active-session')
      window.localStorage.removeItem('hab-quiz-last-results')
    } catch {}
  }
  render() {
    if (this.state.hasError) {
      // Force reload after clearing data
      window.location.reload()
      return null
    }
    return this.props.children
  }
}

function QuizSessionProviderInner({ children }) {
  const [session, setSession] = useLocalStorage('hab-quiz-active-session', EMPTY_SESSION)
  const [lastResults, setLastResults] = useLocalStorage('hab-quiz-last-results', null)
  const [reviewQueue, setReviewQueue] = useLocalStorage('hab-quiz-review-queue', [])
  const [stats, setStats] = useLocalStorage('hab-quiz-stats', {
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    totalSessions: 0,
    bestScore: { percent: 0, date: null, config: {} },
    categoryStats: {},
    streakCurrent: 0,
    streakBest: 0,
  })
  const [preferences, setPreferences] = useLocalStorage('hab-quiz-preferences', null)

  // Validate loaded session data
  const validSession = validateSession(session)

  // --- Actions ---

  const startQuiz = useCallback((config, mode = DEFAULT_MODE) => {
    const modeConfig = MODE_CONFIG[mode] || MODE_CONFIG[DEFAULT_MODE]
    const questions = getModeAdjustedQuestionSet({
      mode,
      config,
      allQuestions,
      reviewQueue,
    })

    const newSession = {
      mode,
      config: {
        ...config,
        timedMode: config.timedMode ?? modeConfig.defaultTimed,
      },
      session: {
        id: generateId(),
        startedAt: new Date().toISOString(),
        status: 'active',
        currentIndex: 0,
        questions,
        answers: [],
        flaggedQuestionIds: [],
        uncertainQuestionIds: [],
        reviewQueueIds: [],
      },
    }

    setSession(newSession)
    setPreferences({
      categories: config.categories,
      difficulty: config.difficulty,
      timedMode: config.timedMode,
      timePerQuestion: config.timePerQuestion,
      questionCount: config.questionCount,
      lastMode: mode,
    })

    return questions.length
  }, [reviewQueue, setSession, setPreferences])

  const submitAnswer = useCallback((selectedAnswerId, timeSpent, explicitOutcome) => {
    let result = null
    setSession((prev) => {
      const validated = validateSession(prev)
      if (validated.session.status !== 'active') return prev
      const { session: s } = validated
      const currentQ = s.questions[s.currentIndex]
      if (!currentQ) return prev
      if (s.answers.length > s.currentIndex) return prev

      const isCorrect = selectedAnswerId === currentQ.correctAnswer
      const outcome = explicitOutcome
        || (selectedAnswerId === null ? 'unknown' : isCorrect ? 'correct' : 'incorrect')

      const answer = {
        questionId: currentQ.id,
        selectedAnswer: selectedAnswerId,
        outcome,
        timeSpent: timeSpent || 0,
      }

      result = { isCorrect, correctAnswer: currentQ.correctAnswer, outcome }

      const modeConfig = MODE_CONFIG[validated.mode] || {}
      const newReviewIds = [...s.reviewQueueIds]
      if (modeConfig.autoAddMissedToReview && outcome !== 'correct') {
        if (!newReviewIds.includes(currentQ.id)) newReviewIds.push(currentQ.id)
      }

      return {
        ...validated,
        session: {
          ...s,
          answers: [...s.answers, answer],
          reviewQueueIds: newReviewIds,
        },
      }
    })

    if (result) {
      setStats((prev) => {
        const isCorrect = result.outcome === 'correct'
        const newStreak = isCorrect ? (prev?.streakCurrent || 0) + 1 : 0
        return {
          ...prev,
          totalQuestionsAnswered: (prev?.totalQuestionsAnswered || 0) + 1,
          totalCorrect: (prev?.totalCorrect || 0) + (isCorrect ? 1 : 0),
          streakCurrent: newStreak,
          streakBest: Math.max(prev?.streakBest || 0, newStreak),
        }
      })
    }

    return result
  }, [setSession, setStats])

  const markUnknown = useCallback((timeSpent) => {
    return submitAnswer(null, timeSpent, 'unknown')
  }, [submitAnswer])

  const timeoutAnswer = useCallback((timeSpent) => {
    return submitAnswer(null, timeSpent, 'timeout')
  }, [submitAnswer])

  const nextQuestion = useCallback(() => {
    setSession((prev) => {
      const validated = validateSession(prev)
      const { session: s } = validated
      if (s.currentIndex + 1 >= s.questions.length) {
        const score = s.answers.filter((a) => a.outcome === 'correct').length
        const total = s.questions.length
        const percent = total > 0 ? Math.round((score / total) * 100) : 0

        setLastResults({
          sessionId: s.id,
          mode: validated.mode,
          config: validated.config,
          score,
          total,
          percent,
          answers: [...s.answers],
          questions: s.questions,
          completedAt: new Date().toISOString(),
        })

        setStats((st) => ({
          ...st,
          totalSessions: (st?.totalSessions || 0) + 1,
          bestScore: percent > (st?.bestScore?.percent || 0)
            ? { percent, date: new Date().toISOString(), config: validated.config }
            : (st?.bestScore || { percent: 0, date: null, config: {} }),
        }))

        if (s.reviewQueueIds.length > 0) {
          s.reviewQueueIds.forEach((qId) => {
            const answer = s.answers.find((a) => a.questionId === qId)
            const reason = answer?.outcome === 'unknown' ? 'unknown'
              : answer?.outcome === 'incorrect' ? 'incorrect'
              : answer?.outcome === 'timeout' ? 'incorrect'
              : 'marked_for_review'
            addToReviewQueue(qId, reason, s.id)
          })
        }

        return {
          ...validated,
          session: { ...s, status: 'completed' },
        }
      }

      return {
        ...validated,
        session: { ...s, currentIndex: s.currentIndex + 1 },
      }
    })
  }, [setSession, setLastResults, setStats])

  const flagQuestion = useCallback((questionId) => {
    setSession((prev) => {
      const validated = validateSession(prev)
      const flagged = validated.session.flaggedQuestionIds || []
      if (flagged.includes(questionId)) return prev
      return {
        ...validated,
        session: {
          ...validated.session,
          flaggedQuestionIds: [...flagged, questionId],
        },
      }
    })
  }, [setSession])

  const markForReview = useCallback((questionId) => {
    setSession((prev) => {
      const validated = validateSession(prev)
      const queue = validated.session.reviewQueueIds || []
      if (queue.includes(questionId)) return prev
      return {
        ...validated,
        session: {
          ...validated.session,
          reviewQueueIds: [...queue, questionId],
        },
      }
    })
    addToReviewQueue(questionId, 'marked_for_review', validSession?.session?.id)
  }, [setSession, validSession])

  const abandonQuiz = useCallback(() => {
    setSession((prev) => {
      const validated = validateSession(prev)
      return {
        ...validated,
        session: { ...validated.session, status: 'abandoned' },
      }
    })
  }, [setSession])

  const discardSession = useCallback(() => {
    setSession(EMPTY_SESSION)
  }, [setSession])

  const resumeSession = useCallback(() => {
    setSession((prev) => {
      const validated = validateSession(prev)
      if (validated.session.status === 'paused' || validated.session.status === 'active') {
        return { ...validated, session: { ...validated.session, status: 'active' } }
      }
      return prev
    })
  }, [setSession])

  const addToReviewQueue = useCallback((questionId, reason, sourceSessionId) => {
    setReviewQueue((prev) => {
      const arr = Array.isArray(prev) ? prev : []
      const existing = arr.find((entry) =>
        typeof entry === 'string' ? entry === questionId : entry.questionId === questionId
      )
      if (existing && typeof existing !== 'string') {
        const reasons = new Set(existing.reasons || [])
        reasons.add(reason)
        return arr.map((e) =>
          (typeof e !== 'string' && e.questionId === questionId)
            ? { ...e, reasons: [...reasons] }
            : e
        )
      }
      if (existing) {
        return [
          ...arr.filter((e) => e !== questionId),
          { questionId, reasons: [reason], addedAt: new Date().toISOString(), sourceSessionId: sourceSessionId || null },
        ]
      }
      return [
        ...arr,
        { questionId, reasons: [reason], addedAt: new Date().toISOString(), sourceSessionId: sourceSessionId || null },
      ]
    })
  }, [setReviewQueue])

  const removeFromReviewQueue = useCallback((questionId) => {
    setReviewQueue((prev) => {
      const arr = Array.isArray(prev) ? prev : []
      return arr.filter((entry) =>
        typeof entry === 'string' ? entry !== questionId : entry.questionId !== questionId
      )
    })
  }, [setReviewQueue])

  const clearReviewQueue = useCallback(() => {
    setReviewQueue([])
  }, [setReviewQueue])

  // --- Derived state (use validated session) ---
  const s = validSession?.session || EMPTY_SESSION.session
  const currentQuestion = s.questions?.[s.currentIndex] || null
  const isActive = s.status === 'active'
  const isCompleted = s.status === 'completed'
  const hasUnfinishedSession = s.status === 'active' && (s.answers?.length || 0) > 0
  const score = s.answers?.filter((a) => a.outcome === 'correct').length || 0
  const totalAnswered = s.answers?.length || 0
  const totalQuestions = s.questions?.length || 0
  const showFeedback = totalAnswered > (s.currentIndex || 0)
  const progress = totalQuestions > 0
    ? (((s.currentIndex || 0) + (showFeedback ? 1 : 0)) / totalQuestions) * 100
    : 0
  const streak = (() => {
    const answers = s.answers || []
    let count = 0
    for (let i = answers.length - 1; i >= 0; i--) {
      if (answers[i]?.outcome === 'correct') count++
      else break
    }
    return count
  })()

  const value = {
    session: validSession,
    lastResults,
    reviewQueue: Array.isArray(reviewQueue) ? reviewQueue : [],
    stats: stats || {},
    preferences,
    currentQuestion,
    isActive,
    isCompleted,
    hasUnfinishedSession,
    score,
    totalAnswered,
    totalQuestions,
    showFeedback,
    progress,
    streak,
    mode: validSession?.mode || DEFAULT_MODE,
    config: validSession?.config,
    questions: s.questions || [],
    answers: s.answers || [],
    flaggedQuestionIds: s.flaggedQuestionIds || [],
    startQuiz,
    submitAnswer,
    markUnknown,
    timeoutAnswer,
    nextQuestion,
    flagQuestion,
    markForReview,
    abandonQuiz,
    discardSession,
    resumeSession,
    addToReviewQueue,
    removeFromReviewQueue,
    clearReviewQueue,
    setStats,
    setPreferences,
  }

  return (
    <QuizSessionContext.Provider value={value}>
      {children}
    </QuizSessionContext.Provider>
  )
}

export function QuizSessionProvider({ children }) {
  return (
    <ErrorBoundary>
      <QuizSessionProviderInner>
        {children}
      </QuizSessionProviderInner>
    </ErrorBoundary>
  )
}

export function useQuizSession() {
  const ctx = useContext(QuizSessionContext)
  if (!ctx) throw new Error('useQuizSession must be used within QuizSessionProvider')
  return ctx
}
