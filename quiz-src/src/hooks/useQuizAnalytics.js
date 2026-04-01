import { useMemo } from 'react'
import { useQuizSession } from '../context/QuizSessionContext.jsx'
import { categories } from '../data/index.js'
import { getCategoryBreakdown, getWeakestCategory } from '../utils/selectors.js'

export default function useQuizAnalytics() {
  const { answers, questions } = useQuizSession()

  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(answers, questions),
    [answers, questions]
  )

  const weakestCategory = useMemo(
    () => getWeakestCategory(answers, questions, categories),
    [answers, questions]
  )

  return { categoryBreakdown, weakestCategory }
}
