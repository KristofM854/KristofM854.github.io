// Mode configuration for exam, study, and review modes
export const MODE_CONFIG = {
  exam: {
    label: 'Exam',
    description: 'Assessment mode — test your knowledge with scoring',
    allowUnknown: false,
    autoAddMissedToReview: false,
    defaultTimed: true,
    showExplanationsDuringQuiz: true,
  },
  study: {
    label: 'Study',
    description: 'Learning mode — take your time, use "I don\'t know"',
    allowUnknown: true,
    autoAddMissedToReview: true,
    defaultTimed: false,
    showExplanationsDuringQuiz: true,
  },
  review: {
    label: 'Review',
    description: 'Practice missed, unknown, and flagged questions',
    allowUnknown: true,
    autoAddMissedToReview: true,
    defaultTimed: false,
    showExplanationsDuringQuiz: true,
  },
}

export const MODES = Object.keys(MODE_CONFIG)
export const DEFAULT_MODE = 'exam'
