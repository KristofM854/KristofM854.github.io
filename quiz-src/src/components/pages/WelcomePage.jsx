import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, FlaskConical, Award, Target, Zap } from 'lucide-react'
import { categories, allQuestions } from '../../data/index.js'
import useStats from '../../hooks/useStats.js'
import Button from '../shared/Button.jsx'
import Card from '../shared/Card.jsx'

function WelcomePage() {
  const { stats } = useStats()
  const hasHistory = stats.totalSessions > 0

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-10">
      <div className="max-w-2xl w-full space-y-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-5"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex justify-center"
          >
            <FlaskConical className="w-16 h-16 text-accent-teal" />
          </motion.div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-text-primary">
            HAB & Marine
            <br />
            <span className="text-accent-teal">Biotoxins Quiz</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-lg mx-auto">
            Test your knowledge of Harmful Algal Blooms, marine biotoxins, and ocean health
          </p>

          <div className="pt-2">
            <Link to="/setup">
              <Button size="lg">
                <Play className="w-5 h-5" />
                Start Quiz
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Returning user stats */}
        {hasHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h2 className="font-display font-semibold text-base text-text-primary mb-3">
                Welcome back!
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
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

        {/* Category Grid */}
        <div>
          <h2 className="font-display font-semibold text-xl text-text-primary text-center mb-4">
            {allQuestions.length} Questions &middot; 6 Categories &middot; 3 Difficulty Levels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat, i) => {
              const count = allQuestions.filter((q) => q.category === cat.id).length
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
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
    </div>
  )
}

export default WelcomePage
