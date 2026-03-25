import { createContext, useContext, useCallback, useEffect } from 'react'
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
    status: 'idle', // idle | active | paused | completed | abandoned
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

export function QuizSessionProvider({ children }) {
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

  const submitAnswer = useCallback((selectedAnswerId, timeSpent) => {
    let result = null
    setSession((prev) => {
      if (!prev?.session || prev.session.status !== 'active') return prev
      const { session: s } = prev
      const currentQ = s.questions[s.currentIndex]
      if (!currentQ) return prev
      // Guard duplicate
      if (s.answers.length > s.currentIndex) return prev

      const isCorrect = selectedAnswerId === currentQ.correctAnswer
      const outcome = selectedAnswerId === null
        ? (selectedAnswerId === undefined ? 'timeout' : 'unknown')
        : isCorrect ? 'correct' : 'incorrect'

      const answer = {
        questionId: currentQ.id,
        selectedAnswer: selectedAnswerId,
        outcome,
        timeSpent: timeSpent || 0,
      }

      result = { isCorrect, correctAnswer: currentQ.correctAnswer, outcome }

      // Auto-add to review queue in study/review mode
      const modeConfig = MODE_CONFIG[prev.mode] || {}
      const newReviewIds = [...s.reviewQueueIds]
      if (modeConfig.autoAddMissedToReview && outcome !== 'correct') {
        if (!newReviewIds.includes(currentQ.id)) newReviewIds.push(currentQ.id)
      }

      return {
        ...prev,
        session: {
          ...s,
          answers: [...s.answers, answer],
          reviewQueueIds: newReviewIds,
        },
      }
    })

    // Update stats
    if (result) {
      setStats((prev) => {
        const isCorrect = result.outcome === 'correct'
        const newStreak = isCorrect ? prev.streakCurrent + 1 : 0
        return {
          ...prev,
          totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
          totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
          streakCurrent: newStreak,
          streakBest: Math.max(prev.streakBest, newStreak),
        }
      })
    }

    return result
  }, [setSession, setStats])

  const markUnknown = useCallback((timeSpent) => {
    return submitAnswer(null, timeSpent)
  }, [submitAnswer])

  const nextQuestion = useCallback(() => {
    setSession((prev) => {
      if (!prev?.session) return prev
      const { session: s } = prev
      if (s.currentIndex + 1 >= s.questions.length) {
        // Quiz complete — compute results
        const score = s.answers.filter((a) => a.outcome === 'correct').length
        const total = s.questions.length
        const percent = total > 0 ? Math.round((score / total) * 100) : 0

        // Save last results
        setLastResults({
          sessionId: s.id,
          mode: prev.mode,
          config: prev.config,
          score,
          total,
          percent,
          answers: [...s.answers],
          questions: s.questions,
          completedAt: new Date().toISOString(),
        })

        // Update session stats
        setStats((st) => ({
          ...st,
          totalSessions: st.totalSessions + 1,
          bestScore: percent > st.bestScore.percent
            ? { percent, date: new Date().toISOString(), config: prev.config }
            : st.bestScore,
        }))

        // Merge review queue
        if (s.reviewQueueIds.length > 0) {
          setReviewQueue((rq) => {
            const merged = new Set([...rq, ...s.reviewQueueIds])
            return [...merged]
          })
        }

        return {
          ...prev,
          session: { ...s, status: 'completed' },
        }
      }

      return {
        ...prev,
        session: { ...s, currentIndex: s.currentIndex + 1 },
      }
    })
  }, [setSession, setLastResults, setStats, setReviewQueue])

  const flagQuestion = useCallback((questionId) => {
    setSession((prev) => {
      if (!prev?.session) return prev
      const flagged = prev.session.flaggedQuestionIds
      if (flagged.includes(questionId)) return prev
      return {
        ...prev,
        session: {
          ...prev.session,
          flaggedQuestionIds: [...flagged, questionId],
        },
      }
    })
  }, [setSession])

  const markForReview = useCallback((questionId) => {
    setSession((prev) => {
      if (!prev?.session) return prev
      const queue = prev.session.reviewQueueIds
      if (queue.includes(questionId)) return prev
      return {
        ...prev,
        session: {
          ...prev.session,
          reviewQueueIds: [...queue, questionId],
        },
      }
    })
  }, [setSession])

  const abandonQuiz = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      session: { ...prev.session, status: 'abandoned' },
    }))
  }, [setSession])

  const discardSession = useCallback(() => {
    setSession(EMPTY_SESSION)
  }, [setSession])

  const resumeSession = useCallback(() => {
    // Session is already in localStorage — just mark as active if paused
    setSession((prev) => {
      if (prev?.session?.status === 'paused' || prev?.session?.status === 'active') {
        return { ...prev, session: { ...prev.session, status: 'active' } }
      }
      return prev
    })
  }, [setSession])

  const removeFromReviewQueue = useCallback((questionId) => {
    setReviewQueue((prev) => prev.filter((id) => id !== questionId))
  }, [setReviewQueue])

  const clearReviewQueue = useCallback(() => {
    setReviewQueue([])
  }, [setReviewQueue])

  // --- Derived state ---
  const currentQuestion = session?.session?.questions?.[session.session.currentIndex] || null
  const isActive = session?.session?.status === 'active'
  const isCompleted = session?.session?.status === 'completed'
  const hasUnfinishedSession = session?.session?.status === 'active' && session?.session?.answers?.length > 0
  const score = session?.session?.answers?.filter((a) => a.outcome === 'correct').length || 0
  const totalAnswered = session?.session?.answers?.length || 0
  const totalQuestions = session?.session?.questions?.length || 0
  const showFeedback = totalAnswered > session?.session?.currentIndex
  const progress = totalQuestions > 0
    ? ((session.session.currentIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100
    : 0
  const streak = (() => {
    const answers = session?.session?.answers || []
    let s = 0
    for (let i = answers.length - 1; i >= 0; i--) {
      if (answers[i].outcome === 'correct') s++
      else break
    }
    return s
  })()

  const value = {
    // State
    session,
    lastResults,
    reviewQueue,
    stats,
    preferences,
    // Derived
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
    mode: session?.mode || DEFAULT_MODE,
    config: session?.config,
    questions: session?.session?.questions || [],
    answers: session?.session?.answers || [],
    flaggedQuestionIds: session?.session?.flaggedQuestionIds || [],
    // Actions
    startQuiz,
    submitAnswer,
    markUnknown,
    nextQuestion,
    flagQuestion,
    markForReview,
    abandonQuiz,
    discardSession,
    resumeSession,
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

export function useQuizSession() {
  const ctx = useContext(QuizSessionContext)
  if (!ctx) throw new Error('useQuizSession must be used within QuizSessionProvider')
  return ctx
}
