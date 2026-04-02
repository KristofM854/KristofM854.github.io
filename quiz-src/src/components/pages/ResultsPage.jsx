import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, Home, ChevronDown, ChevronUp, Copy, Check, ExternalLink, BookOpen, AlertTriangle } from 'lucide-react'
import { useState, useEffect, useRef, useMemo } from 'react'
import { categories } from '../../data/index.js'
import { italicizeSpecies } from '../../utils/italicizeSpecies.jsx'
import { useQuizSession } from '../../context/QuizSessionContext.jsx'
import { getCategoryBreakdown, getWeakestCategory } from '../../utils/selectors.js'
import { MODE_CONFIG } from '../../utils/modes.js'
import Button from '../shared/Button.jsx'
import Card from '../shared/Card.jsx'
import Badge from '../shared/Badge.jsx'
import ScoreSubmitModal from '../shared/ScoreSubmitModal.jsx'
import QuestionReferences from '../shared/QuestionReferences.jsx'
import { isConfigured } from '../../firebase.js'

function getGrade(percent) {
  if (percent >= 90) return { label: 'Expert', emoji: '🏆', color: 'text-accent-amber' }
  if (percent >= 75) return { label: 'Advanced', emoji: '🎓', color: 'text-accent-teal' }
  if (percent >= 60) return { label: 'Intermediate', emoji: '📚', color: 'text-accent-cyan' }
  if (percent >= 40) return { label: 'Beginner', emoji: '🌱', color: 'text-accent-success' }
  return { label: 'Keep Learning', emoji: '💡', color: 'text-text-secondary' }
}

function ResultsPage() {
  const navigate = useNavigate()
  const { lastResults, startQuiz } = useQuizSession()
  const [expandedQuestion, setExpandedQuestion] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [displayPercent, setDisplayPercent] = useState(0)
  const animFrameRef = useRef(null)

  // Hydrate from persisted lastResults (refresh-safe)
  const results = lastResults
  const score = results?.score
  const total = results?.total
  const percent = results?.percent || 0
  const answers = results?.answers || []
  const questions = results?.questions || []
  const config = results?.config
  const sessionMode = results?.mode || 'exam'

  // Animated score count-up
  useEffect(() => {
    if (score === undefined) return
    const target = percent
    const duration = 1500
    const startTime = performance.now()

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayPercent(Math.round(eased * target))
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      }
    }
    animFrameRef.current = requestAnimationFrame(animate)
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current) }
  }, [score, percent])

  // Show leaderboard prompt after animation
  useEffect(() => {
    if (score !== undefined) {
      const timer = setTimeout(() => setShowScoreModal(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [score])

  // Category breakdown
  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(answers, questions),
    [answers, questions]
  )

  // Weakest category
  const weakest = useMemo(
    () => getWeakestCategory(answers, questions, categories),
    [answers, questions]
  )

  if (!results || (score === undefined && score !== 0)) {
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

  const grade = getGrade(percent)
  const modeLabel = MODE_CONFIG[sessionMode]?.label || 'Quiz'

  const quizUrl = 'https://kristofmoeller.com/quiz/'
  const shareText = `I scored ${score}/${total} (${percent}%) on the HAB & Marine Biotoxins Quiz! ${grade.emoji} ${grade.label} — test your knowledge on harmful algal blooms and marine biotoxins:`

  const handleCopy = async () => {
    const text = `${shareText} ${quizUrl}`
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
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
      if (navigator.share) {
        navigator.share({ title: 'HAB Quiz Result', text }).catch(() => {})
      }
    }
  }

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(quizUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(quizUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handlePracticeWeakest = () => {
    if (!weakest) return
    const count = startQuiz({
      categories: [weakest.categoryId],
      difficulty: 'mixed',
      timedMode: false,
      timePerQuestion: 30,
      questionCount: 10,
    }, 'study')
    if (count > 0) navigate('/play')
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
          <Badge color="teal" className="mb-2">{modeLabel} Mode</Badge>
          <div className="text-6xl mb-2">{grade.emoji}</div>
          <h1 className={`font-display font-extrabold text-5xl sm:text-6xl ${grade.color}`}>
            {displayPercent}%
          </h1>
          <p className="font-display font-semibold text-xl sm:text-2xl text-text-primary mt-1">
            {grade.label}
          </p>
          <p className="font-mono text-text-secondary text-lg">
            {score} / {total} correct
          </p>
        </motion.div>

        {/* Weakest Category Coaching */}
        {weakest && weakest.percent < 100 && (
          <Card className="border border-accent-amber/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-accent-amber flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display font-semibold text-base text-text-primary">
                  Weakest Category: {weakest.categoryIcon} {weakest.categoryName}
                </h2>
                <p className="text-text-secondary text-sm mt-1">
                  You scored {weakest.correct}/{weakest.total} ({weakest.percent}%) in this category.
                  {weakest.percent < 50
                    ? ' Consider reviewing the fundamentals in this area.'
                    : ' A few more practice rounds should help solidify your knowledge.'}
                </p>
                <Button size="sm" variant="secondary" className="mt-3" onClick={handlePracticeWeakest}>
                  <BookOpen className="w-4 h-4" />
                  Practice {weakest.categoryName}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Category Breakdown */}
        <Card>
          <h2 className="font-display font-semibold text-lg text-text-primary mb-4">
            Performance by Category
          </h2>
          <div className="space-y-4">
            {Object.entries(categoryBreakdown).map(([catId, data]) => {
              const cat = categories.find((c) => c.id === catId)
              const catPercent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
              return (
                <div key={catId}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-secondary">
                      {cat?.icon} {cat?.name || catId}
                    </span>
                    <span className="font-mono text-text-primary">
                      {data.correct}/{data.total}
                      {data.unknown > 0 && (
                        <span className="text-text-tertiary ml-1">({data.unknown} unknown)</span>
                      )}
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
              const isCorrect = a?.outcome === 'correct'

              return (
                <div
                  key={q.id}
                  className="border border-gray-100 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                    className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    {isCorrect ? (
                      <Check className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                    ) : a?.outcome === 'unknown' ? (
                      <span className="w-5 h-5 text-accent-amber flex-shrink-0 mt-0.5 text-center font-bold">?</span>
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
                        {a?.outcome === 'unknown' && <Badge color="amber">Unknown</Badge>}
                        {a?.outcome === 'timeout' && <Badge color="amber">Timeout</Badge>}
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
                      <QuestionReferences
                        references={q.references}
                        sourceShort={q.sourceShort}
                        jurisdiction={q.jurisdiction}
                      />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 py-4">
          {isConfigured && (
            <Button onClick={() => setShowScoreModal(true)} variant="secondary" size="sm">
              <Trophy className="w-4 h-4" />
              Submit to Leaderboard
            </Button>
          )}
          <Button onClick={handleShareLinkedIn} variant="secondary" size="sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            LinkedIn
          </Button>
          <Button onClick={handleShareTwitter} variant="secondary" size="sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.254 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on X
          </Button>
          <Button onClick={handleCopy} variant="secondary" size="sm">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy result'}
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

      <ScoreSubmitModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        score={score}
        total={total}
        percent={percent}
        config={config}
      />
    </div>
  )
}

export default ResultsPage
