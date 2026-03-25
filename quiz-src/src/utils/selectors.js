import { getFilteredQuestions, shuffleArray } from '../data/index.js'

/**
 * Count available questions for a given config
 */
export function getAvailableQuestionCount(config, allQuestions) {
  const filtered = getFilteredQuestions({
    categories: config.categories,
    difficulty: config.difficulty,
  })
  return filtered.length
}

/**
 * Compute category breakdown from answers + questions
 */
export function getCategoryBreakdown(answers, questions) {
  const breakdown = {}
  answers.forEach((a, i) => {
    const q = questions[i]
    if (!q) return
    if (!breakdown[q.category]) {
      breakdown[q.category] = { correct: 0, incorrect: 0, unknown: 0, total: 0, missedIds: [] }
    }
    breakdown[q.category].total++
    if (a.outcome === 'correct') {
      breakdown[q.category].correct++
    } else {
      if (a.outcome === 'unknown') breakdown[q.category].unknown++
      else breakdown[q.category].incorrect++
      breakdown[q.category].missedIds.push(q.id)
    }
  })
  return breakdown
}

/**
 * Find the weakest category (lowest % correct, min 2 answered, ties broken by most wrong)
 */
export function getWeakestCategory(answers, questions, categories) {
  const breakdown = getCategoryBreakdown(answers, questions)
  let weakest = null

  for (const [catId, data] of Object.entries(breakdown)) {
    if (data.total < 2) continue
    const percent = Math.round((data.correct / data.total) * 100)
    const wrong = data.total - data.correct

    if (
      !weakest ||
      percent < weakest.percent ||
      (percent === weakest.percent && wrong > weakest.wrong)
    ) {
      const cat = categories.find((c) => c.id === catId)
      weakest = {
        categoryId: catId,
        categoryName: cat?.name || catId,
        categoryIcon: cat?.icon || '',
        correct: data.correct,
        total: data.total,
        percent,
        wrong,
        missedQuestionIds: data.missedIds,
      }
    }
  }

  return weakest
}

/**
 * Build the review queue from answers + flagged + uncertain
 */
export function getReviewQueue({ answers, questions, flaggedQuestionIds = [], uncertainQuestionIds = [] }) {
  const missedIds = []
  answers.forEach((a, i) => {
    if (a.outcome !== 'correct' && questions[i]) {
      missedIds.push(questions[i].id)
    }
  })

  const allIds = new Set([...missedIds, ...flaggedQuestionIds, ...uncertainQuestionIds])
  return [...allIds]
}

/**
 * Select questions adjusted for mode (review mode uses queue)
 */
export function getModeAdjustedQuestionSet({ mode, config, allQuestions, reviewQueue = [] }) {
  if (mode === 'review' && reviewQueue.length > 0) {
    const reviewQuestions = allQuestions.filter((q) => reviewQueue.includes(q.id))
    const shuffled = shuffleArray(reviewQuestions)
    const count = Math.min(config.questionCount, shuffled.length)
    return shuffled.slice(0, count).map((q) => ({
      ...q,
      answers: shuffleArray(q.answers),
    }))
  }

  // For exam/study, use standard selection
  const filtered = getFilteredQuestions({
    categories: config.categories,
    difficulty: config.difficulty,
  })
  const shuffled = shuffleArray(filtered)
  const count = Math.min(config.questionCount, shuffled.length)
  return shuffled.slice(0, count).map((q) => ({
    ...q,
    answers: shuffleArray(q.answers),
  }))
}

/**
 * Validate a question object has required fields
 */
export function validateQuestion(q) {
  const errors = []
  if (!q.id) errors.push('missing id')
  if (!q.question) errors.push('missing question text')
  if (!Array.isArray(q.answers) || q.answers.length < 2) errors.push('need at least 2 answers')
  if (!q.answers?.some((a) => a.id === q.correctAnswer)) errors.push('correctAnswer does not match any answer id')
  if (!['beginner', 'intermediate', 'expert'].includes(q.difficulty)) errors.push('invalid difficulty')
  if (!q.category) errors.push('missing category')
  return errors.length === 0 ? null : errors
}
