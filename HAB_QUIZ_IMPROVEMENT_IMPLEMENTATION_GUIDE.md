# HAB Quiz Improvement Implementation Guide

## Scope
This guide captures the next-priority product and engineering improvements for the HAB quiz app. It includes:
- architecture direction
- usability improvements
- accessibility improvements
- technical robustness improvements
- learning modes
- weakest-category coaching
- literature-backed content refinement workflow

---

## 1. Product architecture direction

### 1.1 Recommended architecture change
Move from a mainly page-level state flow driven by router state and local component hooks toward a clearer app architecture with:

1. **content layer**
   - question bank JSON files
   - category metadata
   - structured source metadata
   - question validation utilities

2. **domain/state layer**
   - central quiz session state
   - persistent user stats/preferences state
   - review queue / flagged questions state
   - derived analytics (weakest category, mastery, mode-specific progress)

3. **presentation layer**
   - routes/pages
   - reusable UI components
   - accessibility helpers
   - motion/styling

4. **mode engine**
   - exam mode
   - study mode
   - review mode
   - shared rules with mode-specific behavior toggles

### 1.2 Why this is helpful
Benefits:
- prevents logic duplication across pages
- makes session recovery and refresh resilience much easier
- makes adding new modes far easier than hard-coding behavior into `QuizPlayPage`
- lets results and analytics be derived from a single source of truth
- supports future additions such as spaced repetition, question review queues, and adaptive difficulty
- makes testing easier because quiz logic can be validated separately from the UI

### 1.3 Recommended implementation shape
Create a small centralized state model for the active quiz session instead of relying on route state alone.

Suggested building blocks:
- `QuizSessionProvider` or equivalent state container
- `useQuizSession()` hook for active run state
- `useQuizPreferences()` hook for saved settings
- `useQuizAnalytics()` hook for derived insights
- `useQuestionReviewQueue()` for missed / flagged / uncertain questions

Suggested session model:
```js
{
  mode: 'exam' | 'study' | 'review',
  config: {
    categories: [],
    difficulty: 'beginner' | 'intermediate' | 'expert' | 'mixed',
    timedMode: false,
    timePerQuestion: 30,
    questionCount: 10
  },
  session: {
    id: 'uuid',
    startedAt: '',
    status: 'idle' | 'active' | 'paused' | 'completed' | 'abandoned',
    currentIndex: 0,
    questionIds: [],
    answers: [],
    flaggedQuestionIds: [],
    uncertainQuestionIds: [],
    reviewQueueIds: []
  }
}
```

### 1.4 Persistence direction
Persist the following separately:
- `hab-quiz-preferences`
- `hab-quiz-stats`
- `hab-quiz-active-session`
- `hab-quiz-review-queue`
- `hab-quiz-last-results`

### 1.5 Selector-first analytics architecture
Create reusable selectors / utilities such as:
- `getAvailableQuestionCount(config, allQuestions)`
- `getCategoryBreakdown(answers, questions)`
- `getWeakestCategory(answers, questions, categories)`
- `getReviewQueue({ answers, flaggedQuestionIds, uncertainQuestionIds })`
- `getModeAdjustedQuestionSet({ mode, config, allQuestions, reviewQueue })`

### 1.6 Page responsibilities after refactor
- **Welcome page**: entry point, resume prompt, stats overview, launch exam/study/review mode
- **Setup page**: configure categories, difficulty, timing, question count, mode; show availability warnings and counts
- **Play page**: render current question; dispatch answer / unknown / flag / next actions; never own authoritative quiz state directly
- **Results page**: read finalized session summary; show score, breakdown, weakest category, review launch actions; be refresh-safe via persisted summary

---

## 2. Usability improvements

### 2.1 Filter-aware question availability
On the setup page, show the exact number of eligible questions for the selected categories + difficulty.

Requirements:
- compute the filtered pool live as the user changes settings
- display text such as:
  - `14 questions available for this selection`
  - `You requested 20 questions, but only 14 are available`
- disable impossible combinations or automatically cap the selected count
- if the filtered pool is small, warn the user that repetition may occur across sessions

### 2.2 Session persistence and resume
Requirements:
- save active session state after every answer and relevant transition
- on app load, check for an unfinished active session
- prompt user: `Resume previous quiz` or `Discard and start new`
- restore timer state sensibly

### 2.3 “I don’t know” option
Requirements:
- add `I don't know` button in play mode
- record answer status as `unknown`
- treat as incorrect for score unless mode rules say otherwise
- include these in review mode priority

Suggested answer shape:
```js
{
  questionId: '...',
  selectedAnswer: null,
  outcome: 'correct' | 'incorrect' | 'unknown' | 'timeout',
  confidence: 'unknown'
}
```

### 2.4 Mark for review later
Requirements:
- add `Mark for review` action during quiz and on feedback card
- store question IDs in review queue
- surface review queue on results page
- allow user to launch a review session from these questions only

### 2.5 Better results coaching
Requirements:
- identify weakest category among categories with enough answered questions
- display an insight card such as:
  - `Weakest category: Monitoring & Detection (2/6 correct)`
  - `You missed several questions on screening vs confirmatory methods and regulatory thresholds`
- include a CTA to practice this category again or start review mode

### 2.6 Empty-state and edge-case handling
Requirements:
- if no questions match filters, explain why and suggest a change
- if only a few questions match, show a note before starting
- if the result page is refreshed, reconstruct results from persisted session rather than dropping to `No results`

---

## 3. Accessibility improvements

### 3.1 Semantic controls
Requirements:
- add `aria-pressed` to selectable buttons
- add `role="switch"` and `aria-checked` to timed mode toggle
- use proper labels for timer, difficulty, categories, and question count controls
- ensure category cards used as buttons are announced correctly

### 3.2 Keyboard navigation
Requirements:
- logical tab order
- visible focus ring on all interactive elements
- Enter / Space activates buttons consistently
- Escape closes modals where appropriate
- modal focus trap
- focus restoration to triggering control

### 3.3 Screen-reader answer feedback
Requirements:
- add an `aria-live="polite"` region for answer result feedback
- announce `Correct`, `Incorrect. Correct answer: ...`, and `Time expired`
- do not rely on color alone

### 3.4 Color and contrast
Requirements:
- verify WCAG AA contrast for body text, muted text, and badges
- ensure correct/incorrect/selected states differ by icon/text as well as color
- ensure focus outline is strong enough against dark backgrounds

### 3.5 Reduced motion support
Requirements:
- disable or simplify decorative and feedback animation when reduced motion is requested
- do not communicate essential information only through animation

### 3.6 Image accessibility for future species ID items
Requirements:
- every image question must include meaningful alt text
- avoid alt text that reveals the answer directly if the image itself is the prompt
- keep text labels present for image answer choices

---

## 4. Technical robustness improvements

### 4.1 Refactor localStorage hook
Requirements:
- support functional updates using the latest internal state
- keep React state update and localStorage write synchronized
- add schema-safe fallback when parsing fails
- optionally support versioned migrations later

Recommended pattern:
```js
setStoredValue((prev) => {
  const valueToStore = typeof value === 'function' ? value(prev) : value
  localStorage.setItem(key, JSON.stringify(valueToStore))
  return valueToStore
})
```

### 4.2 More robust timer model
Refactor the timer to use timestamps rather than decrementing float state with `setInterval`.

Requirements:
- store `startedAt`, `durationMs`, and `expiresAt`
- derive `timeLeft` from `expiresAt - now`
- use `requestAnimationFrame` or a light interval only for display refresh
- on resume, recompute whether the timer should expire immediately or restart per mode rules

### 4.3 Centralized session persistence
Requirements:
- save on start, answer, next question, flag, mark unknown, and quit
- clear active session on final completion or explicit discard
- version stored session schema for future updates

### 4.4 Decouple results page from router-only state
Requirements:
- persist final session summary in storage
- allow results page to reconstruct from session ID or latest completed session
- if route state is missing, fall back to persisted results

### 4.5 Validation layer for question data
Requirements:
- validate required fields at startup or build time
- ensure exactly one correct answer exists
- ensure category IDs exist in category metadata
- ensure difficulty values are valid
- validate image question schema where applicable

### 4.6 Derived-state utilities
Move repeated analytics and filtering logic out of pages.

### 4.7 Testing priorities
Add automated tests for:
- question filtering and count logic
- scoring and answer outcome logic
- weakest-category calculation
- session persistence and hydration
- timer expiration behavior
- review-mode queue selection

---

## 5. Learning modes

### 5.1 Exam mode
Purpose: assessment.
Behavior:
- score-focused
- optional timed mode
- no extra scaffolding beyond answer feedback and explanations
- standard final score and category breakdown

### 5.2 Study mode
Purpose: guided learning.
Behavior:
- allow `I don't know`
- explanations emphasized
- timer off by default
- missed and unknown questions added to review queue automatically

### 5.3 Review mode
Purpose: targeted reinforcement.
Behavior:
- draws only from previously incorrect, unknown, flagged, or manually bookmarked questions
- launchable from results and welcome pages
- clearly label why each question is in the review set

Suggested mode config:
```js
const MODE_CONFIG = {
  exam:   { allowUnknown: false, autoAddMissedToReview: false, defaultTimed: true },
  study:  { allowUnknown: true,  autoAddMissedToReview: true,  defaultTimed: false },
  review: { allowUnknown: true,  autoAddMissedToReview: true,  defaultTimed: false }
}
```

---

## 6. Weakest-category coaching

### 6.1 Rules
Compute weakest category only among categories with a meaningful answered count.
Suggested rule:
- include categories with at least 2 answered questions
- choose lowest percent correct
- if tied, use larger number wrong as tiebreaker

### 6.2 UI requirements
Add a dedicated results card showing:
- weakest category name and icon
- score in that category
- short diagnostic text
- CTA to practice again

Suggested selector:
```js
getWeakestCategory(answers, questions, categories)
```

Suggested return value:
```js
{
  categoryId: 'monitoring',
  correct: 2,
  total: 6,
  percent: 33,
  missedQuestionIds: ['...']
}
```

---

## 7. Literature-backed content refinement workflow

### 7.1 Add a dedicated repo file
Add the literature-backed refinement document to the repo and treat it as the working source for question-bank updates:
- `HAB_QUIZ_LITERATURE_BACKED_REFINEMENT_PASS.md`

### 7.2 Coding-agent step
Before editing any question JSON file, the coding agent must:
1. open `HAB_QUIZ_LITERATURE_BACKED_REFINEMENT_PASS.md`
2. identify the category section being worked on
3. for each proposed item:
   - check whether the concept already exists in the current JSON file
   - do not add near-duplicates
   - replace flagged weak items where the refinement document says `REPLACE`
   - add only items marked `ADD`
4. preserve IDs unless the refinement document explicitly says to retire and replace them
5. add structured `references` and `sourceShort` metadata to updated questions

### 7.3 Duplicate-check rule
Treat a question as a duplicate if any of the following are true:
- same core fact
- same learning objective with different wording
- same correct answer and same conceptual contrast among distractors

### 7.4 Question metadata expansion
When updating JSON, add or support:
- `references`
- `sourceShort`
- `learningObjective`
- `lastReviewed`
- optional `reviewFlag`
- optional `jurisdiction` for regulation questions

### 7.5 Validation requirement
After editing JSON:
- run schema validation
- run duplicate/near-duplicate scan
- confirm each category still contains a balanced mix of beginner/intermediate/expert questions

---

## 8. Suggested implementation order
1. refactor persistence foundations
2. add derived selectors
3. upgrade setup page UX
4. upgrade play page UX
5. upgrade results page
6. accessibility pass
7. timer refactor
8. literature-backed question refresh
9. testing pass
