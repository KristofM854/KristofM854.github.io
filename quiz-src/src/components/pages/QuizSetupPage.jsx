import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Timer, Hash } from 'lucide-react'
import { categories } from '../../data/index.js'
import Button from '../shared/Button.jsx'
import Card from '../shared/Card.jsx'
import Badge from '../shared/Badge.jsx'

const difficulties = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'expert', label: 'Expert' },
  { id: 'mixed', label: 'Mixed' },
]

const questionCounts = [10, 20, 30]
const timerOptions = [15, 30, 45, 60]

function QuizSetupPage() {
  const navigate = useNavigate()

  const [selectedCategories, setSelectedCategories] = useState(
    categories.categories.map((c) => c.id)
  )
  const [difficulty, setDifficulty] = useState('mixed')
  const [timedMode, setTimedMode] = useState(false)
  const [timePerQuestion, setTimePerQuestion] = useState(30)
  const [questionCount, setQuestionCount] = useState(10)

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleStart = () => {
    if (selectedCategories.length === 0) return
    const config = {
      categories: selectedCategories,
      difficulty,
      timedMode,
      timePerQuestion,
      questionCount,
    }
    navigate('/play', { state: { config } })
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8">
      <div className="max-w-2xl w-full space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-3xl text-text-primary text-center"
        >
          Quiz Setup
        </motion.h1>

        {/* Categories */}
        <Card>
          <h2 className="font-display font-semibold text-lg text-text-primary mb-4">
            Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-ocean-700/80 border-accent-teal/30'
                      : 'bg-ocean-800/40 border-white/5 opacity-50 hover:opacity-75'
                  }`}
                >
                  <span className="text-xl mt-0.5">{cat.icon}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary text-sm">{cat.name}</p>
                    <p className="text-text-tertiary text-xs mt-0.5 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Difficulty */}
        <Card>
          <h2 className="font-display font-semibold text-lg text-text-primary mb-4">
            Difficulty
          </h2>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((d) => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  difficulty === d.id
                    ? 'bg-accent-teal text-ocean-950'
                    : 'bg-ocean-700 text-text-secondary hover:text-text-primary'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Timer */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Timed Mode
            </h2>
            <button
              onClick={() => setTimedMode(!timedMode)}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                timedMode ? 'bg-accent-teal' : 'bg-ocean-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  timedMode ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
          {timedMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="flex flex-wrap gap-2"
            >
              {timerOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimePerQuestion(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all cursor-pointer ${
                    timePerQuestion === t
                      ? 'bg-accent-amber text-ocean-950'
                      : 'bg-ocean-700 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {t}s
                </button>
              ))}
            </motion.div>
          )}
        </Card>

        {/* Question Count */}
        <Card>
          <h2 className="font-display font-semibold text-lg text-text-primary mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Number of Questions
          </h2>
          <div className="flex flex-wrap gap-2">
            {questionCounts.map((n) => (
              <button
                key={n}
                onClick={() => setQuestionCount(n)}
                className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all cursor-pointer ${
                  questionCount === n
                    ? 'bg-accent-teal text-ocean-950'
                    : 'bg-ocean-700 text-text-secondary hover:text-text-primary'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </Card>

        {/* Start */}
        <div className="flex justify-center pt-2 pb-8">
          <Button
            size="lg"
            onClick={handleStart}
            disabled={selectedCategories.length === 0}
          >
            <Play className="w-5 h-5" />
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuizSetupPage
