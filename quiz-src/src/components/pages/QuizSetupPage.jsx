import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Timer, Hash } from 'lucide-react'
import { categories, allQuestions } from '../../data/index.js'
import useLocalStorage from '../../hooks/useLocalStorage.js'
import Button from '../shared/Button.jsx'
import Card from '../shared/Card.jsx'

const difficulties = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'expert', label: 'Expert' },
  { id: 'mixed', label: 'Mixed' },
]

const questionCounts = [10, 20, 30]
const timerOptions = [15, 30, 45, 60]

// Only categories with questions
const activeCategories = categories.filter((c) =>
  allQuestions.some((q) => q.category === c.id)
)

function QuizSetupPage() {
  const navigate = useNavigate()

  // Persist settings
  const [savedSettings, setSavedSettings] = useLocalStorage('hab-quiz-settings', null)

  const [selectedCategories, setSelectedCategories] = useState(
    savedSettings?.categories || activeCategories.map((c) => c.id)
  )
  const [difficulty, setDifficulty] = useState(savedSettings?.difficulty || 'mixed')
  const [timedMode, setTimedMode] = useState(savedSettings?.timedMode || false)
  const [timePerQuestion, setTimePerQuestion] = useState(savedSettings?.timePerQuestion || 30)
  const [questionCount, setQuestionCount] = useState(savedSettings?.questionCount || 10)

  // Save settings whenever they change
  useEffect(() => {
    setSavedSettings({ categories: selectedCategories, difficulty, timedMode, timePerQuestion, questionCount })
  }, [selectedCategories, difficulty, timedMode, timePerQuestion, questionCount])

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const allSelected = selectedCategories.length === activeCategories.length
  const toggleAll = () => {
    setSelectedCategories(allSelected ? [] : activeCategories.map((c) => c.id))
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
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-2xl w-full space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-3xl sm:text-4xl text-text-primary text-center"
        >
          Quiz Setup
        </motion.h1>

        {/* Categories */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-text-primary">
              Categories
            </h2>
            <button
              onClick={toggleAll}
              className="text-xs text-accent-teal hover:text-accent-teal/80 transition-colors cursor-pointer font-medium"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeCategories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id)
              const catQuestions = allQuestions.filter((q) => q.category === cat.id)
              const bCount = catQuestions.filter((q) => q.difficulty === 'beginner').length
              const iCount = catQuestions.filter((q) => q.difficulty === 'intermediate').length
              const eCount = catQuestions.filter((q) => q.difficulty === 'expert').length
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
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
                    <p className="text-text-tertiary text-xs mt-1.5 font-mono">
                      <span className="text-accent-success">{bCount}B</span>
                      {' · '}
                      <span className="text-accent-amber">{iCount}I</span>
                      {' · '}
                      <span className="text-accent-danger">{eCount}E</span>
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
        <div className="flex justify-center pt-4 pb-8">
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
