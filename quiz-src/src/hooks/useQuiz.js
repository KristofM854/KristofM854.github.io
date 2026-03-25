import { useState, useCallback } from 'react'
import { selectQuestions } from '../data/index.js'

export default function useQuiz() {
  const [config, setConfig] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [status, setStatus] = useState('idle') // idle | active | completed | abandoned
  const [showFeedback, setShowFeedback] = useState(false)
  const [startTime, setStartTime] = useState(null)

  const startQuiz = useCallback((quizConfig) => {
    const selected = selectQuestions({
      categories: quizConfig.categories,
      difficulty: quizConfig.difficulty,
      count: quizConfig.questionCount,
    })
    setConfig(quizConfig)
    setQuestions(selected)
    setCurrentIndex(0)
    setAnswers([])
    setStatus('active')
    setShowFeedback(false)
    setStartTime(Date.now())
  }, [])

  const submitAnswer = useCallback(
    (selectedAnswerId, timeSpent) => {
      const currentQuestion = questions[currentIndex]
      if (!currentQuestion) return

      const isCorrect = selectedAnswerId === currentQuestion.correctAnswer
      const answer = {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswerId,
        correct: isCorrect,
        timeSpent: timeSpent || 0,
      }

      setAnswers((prev) => [...prev, answer])
      setShowFeedback(true)
      return { isCorrect, correctAnswer: currentQuestion.correctAnswer }
    },
    [questions, currentIndex]
  )

  const nextQuestion = useCallback(() => {
    setShowFeedback(false)
    if (currentIndex + 1 >= questions.length) {
      setStatus('completed')
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, questions.length])

  const abandonQuiz = useCallback(() => {
    setStatus('abandoned')
  }, [])

  const currentQuestion = questions[currentIndex] || null
  const score = answers.filter((a) => a.correct).length
  const totalAnswered = answers.length
  const progress = questions.length > 0 ? ((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100 : 0

  return {
    config,
    questions,
    currentQuestion,
    currentIndex,
    answers,
    status,
    showFeedback,
    score,
    totalAnswered,
    progress,
    startTime,
    startQuiz,
    submitAnswer,
    nextQuestion,
    abandonQuiz,
  }
}
