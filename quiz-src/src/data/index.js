import shellfishPoisoning from './questions/shellfish_poisoning.json'
import organisms from './questions/organisms.json'
import toxinChemistry from './questions/toxin_chemistry.json'
import monitoring from './questions/monitoring.json'
import environment from './questions/environment.json'
import healthSafety from './questions/health_safety.json'
import categories from './categories.json'

const allQuestions = [
  ...shellfishPoisoning,
  ...organisms,
  ...toxinChemistry,
  ...monitoring,
  ...environment,
  ...healthSafety,
]

export { allQuestions, categories }

export const getQuestionsByCategory = (categoryId) =>
  allQuestions.filter((q) => q.category === categoryId)

export const getQuestionsByDifficulty = (difficulty) =>
  allQuestions.filter((q) => q.difficulty === difficulty)

export const getFilteredQuestions = ({ categories: cats, difficulty }) => {
  let filtered = allQuestions
  if (cats && cats.length > 0) {
    filtered = filtered.filter((q) => cats.includes(q.category))
  }
  if (difficulty && difficulty !== 'mixed') {
    filtered = filtered.filter((q) => q.difficulty === difficulty)
  }
  return filtered
}

// Fisher-Yates shuffle
export const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const selectQuestions = ({ categories: cats, difficulty, count }) => {
  const filtered = getFilteredQuestions({ categories: cats, difficulty })
  const shuffled = shuffleArray(filtered)
  const selected = shuffled.slice(0, Math.min(count, shuffled.length))
  return selected.map((q) => ({
    ...q,
    answers: shuffleArray(q.answers),
  }))
}
