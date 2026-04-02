function Card({ className = '', hover = false, glow = false, children, ...props }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl p-7 sm:p-9 shadow-sm ${
        hover ? 'hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-default' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
