import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Play, FlaskConical, Award, Target, Zap, Shuffle, BookOpen, GraduationCap, RotateCcw } from 'lucide-react'
import { categories, allQuestions } from '../../data/index.js'
import { useQuizSession } from '../../context/QuizSessionContext.jsx'
import { useStartQuizGuard } from '../shared/StartQuizGuard.jsx'
import Button from '../shared/Button.jsx'
import Card from '../shared/Card.jsx'
import Leaderboard from '../shared/Leaderboard.jsx'
import ActiveSessionNotice from '../shared/ActiveSessionNotice.jsx'

function WelcomePage() {
  const {
    stats,
    reviewQueue,
  } = useQuizSession()
  const hasHistory = stats.totalSessions > 0
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const { guardedStartQuiz, GuardModal } = useStartQuizGuard()

  const handleQuickStart = () => {
    guardedStartQuiz({
      categories: categories.filter((c) => allQuestions.some((q) => q.category === c.id)).map((c) => c.id),
      difficulty: 'mixed',
      timedMode: false,
      timePerQuestion: 30,
      questionCount: 10,
    }, 'exam')
  }

  const handleModeSelect = (mode) => {
    navigate('/setup', { state: { mode } })
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-14 sm:py-20">
      <div className="max-w-5xl w-full">
        {/* 2-column layout on large screens */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">

          {/* Main content column */}
          <div className="flex-1 min-w-0 space-y-12">

            {/* Active session notice */}
            <ActiveSessionNotice />

            {/* Hero */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={reducedMotion ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="flex justify-center"
              >
                <FlaskConical className="w-16 h-16 text-accent-teal" />
              </motion.div>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-text-primary leading-tight">
                HAB & Marine
                <br />
                <span className="text-accent-teal">Biotoxins Quiz</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary mx-auto leading-relaxed text-center">
                Test your knowledge of Harmful Algal Blooms,
                <br className="hidden sm:block" />
                marine biotoxins, and ocean health
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Button size="lg" variant="secondary" onClick={handleQuickStart}>
                  <Shuffle className="w-5 h-5" />
                  Quick Start
                </Button>
              </div>

              {/* Mode buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => handleModeSelect('exam')}
                >
                  <GraduationCap className="w-5 h-5" />
                  Exam
                </Button>
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => handleModeSelect('study')}
                >
                  <BookOpen className="w-5 h-5" />
                  Study
                </Button>
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => handleModeSelect('review')}
                  disabled={reviewQueue.length === 0}
                >
                  <RotateCcw className="w-5 h-5" />
                  Review
                  {reviewQueue.length > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-accent-amber text-ocean-950">
                      {reviewQueue.length}
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Returning user stats */}
            {hasHistory && (
              <motion.div
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <h2 className="font-display font-semibold text-lg text-text-primary mb-4">
                    Welcome back!
                  </h2>
                  <div className="grid grid-cols-3 gap-6 text-center py-2">
                    <div>
                      <div className="flex justify-center mb-1">
                        <Target className="w-5 h-5 text-accent-teal" />
                      </div>
                      <p className="font-mono text-xl font-semibold text-text-primary">
                        {stats.totalQuestionsAnswered}
                      </p>
                      <p className="text-xs text-text-tertiary">Questions</p>
                    </div>
                    <div>
                      <div className="flex justify-center mb-1">
                        <Award className="w-5 h-5 text-accent-amber" />
                      </div>
                      <p className="font-mono text-xl font-semibold text-text-primary">
                        {stats.bestScore.percent}%
                      </p>
                      <p className="text-xs text-text-tertiary">Best Score</p>
                    </div>
                    <div>
                      <div className="flex justify-center mb-1">
                        <Zap className="w-5 h-5 text-accent-success" />
                      </div>
                      <p className="font-mono text-xl font-semibold text-text-primary">
                        {stats.streakBest}
                      </p>
                      <p className="text-xs text-text-tertiary">Best Streak</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Leaderboard — shown inline on mobile, hidden on lg (appears in sidebar) */}
            <div className="lg:hidden">
              <Leaderboard />
            </div>

            {/* Category Grid */}
            <div>
              <h2 className="font-display font-semibold text-xl text-text-primary text-center mb-6">
                {allQuestions.length} Questions &middot; {categories.filter((c) => allQuestions.some((q) => q.category === c.id)).length} Categories &middot; 3 Difficulty Levels
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat, i) => {
                  const count = allQuestions.filter((q) => q.category === cat.id).length
                  if (count === 0) return null
                  return (
                    <motion.div
                      key={cat.id}
                      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <Card hover className="h-full">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <div>
                            <h3 className="font-display font-semibold text-text-primary text-sm">
                              {cat.name}
                            </h3>
                            <p className="text-text-tertiary text-xs mt-1">
                              {cat.description}
                            </p>
                            <p className="text-text-tertiary text-xs mt-2 font-mono">
                              {count} questions
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar — leaderboard on large screens */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
      {GuardModal}
    </div>
  )
}

export default WelcomePage
