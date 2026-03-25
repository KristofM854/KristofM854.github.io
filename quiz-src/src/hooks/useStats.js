import useLocalStorage from './useLocalStorage'

const defaultStats = {
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  totalSessions: 0,
  bestScore: { percent: 0, date: null, config: {} },
  categoryStats: {},
  streakCurrent: 0,
  streakBest: 0,
}

export default function useStats() {
  const [stats, setStats] = useLocalStorage('hab-quiz-stats', defaultStats)

  const recordAnswer = (categoryId, isCorrect) => {
    setStats((prev) => {
      const catStats = prev.categoryStats[categoryId] || { answered: 0, correct: 0 }
      const newStreak = isCorrect ? prev.streakCurrent + 1 : 0
      return {
        ...prev,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        categoryStats: {
          ...prev.categoryStats,
          [categoryId]: {
            answered: catStats.answered + 1,
            correct: catStats.correct + (isCorrect ? 1 : 0),
          },
        },
        streakCurrent: newStreak,
        streakBest: Math.max(prev.streakBest, newStreak),
      }
    })
  }

  const recordSession = (score, total, config) => {
    const percent = total > 0 ? Math.round((score / total) * 100) : 0
    setStats((prev) => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      bestScore:
        percent > prev.bestScore.percent
          ? { percent, date: new Date().toISOString(), config }
          : prev.bestScore,
    }))
  }

  return { stats, recordAnswer, recordSession }
}
