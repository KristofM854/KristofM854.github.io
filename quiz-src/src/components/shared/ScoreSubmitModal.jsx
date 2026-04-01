import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X } from 'lucide-react'
import { submitScore, isConfigured } from '../../firebase.js'
import Button from './Button.jsx'

function ScoreSubmitModal({ isOpen, onClose, score, total, percent, config }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isConfigured) return null

  const handleSubmit = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await submitScore({
        name: name.trim(),
        score,
        total,
        percent,
        difficulty: config?.difficulty || 'mixed',
        categories: config?.categories?.join(', ') || 'all',
      })
      setSubmitted(true)
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-ocean-800 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
          >
            {submitted ? (
              <div className="text-center space-y-4">
                <Trophy className="w-12 h-12 text-accent-amber mx-auto" />
                <h3 className="font-display font-semibold text-xl text-text-primary">
                  Score Submitted!
                </h3>
                <p className="text-text-secondary text-sm">
                  Your score of {percent}% has been added to the leaderboard.
                </p>
                <Button size="sm" onClick={onClose}>
                  Close
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent-amber" />
                    Join the Leaderboard
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-text-tertiary hover:text-text-primary transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-text-secondary text-sm mb-5">
                  You scored <span className="text-accent-teal font-semibold">{percent}%</span> ({score}/{total}).
                  Enter your name to appear on the global leaderboard.
                </p>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Your name"
                  maxLength={30}
                  className="w-full px-4 py-3 rounded-xl bg-ocean-900/60 border border-white/10 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-teal/50 font-body text-sm mb-5"
                  autoFocus
                />

                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    Skip
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!name.trim() || submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Score'}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScoreSubmitModal
