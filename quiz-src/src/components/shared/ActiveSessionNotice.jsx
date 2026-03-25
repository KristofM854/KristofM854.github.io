import { useNavigate } from 'react-router-dom'
import { AlertCircle, Play, Trash2 } from 'lucide-react'
import { useQuizSession } from '../../context/QuizSessionContext.jsx'
import { MODE_CONFIG } from '../../utils/modes.js'
import Card from './Card.jsx'
import Button from './Button.jsx'

/**
 * Shared active-session notice shown on Home, Setup, and About pages.
 * Gives the user resume/discard controls without blocking navigation.
 */
function ActiveSessionNotice() {
  const { hasUnfinishedSession, session, resumeSession, discardSession } = useQuizSession()
  const navigate = useNavigate()

  if (!hasUnfinishedSession) return null

  const mode = session?.mode || 'exam'
  const modeLabel = MODE_CONFIG[mode]?.label || 'Quiz'
  const answered = session?.session?.answers?.length || 0
  const total = session?.session?.questions?.length || 0

  const handleResume = () => {
    resumeSession()
    navigate('/play')
  }

  return (
    <Card className="border border-accent-amber/30 bg-accent-amber/5">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-accent-amber flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h2 className="font-display font-semibold text-base text-text-primary mb-1">
            Active {modeLabel} in Progress
          </h2>
          <p className="text-sm text-text-secondary mb-3">
            You have an unfinished session ({answered}/{total} answered).
          </p>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={handleResume}>
              <Play className="w-4 h-4" />
              Resume
            </Button>
            <Button size="sm" variant="danger" onClick={() => discardSession()}>
              <Trash2 className="w-4 h-4" />
              Discard
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ActiveSessionNotice
