import { Link } from 'react-router-dom'
import { Play, FlaskConical } from 'lucide-react'
import Button from '../shared/Button.jsx'
import Card from '../shared/Card.jsx'

function WelcomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Hero */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <FlaskConical className="w-16 h-16 text-accent-teal animate-float" />
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-text-primary">
            HAB & Marine Biotoxins
          </h1>
          <p className="text-xl text-text-secondary max-w-lg mx-auto">
            Test your knowledge of Harmful Algal Blooms, marine biotoxins, and ocean health
          </p>
        </div>

        {/* Quick Start */}
        <Link to="/setup">
          <Button size="lg" className="mt-4">
            <Play className="w-5 h-5" />
            Start Quiz
          </Button>
        </Link>

        {/* Preview Card */}
        <Card className="text-left mt-8">
          <h2 className="font-display font-semibold text-lg text-text-primary mb-3">
            6 Categories &middot; 81 Questions &middot; 3 Difficulty Levels
          </h2>
          <p className="text-text-secondary text-sm">
            From shellfish poisoning syndromes to biotoxin chemistry, monitoring methods to environmental drivers — challenge yourself across the full spectrum of HAB science.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default WelcomePage
