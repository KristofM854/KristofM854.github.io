import shellfishPoisoning from './questions/shellfish_poisoning.json'
import organisms from './questions/organisms.json'
import toxinChemistry from './questions/toxin_chemistry.json'
import monitoring from './questions/monitoring.json'
import environment from './questions/environment.json'
import healthSafety from './questions/health_safety.json'
import speciesId from './questions/species_id.json'
import categories from './categories.json'

const allQuestions = [
  ...shellfishPoisoning,
  ...organisms,
  ...toxinChemistry,
  ...monitoring,
  ...environment,
  ...healthSafety,
  ...speciesId,
]

export { allQuestions, categories }

export const getQuestionsByCategory = (categoryId) =>
  allQuestions.filter((q) => q.category === categoryId)

export const getQuestionsByDifficulty = (difficulty) =>
  allQuestions.filter((q) => q.difficulty === difficulty)

export const getFilteredQuestions = ({ categories: cats, difficulty }) => {
  // If categories array is provided but empty, no questions match
  if (Array.isArray(cats) && cats.length === 0) return []
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
    // For image questions, shuffle the image answer options; for text questions, shuffle text answers
    answers: shuffleArray(q.answers),
  }))
}

// Question types:
// - "text" (default): standard multiple-choice with text answers
// - "image": question presents an image, answers are text identifying the species
// - "image_choice": question is text, answers are images to choose from
//
// Image question schema extension:
// {
//   ...baseQuestionFields,
//   "type": "image" | "image_choice",
//   "image": "/quiz/images/questions/filename.jpg",       // for type "image"
//   "answers": [
//     { "id": "a", "text": "Species name", "image": "/quiz/images/answers/a.jpg" }  // image optional per answer
//   ]
// }
export const getQuestionType = (question) => question.type || 'text'
