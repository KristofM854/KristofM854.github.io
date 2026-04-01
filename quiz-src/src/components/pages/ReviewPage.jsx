import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, Trash2, X, Play } from 'lucide-react'
import { useQuizSession } from '../../context/QuizSessionContext.jsx'
import { allQuestions, categories } from '../../data/index.js'
import { useStartQuizGuard } from '../shared/StartQuizGuard.jsx'
import { italicizeSpecies } from '../../utils/italicizeSpecies.jsx'
import Button from '../shared/Button.jsx'
import Card from '../shared/Card.jsx'
import Badge from '../shared/Badge.jsx'

const REASON_LABELS = {
  incorrect: { label: 'Incorrect', color: 'danger' },
  unknown: { label: 'Unknown', color: 'amber' },
  marked_for_review: { label: 'Marked', color: 'cyan' },
  timeout: { label: 'Timeout', color: 'amber' },
}

function ReviewPage() {
  const navigate = useNavigate()
  const { reviewQueue, removeFromReviewQueue, clearReviewQueue } = useQuizSession()
  const { guardedStartQuiz, GuardModal } = useStartQuizGuard()

  // Normalize: support both old ID-only and new structured format
  const normalizedQueue = reviewQueue.map((entry) => {
    if (typeof entry === 'string') {
      return { questionId: entry, reasons: ['marked_for_review'], addedAt: null }
    }
    return entry
  })

  // Resolve question data
  const queueWithData = normalizedQueue.map((entry) => {
    const question = allQuestions.find((q) => q.id === entry.questionId)
    const cat = question ? categories.find((c) => c.id === question.category) : null
    return { ...entry, question, category: cat }
  }).filter((e) => e.question) // Remove entries for deleted questions

  const handleStartReview = () => {
    if (queueWithData.length === 0) return
    guardedStartQuiz({
      categories: [...new Set(queueWithData.map((e) => e.question.category))],
      difficulty: 'mixed',
      timedMode: false,
      timePerQuestion: 30,
      questionCount: Math.min(queueWithData.length, 30),
    }, 'review')
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
            Review Queue
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            Questions you missed, marked as unknown, or saved for later review.
          </p>
        </div>

        {queueWithData.length === 0 ? (
          <Card className="text-center">
            <RotateCcw className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary mb-4">
              Your review queue is empty. Complete quizzes in Study mode to automatically add missed questions, or mark questions during any quiz.
            </p>
            <Button variant="secondary" size="sm" onClick={() => navigate('/setup', { state: { mode: 'study' } })}>
              Start a Study Quiz
            </Button>
          </Card>
        ) : (
          <>
            {/* Summary + actions */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-display font-semibold text-text-primary">
                    {queueWithData.length} question{queueWithData.length !== 1 ? 's' : ''} queued
                  </p>
                  <p className="text-text-tertiary text-xs mt-1">
                    {queueWithData.filter((e) => e.reasons?.includes('incorrect')).length} incorrect
                    {' · '}
                    {queueWithData.filter((e) => e.reasons?.includes('unknown')).length} unknown
                    {' · '}
                    {queueWithData.filter((e) => e.reasons?.includes('marked_for_review')).length} marked
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleStartReview}>
                    <Play className="w-4 h-4" />
                    Start Review
                  </Button>
                  <Button size="sm" variant="danger" onClick={clearReviewQueue}>
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </Button>
                </div>
              </div>
            </Card>

            {/* Question list */}
            <div className="space-y-3">
              {queueWithData.map((entry, i) => (
                <motion.div
                  key={entry.questionId}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="relative">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Reason badges */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {entry.reasons?.map((reason) => {
                            const meta = REASON_LABELS[reason] || { label: reason, color: 'teal' }
                            return (
                              <Badge key={reason} color={meta.color}>
                                {meta.label}
                              </Badge>
                            )
                          })}
                          {entry.category && (
                            <Badge color="cyan">
                              {entry.category.icon} {entry.category.name}
                            </Badge>
                          )}
                          <Badge difficulty={entry.question.difficulty} />
                        </div>

                        {/* Question text */}
                        <p className="text-sm text-text-primary leading-relaxed">
                          {italicizeSpecies(entry.question.question)}
                        </p>

                        {entry.addedAt && (
                          <p className="text-text-tertiary text-xs mt-2">
                            Added {new Date(entry.addedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeFromReviewQueue(entry.questionId)}
                        className="text-text-tertiary hover:text-accent-danger transition-colors p-1 flex-shrink-0"
                        title="Remove from review queue"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
      {GuardModal}
    </div>
  )
}

export default ReviewPage
