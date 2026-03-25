import { useQuizSession } from '../context/QuizSessionContext.jsx'

export default function useQuizPreferences() {
  const { preferences, setPreferences } = useQuizSession()
  return [preferences, setPreferences]
}
