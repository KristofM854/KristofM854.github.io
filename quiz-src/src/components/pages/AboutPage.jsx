import { Link } from 'react-router-dom'
import { ExternalLink, BookOpen } from 'lucide-react'
import Card from '../shared/Card.jsx'
import Button from '../shared/Button.jsx'
import ActiveSessionNotice from '../shared/ActiveSessionNotice.jsx'

function AboutPage() {
  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-12">
      <div className="max-w-2xl w-full space-y-6">
        <ActiveSessionNotice />
        <h1 className="font-display font-bold text-3xl text-text-primary text-center">
          About This Quiz
        </h1>

        <Card>
          <h2 className="font-display font-semibold text-lg text-text-primary mb-2">
            Created by Kristof Moeller
          </h2>
          <p className="text-text-secondary mb-4">
            Marine Biochemist & Associate Research Scientist at IAEA Marine Environment Laboratories, Monaco.
          </p>
          <p className="text-text-secondary mb-4">
            This interactive quiz is designed as an educational tool for students, researchers, and professionals working in the fields of marine biology, environmental science, and food safety.
          </p>
          <a
            href="https://kristofmoeller.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-accent-teal hover:text-accent-teal/80 transition-colors text-sm"
          >
            Visit kristofmoeller.com
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Card>

        <Card>
          <h2 className="font-display font-semibold text-lg text-text-primary mb-2">
            About the Content
          </h2>
          <p className="text-text-secondary mb-4">
            The quiz covers 6 categories across harmful algal blooms and marine biotoxins: shellfish poisoning syndromes, causative organisms, biotoxin chemistry, monitoring & detection, environmental drivers, and human health & food safety.
          </p>
          <p className="text-text-secondary mb-4">
            Questions draw on peer-reviewed literature, regulatory documents from EFSA, Codex Alimentarius, and EU regulations, and authoritative sources from IOC-UNESCO and other scientific bodies.
          </p>
          <Link to="/references">
            <Button variant="secondary" size="sm">
              <BookOpen className="w-4 h-4" />
              Scientific References
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default AboutPage
