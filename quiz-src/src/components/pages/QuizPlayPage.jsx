import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, LogOut, Flag, Flame, HelpCircle, Bookmark } from 'lucide-react'
import { useQuizSession } from '../../context/QuizSessionContext.jsx'
import useTimer from '../../hooks/useTimer.js'
import Badge from '../shared/Badge.jsx'
import Button from '../shared/Button.jsx'
import Card from '../shared/Card.jsx'
import ProgressRing from '../shared/ProgressRing.jsx'
import Modal from '../shared/Modal.jsx'
import { categories, getQuestionType } from '../../data/index.js'
import { italicizeSpecies } from '../../utils/italicizeSpecies.jsx'
import { MODE_CONFIG } from '../../utils/modes.js'
import FlagQuestionModal from '../shared/FlagQuestionModal.jsx'

const POSITION_LABELS = ['A', 'B', 'C', 'D']

function QuizPlayPage() {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()

  const {
    currentQuestion,
    isActive,
    isCompleted,
    showFeedback,
    score,
    progress,
    answers,
    questions,
    totalQuestions,
    streak,
    mode,
    config,
    session,
    submitAnswer,
    markUnknown,
    timeoutAnswer,
    nextQuestion,
    abandonQuiz,
    flagQuestion,
    markForReview,
  } = useQuizSession()

  const modeConfig = MODE_CONFIG[mode] || MODE_CONFIG.exam
  const [lastResult, setLastResult] = useState(null)
  const [showQuitModal, setShowQuitModal] = useState(false)
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  // Screen reader feedback region
  const [srFeedback, setSrFeedback] = useState('')

  const handleTimeExpire = useCallback(() => {
    if (!showFeedback && currentQuestion) {
      const result = timeoutAnswer(config?.timePerQuestion || 0)
      if (result) {
        setLastResult(result)
        setSrFeedback('Time expired. The correct answer was: ' +
          currentQuestion.answers.find((a) => a.id === currentQuestion.correctAnswer)?.text)
      }
    }
  }, [showFeedback, currentQuestion, timeoutAnswer, config])

  const timer = useTimer(config?.timePerQuestion || 30, handleTimeExpire)

  // Redirect if no active session
  useEffect(() => {
    if (!isActive && !showFeedback && !isCompleted) {
      navigate('/setup')
    }
  }, [isActive, showFeedback, isCompleted, navigate])

  // Start timer for each question
  useEffect(() => {
    if (isActive && !showFeedback && config?.timedMode) {
      timer.restart(config.timePerQuestion)
    }
    if (isActive && !showFeedback) {
      setQuestionStartTime(Date.now())
    }
  }, [session?.session?.currentIndex, showFeedback, isActive]) // eslint-disable-line react-hooks/exhaustive-deps

  // Navigate to results when completed
  useEffect(() => {
    if (isCompleted) {
      navigate('/results')
    }
  }, [isCompleted, navigate])

  const handleAnswer = (answerId) => {
    if (showFeedback) return
    if (config?.timedMode) timer.stop()
    const timeSpent = (Date.now() - questionStartTime) / 1000
    const result = submitAnswer(answerId, timeSpent)
    if (result) {
      setLastResult(result)
      const correctText = currentQuestion.answers.find((a) => a.id === currentQuestion.correctAnswer)?.text
      setSrFeedback(
        result.isCorrect
          ? 'Correct!'
          : `Incorrect. The correct answer was: ${correctText}`
      )
    }
  }

  const handleUnknown = () => {
    if (showFeedback) return
    if (config?.timedMode) timer.stop()
    const timeSpent = (Date.now() - questionStartTime) / 1000
    const result = markUnknown(timeSpent)
    if (result) {
      setLastResult(result)
      const correctText = currentQuestion.answers.find((a) => a.id === currentQuestion.correctAnswer)?.text
      setSrFeedback(`Marked as unknown. The correct answer was: ${correctText}`)
    }
  }

  const handleNext = () => {
    setLastResult(null)
    setSrFeedback('')
    nextQuestion()
  }

  const handleQuit = () => {
    abandonQuiz()
    navigate('/')
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || showQuitModal || showFlagModal) return

      if (!showFeedback && currentQuestion) {
        const keyMap = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 }
        const idx = keyMap[e.key.toLowerCase()]
        if (idx !== undefined && currentQuestion.answers[idx]) {
          e.preventDefault()
          handleAnswer(currentQuestion.answers[idx].id)
        }
        // "I don't know" shortcut
        if (e.key === '?' && modeConfig.allowUnknown) {
          e.preventDefault()
          handleUnknown()
        }
      } else if (showFeedback && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showFeedback, currentQuestion, showQuitModal, showFlagModal]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!config || !currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    )
  }

  const categoryMeta = categories.find((c) => c.id === currentQuestion.category)
  const currentIndex = session?.session?.currentIndex || 0

  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-10">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {srFeedback}
      </div>

      <div className="max-w-2xl w-full space-y-5">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-text-secondary">
              {currentIndex + 1}/{totalQuestions}
            </span>
            <div className="w-32 sm:w-48 h-2 bg-ocean-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-teal to-accent-cyan rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {streak >= 2 && (
                <motion.div
                  initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-amber/15 border border-accent-amber/25"
                >
                  <Flame className="w-3.5 h-3.5 text-accent-amber" />
                  <span className="font-mono text-xs font-semibold text-accent-amber">{streak}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {config.timedMode && (
              <div className="relative flex items-center justify-center">
                <ProgressRing
                  progress={(timer.timeLeft / config.timePerQuestion) * 100}
                  size={48}
                  strokeWidth={3}
                  warning={timer.timeLeft <= 5}
                />
                <span
                  className={`absolute font-mono text-xs font-semibold ${
                    timer.timeLeft <= 5 ? 'text-accent-amber' : 'text-text-primary'
                  }`}
                >
                  {Math.ceil(timer.timeLeft)}
                </span>
              </div>
            )}
            <button
              onClick={() => setShowQuitModal(true)}
              className="text-text-tertiary hover:text-accent-danger transition-colors p-1"
              title="Quit quiz"
              aria-label="Quit quiz"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Score + Mode badge */}
        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-accent-amber text-sm">
            Score: {score}/{currentIndex + (showFeedback ? 1 : 0)}
          </span>
          <Badge color="teal">{modeConfig.label}</Badge>
        </div>

        {/* Category + Difficulty badges */}
        <div className="flex items-center gap-2 justify-center">
          {categoryMeta && (
            <Badge color="cyan">
              {categoryMeta.icon} {categoryMeta.name}
            </Badge>
          )}
          <Badge difficulty={currentQuestion.difficulty} />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={reducedMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? {} : { opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-5">
              <h2 className="font-body text-lg sm:text-xl font-medium text-text-primary leading-relaxed py-1">
                {italicizeSpecies(currentQuestion.question)}
              </h2>
              {getQuestionType(currentQuestion) === 'image' && currentQuestion.image && (
                <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={currentQuestion.image}
                    alt={currentQuestion.altText || 'Identify this species'}
                    className="w-full h-auto max-h-80 object-contain bg-ocean-900"
                  />
                </div>
              )}
            </Card>

            {/* Answer Grid */}
            <div className={`grid gap-4 ${
              getQuestionType(currentQuestion) === 'image_choice'
                ? 'grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2'
            }`}>
              {currentQuestion.answers.map((answer, answerIndex) => {
                const isSelected =
                  showFeedback &&
                  answers[answers.length - 1]?.selectedAnswer === answer.id
                const isCorrect =
                  showFeedback && answer.id === currentQuestion.correctAnswer
                const isWrong = isSelected && !isCorrect

                let btnClass =
                  'w-full text-left p-5 rounded-xl border transition-all cursor-pointer min-h-[48px] flex items-center'
                if (showFeedback) {
                  if (isCorrect)
                    btnClass += ' bg-accent-success/15 border-accent-success/40 text-accent-success'
                  else if (isWrong)
                    btnClass += ' bg-accent-danger/15 border-accent-danger/40 text-accent-danger'
                  else
                    btnClass += ' bg-ocean-800/40 border-white/5 text-text-tertiary opacity-50'
                } else {
                  btnClass +=
                    ' bg-ocean-800/60 border-white/8 text-text-primary hover:bg-ocean-700/60 hover:border-accent-teal/30 focus-visible:outline-2 focus-visible:outline-accent-teal focus-visible:outline-offset-2'
                }

                return (
                  <motion.button
                    key={answer.id}
                    onClick={() => handleAnswer(answer.id)}
                    disabled={showFeedback}
                    whileTap={!showFeedback && !reducedMotion ? { scale: 0.98 } : {}}
                    animate={
                      showFeedback && isCorrect && !reducedMotion
                        ? { scale: [1, 1.03, 1], boxShadow: ['0 0 0 rgba(16,185,129,0)', '0 0 20px rgba(16,185,129,0.3)', '0 0 0 rgba(16,185,129,0)'] }
                        : {}
                    }
                    transition={showFeedback && isCorrect ? { duration: 0.4 } : {}}
                    className={btnClass}
                    aria-label={`Answer ${POSITION_LABELS[answerIndex]}: ${answer.text}`}
                  >
                    {answer.image && (
                      <div className="rounded-lg overflow-hidden mb-2 border border-white/5">
                        <img
                          src={answer.image}
                          alt={answer.text}
                          className="w-full h-32 sm:h-40 object-cover bg-ocean-900"
                        />
                      </div>
                    )}
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-mono text-sm font-semibold mr-3 flex-shrink-0 ${
                      showFeedback && isCorrect
                        ? 'bg-accent-success/20 text-accent-success'
                        : showFeedback && isWrong
                        ? 'bg-accent-danger/20 text-accent-danger'
                        : showFeedback
                        ? 'bg-white/5 text-text-tertiary'
                        : 'bg-accent-teal/15 text-accent-teal'
                    }`}>
                      {POSITION_LABELS[answerIndex]}
                    </span>
                    <span className="flex-1">{italicizeSpecies(answer.text)}</span>
                  </motion.button>
                )
              })}
            </div>

            {/* "I don't know" button */}
            {modeConfig.allowUnknown && !showFeedback && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleUnknown}
                  className="flex items-center gap-1.5 text-text-tertiary hover:text-text-secondary transition-colors text-sm cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  I don&apos;t know
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Feedback overlay */}
        <AnimatePresence>
          {showFeedback && lastResult && (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card
                className={`border ${
                  lastResult.isCorrect
                    ? 'border-accent-success/30'
                    : 'border-accent-danger/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {lastResult.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-accent-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-accent-danger flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-display font-semibold ${
                      lastResult.isCorrect ? 'text-accent-success' : 'text-accent-danger'
                    }`}>
                      {lastResult.outcome === 'unknown'
                        ? 'Marked as Unknown'
                        : lastResult.outcome === 'timeout'
                        ? 'Time Expired'
                        : lastResult.isCorrect ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                      {italicizeSpecies(currentQuestion.explanation)}
                    </p>
                    {currentQuestion.references && (
                      <p className="text-text-tertiary text-xs mt-2 italic">
                        Source: {currentQuestion.references}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFlagModal(true)}
                      className="flex items-center gap-1.5 text-text-tertiary hover:text-accent-amber transition-colors text-xs cursor-pointer"
                      title="Flag this question as inaccurate"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      Flag
                    </button>
                    <button
                      onClick={() => markForReview(currentQuestion.id)}
                      className="flex items-center gap-1.5 text-text-tertiary hover:text-accent-cyan transition-colors text-xs cursor-pointer"
                      title="Mark for review later"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      Review later
                    </button>
                  </div>
                  <Button size="sm" onClick={handleNext}>
                    {currentIndex + 1 < totalQuestions ? (
                      <>
                        Next <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      'See Results'
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard hint */}
        {!showFeedback && (
          <p className="text-text-tertiary text-xs text-center hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 rounded bg-ocean-700 text-text-secondary font-mono text-xs">A</kbd>–<kbd className="px-1.5 py-0.5 rounded bg-ocean-700 text-text-secondary font-mono text-xs">D</kbd> to answer
            {modeConfig.allowUnknown && (
              <>, <kbd className="px-1.5 py-0.5 rounded bg-ocean-700 text-text-secondary font-mono text-xs">?</kbd> for &ldquo;I don&apos;t know&rdquo;</>
            )}
          </p>
        )}
      </div>

      <Modal
        isOpen={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        title="Quit Quiz?"
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowQuitModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleQuit}>
              Quit
            </Button>
          </>
        }
      >
        <p>Your progress will be lost. Are you sure you want to quit?</p>
      </Modal>

      <FlagQuestionModal
        isOpen={showFlagModal}
        onClose={() => setShowFlagModal(false)}
        question={currentQuestion}
      />
    </div>
  )
}

export default QuizPlayPage
