import { useLocation, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, Home, ChevronDown, ChevronUp, Copy, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { categories } from '../../data/index.js'
import { italicizeSpecies } from '../../utils/italicizeSpecies.jsx'
import Button from '../shared/Button.jsx'
import Card from '../shared/Card.jsx'
import Badge from '../shared/Badge.jsx'

function getGrade(percent) {
  if (percent >= 90) return { label: 'Expert', emoji: '🏆', color: 'text-accent-amber' }
  if (percent >= 75) return { label: 'Advanced', emoji: '🎓', color: 'text-accent-teal' }
  if (percent >= 60) return { label: 'Intermediate', emoji: '📚', color: 'text-accent-cyan' }
  if (percent >= 40) return { label: 'Beginner', emoji: '🌱', color: 'text-accent-success' }
  return { label: 'Keep Learning', emoji: '💡', color: 'text-text-secondary' }
}

function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { score, total, answers, questions, config } = location.state || {}
  const [expandedQuestion, setExpandedQuestion] = useState(null)
  const [copied, setCopied] = useState(false)

  if (!score && score !== 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Card>
          <p className="text-text-secondary text-center mb-4">No results to display.</p>
          <div className="flex justify-center">
            <Link to="/setup">
              <Button>Start a Quiz</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const percent = Math.round((score / total) * 100)
  const grade = getGrade(percent)

  // Category breakdown
  const categoryBreakdown = {}
  answers.forEach((a, i) => {
    const q = questions[i]
    if (!categoryBreakdown[q.category]) {
      categoryBreakdown[q.category] = { correct: 0, total: 0 }
    }
    categoryBreakdown[q.category].total++
    if (a.correct) categoryBreakdown[q.category].correct++
  })

  const handleShare = async () => {
    const text = `HAB Quiz Result: ${score}/${total} (${percent}%) — ${grade.emoji} ${grade.label}\nTest your knowledge at kristofmoeller.com/quiz`
    try {
      // Try clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for non-HTTPS or older browsers
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Last resort: open share dialog if available
      if (navigator.share) {
        navigator.share({ title: 'HAB Quiz Result', text }).catch(() => {})
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-2xl w-full space-y-8">
        {/* Score Hero */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center space-y-4 py-4"
        >
          <div className="text-6xl mb-2">{grade.emoji}</div>
          <h1 className={`font-display font-extrabold text-5xl sm:text-6xl ${grade.color}`}>
            {percent}%
          </h1>
          <p className="font-display font-semibold text-xl sm:text-2xl text-text-primary mt-1">
            {grade.label}
          </p>
          <p className="font-mono text-text-secondary text-lg">
            {score} / {total} correct
          </p>
        </motion.div>

        {/* Category Breakdown */}
        <Card>
          <h2 className="font-display font-semibold text-lg text-text-primary mb-4">
            Performance by Category
          </h2>
          <div className="space-y-4">
            {Object.entries(categoryBreakdown).map(([catId, data]) => {
              const cat = categories.find((c) => c.id === catId)
              const catPercent = Math.round((data.correct / data.total) * 100)
              return (
                <div key={catId}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-secondary">
                      {cat?.icon} {cat?.name || catId}
                    </span>
                    <span className="font-mono text-text-primary">
                      {data.correct}/{data.total}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-ocean-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${catPercent}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat?.color || '#00d4aa' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Question Review */}
        <Card>
          <h2 className="font-display font-semibold text-lg text-text-primary mb-4">
            Question Review
          </h2>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const a = answers[i]
              const isExpanded = expandedQuestion === i
              const isCorrect = a?.correct

              return (
                <div
                  key={q.id}
                  className="border border-white/5 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                    className="w-full flex items-start gap-3 p-4 text-left hover:bg-ocean-700/30 transition-colors cursor-pointer"
                  >
                    {isCorrect ? (
                      <Check className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <span className="w-5 h-5 text-accent-danger flex-shrink-0 mt-0.5 text-center font-bold">✗</span>
                    )}
                    <span className="text-sm text-text-primary flex-1">
                      {italicizeSpecies(q.question)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-4 pb-4 space-y-3"
                    >
                      <div className="flex gap-2">
                        <Badge difficulty={q.difficulty} />
                      </div>
                      {!isCorrect && a?.selectedAnswer && (
                        <p className="text-sm text-accent-danger">
                          Your answer:{' '}
                          {italicizeSpecies(q.answers.find((ans) => ans.id === a.selectedAnswer)?.text || 'No answer')}
                        </p>
                      )}
                      <p className="text-sm text-accent-success">
                        Correct answer:{' '}
                        {italicizeSpecies(q.answers.find((ans) => ans.id === q.correctAnswer)?.text)}
                      </p>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {italicizeSpecies(q.explanation)}
                      </p>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 py-4">
          <Button onClick={handleShare} variant="secondary" size="sm">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share Result'}
          </Button>
          <Button onClick={() => navigate('/setup')} size="sm">
            <RotateCcw className="w-4 h-4" />
            New Quiz
          </Button>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        {/* CTA */}
        <Card className="text-center">
          <p className="text-text-secondary text-sm mb-3">
            Want to learn more about HABs and marine biotoxins?
          </p>
          <a
            href="https://kristofmoeller.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-accent-teal hover:text-accent-teal/80 transition-colors text-sm font-medium"
          >
            Visit kristofmoeller.com
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Card>
      </div>
    </div>
  )
}

export default ResultsPage
