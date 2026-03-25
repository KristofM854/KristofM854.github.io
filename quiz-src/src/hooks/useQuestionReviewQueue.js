import { useQuizSession } from '../context/QuizSessionContext.jsx'

export default function useQuestionReviewQueue() {
  const { reviewQueue, removeFromReviewQueue, clearReviewQueue } = useQuizSession()
  return { reviewQueue, removeFromReviewQueue, clearReviewQueue }
}
