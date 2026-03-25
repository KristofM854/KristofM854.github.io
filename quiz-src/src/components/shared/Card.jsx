function Card({ className = '', hover = false, glow = false, children, ...props }) {
  return (
    <div
      className={`bg-ocean-800/60 backdrop-blur-sm border border-white/8 rounded-2xl p-7 sm:p-9 ${
        hover ? 'hover:bg-ocean-700/60 hover:border-white/12 transition-all duration-200' : ''
      } ${glow ? 'animate-glow-pulse' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
