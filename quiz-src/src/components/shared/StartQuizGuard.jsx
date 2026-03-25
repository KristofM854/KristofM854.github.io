import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizSession } from '../../context/QuizSessionContext.jsx'
import Modal from './Modal.jsx'
import Button from './Button.jsx'

/**
 * Hook that wraps startQuiz with a guard modal.
 * If an active session exists, shows confirmation before replacing it.
 * Returns { guardedStartQuiz, GuardModal }
 */
export function useStartQuizGuard() {
  const { hasUnfinishedSession, startQuiz, discardSession, resumeSession } = useQuizSession()
  const navigate = useNavigate()
  const [pendingConfig, setPendingConfig] = useState(null)
  const [pendingMode, setPendingMode] = useState(null)

  const guardedStartQuiz = useCallback((config, mode) => {
    if (hasUnfinishedSession) {
      setPendingConfig(config)
      setPendingMode(mode)
      return 0 // Signal: not started yet, waiting for confirmation
    }
    const count = startQuiz(config, mode)
    if (count > 0) navigate('/play')
    return count
  }, [hasUnfinishedSession, startQuiz, navigate])

  const handleConfirmReplace = useCallback(() => {
    discardSession()
    if (pendingConfig) {
      const count = startQuiz(pendingConfig, pendingMode)
      setPendingConfig(null)
      setPendingMode(null)
      if (count > 0) navigate('/play')
    }
  }, [discardSession, startQuiz, pendingConfig, pendingMode, navigate])

  const handleResume = useCallback(() => {
    setPendingConfig(null)
    setPendingMode(null)
    resumeSession()
    navigate('/play')
  }, [resumeSession, navigate])

  const handleCancel = useCallback(() => {
    setPendingConfig(null)
    setPendingMode(null)
  }, [])

  const GuardModal = (
    <Modal
      isOpen={!!pendingConfig}
      onClose={handleCancel}
      title="Active Quiz in Progress"
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="secondary" size="sm" onClick={handleResume}>
            Resume Current
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmReplace}>
            Discard & Start New
          </Button>
        </>
      }
    >
      <p>You have an active quiz session. Starting a new one will discard your current progress.</p>
    </Modal>
  )

  return { guardedStartQuiz, GuardModal }
}
