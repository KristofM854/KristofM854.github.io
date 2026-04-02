import { Outlet, Link, useLocation } from 'react-router-dom'
import { Waves, FlaskConical, Info, RotateCcw } from 'lucide-react'
import { useQuizSession } from '../context/QuizSessionContext.jsx'

function Layout() {
  const location = useLocation()
  const { reviewQueue } = useQuizSession()

  const reviewCount = reviewQueue?.length || 0

  const navLinks = [
    { to: '/', label: 'Home', icon: Waves },
    { to: '/setup', label: 'Quiz', icon: FlaskConical },
    { to: '/review', label: 'Review', icon: RotateCcw, badge: reviewCount },
    { to: '/about', label: 'About', icon: Info },
  ]

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-white">
      {/* Accent line at top — matches site theme */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #2563EB, #7C3AED, #0891B2)', width: '100%' }} />

      {/* Preview banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-1.5 text-center">
        <p className="text-amber-700 text-xs font-medium">
          Preview version — feel free to try it out.
        </p>
      </div>

      <header className="border-b border-gray-200">
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
                      ? 'text-accent-teal bg-blue-50'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-semibold rounded-full bg-accent-amber text-white">
                      {badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-2">
          <p className="text-text-tertiary text-sm">Designed by Kristof Moeller</p>
          <p className="text-sm">
            <a href="/" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
              ← Back to kristofmoeller.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
