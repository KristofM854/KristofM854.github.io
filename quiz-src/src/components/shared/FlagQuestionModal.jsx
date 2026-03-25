import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag, X, Check } from 'lucide-react'
import { submitFlag, isConfigured } from '../../firebase.js'
import Button from './Button.jsx'

function FlagQuestionModal({ isOpen, onClose, question }) {
  const [concern, setConcern] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await submitFlag({
        questionId: question?.id,
        questionText: question?.question,
        concern: concern.trim(),
      })
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setConcern('')
        onClose()
      }, 1500)
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  // If Firebase is not configured, use a mailto fallback
  const handleFallbackSubmit = () => {
    const subject = encodeURIComponent(`HAB Quiz Flag: ${question?.id}`)
    const body = encodeURIComponent(
      `Question ID: ${question?.id}\nQuestion: ${question?.question}\n\nConcern: ${concern || '(no details provided)'}`
    )
    window.open(`mailto:kristof.moeller@iaea.org?subject=${subject}&body=${body}`, '_blank')
    onClose()
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
              <div className="text-center space-y-3 py-4">
                <Check className="w-10 h-10 text-accent-success mx-auto" />
                <p className="text-text-primary font-display font-semibold">
                  Thank you for the feedback!
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-lg text-text-primary flex items-center gap-2">
                    <Flag className="w-5 h-5 text-accent-amber" />
                    Flag Question
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-text-tertiary hover:text-text-primary transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-ocean-900/40 border border-white/5 rounded-xl p-3 mb-4">
                  <p className="text-text-secondary text-xs mb-1 font-mono">{question?.id}</p>
                  <p className="text-text-primary text-sm leading-relaxed">
                    {question?.question}
                  </p>
                </div>

                <p className="text-text-secondary text-sm mb-3">
                  Is something inaccurate or unclear? Describe the issue below (optional).
                </p>

                <textarea
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  placeholder="e.g. The correct answer should be B, not C because..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-ocean-900/60 border border-white/10 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-teal/50 font-body text-sm mb-4 resize-none"
                />

                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={isConfigured ? handleSubmit : handleFallbackSubmit}
                    disabled={submitting}
                    variant="secondary"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {submitting ? 'Submitting...' : 'Submit Flag'}
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

export default FlagQuestionModal
