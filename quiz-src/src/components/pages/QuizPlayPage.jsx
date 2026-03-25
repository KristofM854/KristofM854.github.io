import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, LogOut } from 'lucide-react'
import useQuiz from '../../hooks/useQuiz.js'
import useTimer from '../../hooks/useTimer.js'
import useStats from '../../hooks/useStats.js'
import Badge from '../shared/Badge.jsx'
import Button from '../shared/Button.jsx'
import Card from '../shared/Card.jsx'
import ProgressRing from '../shared/ProgressRing.jsx'
import Modal from '../shared/Modal.jsx'
import { categories, getQuestionType } from '../../data/index.js'
import { italicizeSpecies } from '../../utils/italicizeSpecies.jsx'

const POSITION_LABELS = ['A', 'B', 'C', 'D']

function QuizPlayPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const config = location.state?.config

  const {
    questions,
    currentQuestion,
    currentIndex,
    status,
    showFeedback,
    score,
    progress,
    answers,
    startQuiz,
    submitAnswer,
    nextQuestion,
    abandonQuiz,
  } = useQuiz()

  const { stats, recordAnswer, recordSession } = useStats()
  const [lastResult, setLastResult] = useState(null)
  const [showQuitModal, setShowQuitModal] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  const handleTimeExpire = useCallback(() => {
    if (!showFeedback && currentQuestion) {
      const timeSpent = config?.timePerQuestion || 0
      const result = submitAnswer(null, timeSpent)
      if (result) {
        setLastResult(result)
        recordAnswer(currentQuestion.category, false)
      }
    }
  }, [showFeedback, currentQuestion, submitAnswer, recordAnswer, config])

  const timer = useTimer(config?.timePerQuestion || 30, handleTimeExpire)

  // Start quiz on mount
  useEffect(() => {
    if (config) {
      startQuiz(config)
    } else {
      navigate('/setup')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Start timer for each question
  useEffect(() => {
    if (status === 'active' && !showFeedback && config?.timedMode) {
      timer.restart(config.timePerQuestion)
    }
    if (status === 'active' && !showFeedback) {
      setQuestionStartTime(Date.now())
    }
  }, [currentIndex, showFeedback, status]) // eslint-disable-line react-hooks/exhaustive-deps

  // Navigate to results when completed
  useEffect(() => {
    if (status === 'completed') {
      recordSession(score, questions.length, config)
      navigate('/results', {
        state: {
          score,
          total: questions.length,
          answers,
          questions,
          config,
        },
      })
    }
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (answerId) => {
    if (showFeedback) return
    if (config?.timedMode) timer.stop()
    const timeSpent = (Date.now() - questionStartTime) / 1000
    const result = submitAnswer(answerId, timeSpent)
    if (result) {
      setLastResult(result)
      recordAnswer(currentQuestion.category, result.isCorrect)
    }
  }

  const handleNext = () => {
    setLastResult(null)
    nextQuestion()
  }

  const handleQuit = () => {
    abandonQuiz()
    navigate('/')
  }

  if (!config || !currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    )
  }

  const categoryMeta = categories.find(
    (c) => c.id === currentQuestion.category
  )

  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-2xl w-full space-y-5">
        {/* Top bar: progress + timer + quit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-text-secondary">
              {currentIndex + 1}/{questions.length}
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
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="text-center">
          <span className="font-mono text-accent-amber text-sm">
            Score: {score}/{currentIndex + (showFeedback ? 1 : 0)}
          </span>
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-5">
              <h2 className="font-body text-lg sm:text-xl font-medium text-text-primary leading-relaxed py-1">
                {italicizeSpecies(currentQuestion.question)}
              </h2>
              {/* Image display for "image" type questions */}
              {getQuestionType(currentQuestion) === 'image' && currentQuestion.image && (
                <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={currentQuestion.image}
                    alt="Identify this species"
                    className="w-full h-auto max-h-80 object-contain bg-ocean-900"
                  />
                </div>
              )}
            </Card>

            {/* Answer Grid — supports text answers and image_choice answers */}
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
                  'w-full text-left p-4 rounded-xl border transition-all cursor-pointer min-h-[48px]'
                if (showFeedback) {
                  if (isCorrect)
                    btnClass += ' bg-accent-success/15 border-accent-success/40 text-accent-success'
                  else if (isWrong)
                    btnClass += ' bg-accent-danger/15 border-accent-danger/40 text-accent-danger'
                  else
                    btnClass += ' bg-ocean-800/40 border-white/5 text-text-tertiary opacity-50'
                } else {
                  btnClass +=
                    ' bg-ocean-800/60 border-white/8 text-text-primary hover:bg-ocean-700/60 hover:border-accent-teal/30'
                }

                return (
                  <motion.button
                    key={answer.id}
                    onClick={() => handleAnswer(answer.id)}
                    disabled={showFeedback}
                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                    className={btnClass}
                  >
                    {/* Image choice answers */}
                    {answer.image && (
                      <div className="rounded-lg overflow-hidden mb-2 border border-white/5">
                        <img
                          src={answer.image}
                          alt={answer.text}
                          className="w-full h-32 sm:h-40 object-cover bg-ocean-900"
                        />
                      </div>
                    )}
                    <span className="font-mono text-xs text-text-tertiary mr-2">
                      {POSITION_LABELS[answerIndex]}.
                    </span>
                    {italicizeSpecies(answer.text)}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feedback overlay */}
        <AnimatePresence>
          {showFeedback && lastResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
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
                    <p
                      className={`font-display font-semibold ${
                        lastResult.isCorrect
                          ? 'text-accent-success'
                          : 'text-accent-danger'
                      }`}
                    >
                      {lastResult.isCorrect ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                      {italicizeSpecies(currentQuestion.explanation)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button size="sm" onClick={handleNext}>
                    {currentIndex + 1 < questions.length ? (
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
      </div>

      {/* Quit modal */}
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
    </div>
  )
}

export default QuizPlayPage
