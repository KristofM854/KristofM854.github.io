import { Outlet, Link, useLocation } from 'react-router-dom'
import { Waves, FlaskConical, Info } from 'lucide-react'
import BackgroundEffects from './shared/BackgroundEffects.jsx'

function Layout() {
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home', icon: Waves },
    { to: '/setup', label: 'Quiz', icon: FlaskConical },
    { to: '/about', label: 'About', icon: Info },
  ]

  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundEffects />

      <header className="relative z-10 border-b border-white/8">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Waves className="w-6 h-6 text-accent-teal group-hover:animate-float transition-colors" />
            <span className="font-display font-bold text-lg text-text-primary">
              HAB Quiz
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
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
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-white/8 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-text-tertiary text-sm">
          <p>
            Built by{' '}
            <a
              href="https://kristofmoeller.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-teal transition-colors"
            >
              Kristof Moeller
            </a>
            {' '}&middot; Marine Biochemist &middot; IAEA Environment Laboratories
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
