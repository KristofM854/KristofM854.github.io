function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-ocean-950" />

      {/* Radial gradient layers for depth */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(8, 145, 178, 0.08) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at 80% 20%, rgba(0, 212, 170, 0.06) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(15, 32, 53, 0.9) 0%, transparent 60%)',
        }}
      />

      {/* Subtle bioluminescent particles */}
      <div className="absolute w-2 h-2 rounded-full bg-accent-teal/20 animate-float" style={{ top: '15%', left: '10%' }} />
      <div className="absolute w-1.5 h-1.5 rounded-full bg-accent-cyan/20 animate-float" style={{ top: '45%', left: '85%', animationDelay: '2s' }} />
      <div className="absolute w-1 h-1 rounded-full bg-accent-teal/15 animate-float" style={{ top: '70%', left: '25%', animationDelay: '4s' }} />
      <div className="absolute w-2 h-2 rounded-full bg-accent-cyan/15 animate-float" style={{ top: '30%', left: '65%', animationDelay: '1s' }} />
      <div className="absolute w-1 h-1 rounded-full bg-accent-teal/20 animate-float" style={{ top: '85%', left: '55%', animationDelay: '3s' }} />
    </div>
  )
}

export default BackgroundEffects
