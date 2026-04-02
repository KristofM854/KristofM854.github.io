const colorMap = {
  teal: 'bg-blue-50 text-blue-700 border-blue-200',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  purple: 'bg-violet-50 text-violet-700 border-violet-200',
  pink: 'bg-pink-50 text-pink-700 border-pink-200',
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
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colorMap[resolvedColor]} ${className}`}
    >
      {children || difficulty}
    </span>
  )
}

export default Badge
