import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Trophy, Medal, Award } from 'lucide-react'
import { getTopScores, isConfigured } from '../../firebase.js'
import Card from './Card.jsx'

const RANK_ICONS = [Trophy, Medal, Award]
const RANK_COLORS = ['text-accent-amber', 'text-text-secondary', 'text-amber-700']

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl bg-ocean-900/40 border border-white/5 animate-pulse">
      <span className="w-7 h-5 bg-ocean-700 rounded" />
      <span className="flex-1 h-4 bg-ocean-700 rounded" />
      <span className="w-10 h-4 bg-ocean-700 rounded" />
    </div>
  )
}

function Leaderboard() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }
    getTopScores(10)
      .then(setScores)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!isConfigured) return null

  return (
    <Card>
      <h2 className="font-display font-semibold text-lg text-text-primary mb-5 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-accent-amber" />
        Global Leaderboard
      </h2>

      {loading ? (
        <div className="space-y-2">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : scores.length === 0 ? (
        <p className="text-text-tertiary text-sm text-center py-4">
          No scores yet. Be the first!
        </p>
      ) : (
        <div className="space-y-2">
          {scores.map((entry, i) => {
            const RankIcon = RANK_ICONS[i] || null
            const rankColor = RANK_COLORS[i] || 'text-text-tertiary'
            return (
              <motion.div
                key={entry.id}
                initial={reducedMotion ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-2.5 px-4 rounded-xl bg-ocean-900/40 border border-white/5"
              >
                <span className={`w-7 text-center font-mono text-sm font-semibold ${rankColor}`}>
                  {RankIcon ? (
                    <RankIcon className="w-5 h-5 mx-auto" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="flex-1 text-text-primary text-sm font-medium truncate">
                  {entry.name}
                </span>
                <span className="font-mono text-sm font-semibold text-accent-teal">
                  {entry.percent}%
                </span>
                <span className="font-mono text-xs text-text-tertiary w-12 text-right">
                  {entry.score}/{entry.total}
                </span>
              </motion.div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default Leaderboard
