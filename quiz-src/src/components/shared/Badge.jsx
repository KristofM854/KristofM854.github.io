const colorMap = {
  teal: 'bg-accent-teal/15 text-accent-teal border-accent-teal/25',
  cyan: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/25',
  amber: 'bg-accent-amber/15 text-accent-amber border-accent-amber/25',
  danger: 'bg-accent-danger/15 text-accent-danger border-accent-danger/25',
  success: 'bg-accent-success/15 text-accent-success border-accent-success/25',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  pink: 'bg-pink-500/15 text-pink-400 border-pink-500/25',
}

const difficultyColors = {
  beginner: 'success',
  intermediate: 'amber',
  expert: 'danger',
}

function Badge({ children, color = 'teal', difficulty, className = '' }) {
  const resolvedColor = difficulty ? difficultyColors[difficulty] || 'teal' : color
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[resolvedColor]} ${className}`}
    >
      {children || difficulty}
    </span>
  )
}

export default Badge
