import { Outlet, Link, useLocation } from 'react-router-dom'
import { Waves, FlaskConical, Info, RotateCcw } from 'lucide-react'
import { useQuizSession } from '../context/QuizSessionContext.jsx'
import BackgroundEffects from './shared/BackgroundEffects.jsx'

function Layout() {
  const location = useLocation()
  const { reviewQueue } = useQuizSession()

  // Count normalized review queue
  const reviewCount = reviewQueue?.length || 0

  const navLinks = [
    { to: '/', label: 'Home', icon: Waves },
    { to: '/setup', label: 'Quiz', icon: FlaskConical },
    { to: '/review', label: 'Review', icon: RotateCcw, badge: reviewCount },
    { to: '/about', label: 'About', icon: Info },
  ]

  return (
    <div className="relative min-h-[100dvh] flex flex-col">
      <BackgroundEffects />

      {/* Preview banner */}
      <div className="relative z-10 bg-accent-amber/10 border-b border-accent-amber/20 py-1.5 text-center">
        <p className="text-accent-amber text-xs font-medium">
          Preview version — feel free to try it out.
        </p>
      </div>

      <header className="relative z-10 border-b border-white/8">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Waves className="w-6 h-6 text-accent-teal group-hover:animate-float transition-colors" />
            <span className="font-display font-bold text-lg text-text-primary">
              HAB Quiz
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon, badge }) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-accent-teal bg-accent-teal/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-semibold rounded-full bg-accent-amber text-ocean-950">
                      {badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-white/8 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-text-tertiary text-sm">
          <p>Designed by Kristof Moeller</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
