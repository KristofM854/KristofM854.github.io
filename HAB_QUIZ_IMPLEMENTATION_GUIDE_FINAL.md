# HAB & Marine Biotoxins Quiz — Implementation Guide for Claude Code

## Project Overview

Build an interactive educational quiz web application about Harmful Algal Blooms (HABs) and marine biotoxins. The app is a React single-page application deployed to GitHub Pages as a subfolder (`/quiz`) within an existing vanilla HTML personal website.

**Owner:** Kristof Möller, Marine Biochemist & Associate Research Scientist at IAEA Marine Environment Laboratories, Monaco  
**Purpose:** Educational tool + consulting business lead generator  
**URL:** `https://kristofmoeller.com/quiz`  
**Repo:** `KristofM854/KristofM854.github.io` (existing GitHub Pages site)

---

## 1. Architecture & Deployment Strategy

### 1.1 The Challenge
The existing repo `KristofM854.github.io` serves a vanilla HTML/CSS/JS personal website at `kristofmoeller.com`. We need to add a React app at `/quiz` WITHOUT breaking the existing site. GitHub Pages serves static files — there is no server-side routing.

### 1.2 The Solution
We use a **standalone React project** (Vite) that builds into a `/quiz` subfolder within the existing repo. The React app is configured with `base: '/quiz/'` so all asset paths are relative to that subfolder.

### 1.3 Repository Structure (Target State)
```
KristofM854.github.io/
├── index.html                  ← existing main site (UNTOUCHED)
├── about.html                  ← existing pages (UNTOUCHED)
├── css/                        ← existing styles (UNTOUCHED)
├── js/                         ← existing scripts (UNTOUCHED)
├── images/                     ← existing images (UNTOUCHED)
├── quiz/                       ← NEW: Built React quiz app
│   ├── index.html              ← React app entry point
│   ├── assets/
│   │   ├── index-[hash].js     ← Bundled React app
│   │   └── index-[hash].css    ← Bundled styles
│   └── 404.html                ← SPA fallback (copy of index.html)
├── quiz-src/                   ← NEW: React source code (for development)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── styles/
│   │   └── utils/
│   └── ...
└── .gitignore
```

**Key decisions:**
- `quiz-src/` contains the React source code and dev dependencies
- `quiz/` contains only the production build output (what users see)
- The Vite build step compiles `quiz-src/` → `quiz/`
- The `.gitignore` should NOT ignore `quiz/` (it must be committed for GitHub Pages)
- The `.gitignore` SHOULD ignore `quiz-src/node_modules/`

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React 18+ (via Vite) | Fast builds, future React Native migration path |
| Build Tool | Vite | Fastest dev server, simple config, excellent for GH Pages |
| Styling | Tailwind CSS 3 | Utility-first, responsive by default, dark theme support |
| Routing | React Router v6 (HashRouter) | HashRouter avoids GH Pages 404 issues with client-side routes |
| State | React useState/useReducer | No need for Redux — quiz state is simple |
| Persistence | localStorage | Save progress, high scores, settings between sessions |
| Animations | Framer Motion | Smooth transitions, answer feedback, score reveals |
| Icons | Lucide React | Clean, consistent icon set |
| Deployment | GitHub Pages (static files) | Free, already configured for the repo |
| Fonts | Google Fonts (loaded via CDN) | See design section |

### 2.1 Why HashRouter (Important!)
GitHub Pages does not support server-side URL rewriting. If a user navigates to `kristofmoeller.com/quiz/category/psp` and refreshes, GitHub Pages looks for a file at that path and returns 404. **HashRouter** avoids this entirely by putting routes after `#`:
- `kristofmoeller.com/quiz/#/` → Home
- `kristofmoeller.com/quiz/#/play` → Active quiz
- `kristofmoeller.com/quiz/#/results` → Results screen
- `kristofmoeller.com/quiz/#/about` → About/credits

This works reliably on GitHub Pages with zero configuration.

---

## 3. Design Specification

### 3.1 Theme: "Deep Ocean"
An immersive dark theme evoking the deep ocean — dark navy backgrounds, bioluminescent teal/cyan accents, with subtle particle or wave effects. Scientific yet inviting. Should feel like a premium educational tool, not a toy.

### 3.2 Color Palette (CSS Variables)
```css
:root {
  /* Backgrounds */
  --bg-primary: #0a1628;        /* Deep ocean navy */
  --bg-secondary: #0f2035;      /* Slightly lighter navy */
  --bg-card: #132a42;           /* Card/panel background */
  --bg-card-hover: #1a3654;     /* Card hover state */

  /* Accent colors */
  --accent-primary: #00d4aa;    /* Bioluminescent teal — primary CTA */
  --accent-secondary: #0891b2;  /* Cyan/cerulean — secondary actions */
  --accent-warm: #f59e0b;       /* Amber — scores, streaks, warnings */
  --accent-danger: #ef4444;     /* Red — wrong answers */
  --accent-success: #10b981;    /* Green — correct answers */

  /* Text */
  --text-primary: #e8f0f8;      /* Primary text (off-white, slight blue tint) */
  --text-secondary: #8ba4bd;    /* Secondary/muted text */
  --text-tertiary: #5a7a96;     /* Disabled/hint text */

  /* Borders & Surfaces */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(0, 212, 170, 0.4);
  --glow-primary: 0 0 20px rgba(0, 212, 170, 0.15);
  --glow-strong: 0 0 30px rgba(0, 212, 170, 0.3);
}
```

### 3.3 Typography
- **Display/Headings:** "Outfit" (Google Fonts) — geometric sans-serif, modern but warm, excellent weight range
- **Body/Questions:** "Source Sans 3" (Google Fonts) — highly readable at all sizes, scientific feel
- **Monospace (scores/stats):** "JetBrains Mono" (Google Fonts) — for timers, score counters

### 3.4 Key Visual Elements
1. **Background:** Subtle animated gradient mesh or CSS radial gradients layered to create depth. Optional: very subtle floating particle effect (CSS-only, lightweight) suggesting bioluminescence
2. **Cards:** Frosted glass effect (`backdrop-filter: blur`) with subtle borders. Slight glow on hover.
3. **Answer buttons:** Large touch targets (min 48px height), clear hover/active states, distinct correct/wrong color transitions with Framer Motion
4. **Progress bar:** Gradient from teal to cyan, animated fill
5. **Score display:** Animated counter with the amber accent color
6. **Category cards:** Each category gets a subtle icon or emoji. Cards have a slight parallax tilt on hover (optional, CSS transform).
7. **Timer:** Circular progress indicator when timed mode is active, pulsing animation in last 5 seconds

### 3.5 Responsive Breakpoints
- Mobile first: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Max content width: 800px (quiz area), centered

### 3.6 Accessibility
- All interactive elements keyboard-navigable
- ARIA labels on quiz controls
- Sufficient contrast ratios (WCAG AA minimum)
- Focus indicators visible on all interactive elements
- Screen reader announcements for correct/wrong feedback

---

## 4. Application Structure & Components

### 4.1 Page/Route Structure
```
/#/                → WelcomePage (hero, start quiz, category browse)
/#/setup           → QuizSetupPage (category select, difficulty, timed toggle, question count)
/#/play            → QuizPlayPage (active quiz session)
/#/results         → ResultsPage (score breakdown, explanations review, share)
/#/about           → AboutPage (credits, author info, links to consulting site)
```

### 4.2 Component Hierarchy
```
App
├── Layout (persistent wrapper: header bar, footer)
│   ├── Header (logo/title, nav links, current score if in quiz)
│   └── Footer (credit line, link to kristofmoeller.com, version)
│
├── WelcomePage
│   ├── HeroBanner (title, tagline, animated background)
│   ├── QuickStartButton ("Start Random Quiz")
│   ├── CategoryGrid (preview cards for each category)
│   └── StatsOverview (if returning user: "You've answered X questions", high score)
│
├── QuizSetupPage
│   ├── CategorySelector (multi-select checkboxes with icons)
│   ├── DifficultySelector (3 toggle buttons: Beginner / Intermediate / Expert)
│   ├── TimerToggle (on/off switch + seconds-per-question slider: 15/30/45/60)
│   ├── QuestionCountSelector (10 / 20 / 30 / All)
│   └── StartButton
│
├── QuizPlayPage
│   ├── ProgressBar (current question # / total, visual progress)
│   ├── TimerDisplay (circular countdown, only if timed mode)
│   ├── CategoryBadge (shows current question's category)
│   ├── DifficultyBadge (shows current question's difficulty)
│   ├── QuestionCard
│   │   ├── QuestionText
│   │   └── AnswerGrid (2x2 grid on desktop, stack on mobile)
│   │       └── AnswerButton (×4)
│   ├── FeedbackOverlay (correct/wrong animation + explanation)
│   │   ├── CorrectIcon / WrongIcon
│   │   ├── ExplanationText
│   │   └── NextButton
│   └── QuizControls (quit/skip buttons)
│
├── ResultsPage
│   ├── ScoreHero (big animated score, grade, message)
│   ├── PerformanceBreakdown (by category: pie/bar chart)
│   ├── QuestionReviewList (expandable list of all questions with your answers + explanations)
│   ├── ShareButton (copy result text to clipboard, or social share)
│   ├── RetryButton / NewQuizButton
│   └── CallToAction (link to kristofmoeller.com consulting page)
│
└── AboutPage
    ├── AuthorBio (photo, credentials, IAEA/AWI affiliation)
    ├── ProjectDescription
    ├── ContactInfo / ConsultingLink
    └── VersionInfo
```

### 4.3 Shared/Utility Components
```
components/shared/
├── Button.jsx           (primary, secondary, ghost variants)
├── Badge.jsx            (category, difficulty labels)
├── Card.jsx             (frosted glass card wrapper)
├── ProgressRing.jsx     (circular SVG progress for timer)
├── AnimatedCounter.jsx  (number counting animation for scores)
├── Toggle.jsx           (switch component for settings)
├── Slider.jsx           (range slider for timer seconds)
├── Modal.jsx            (confirmation dialogs, quit warning)
├── BackgroundEffects.jsx (subtle animated gradient/particles)
└── Tooltip.jsx          (hover tooltips for explanations)
```

---

## 5. Data Model & Question Bank

### 5.1 Question Schema
Each question is a JSON object with this structure:

```json
{
  "id": "psp-001",
  "category": "shellfish_poisoning",
  "subcategory": "psp",
  "difficulty": "beginner",
  "question": "Which toxin is the primary cause of Paralytic Shellfish Poisoning (PSP)?",
  "answers": [
    { "id": "a", "text": "Okadaic acid" },
    { "id": "b", "text": "Saxitoxin" },
    { "id": "c", "text": "Domoic acid" },
    { "id": "d", "text": "Brevetoxin" }
  ],
  "correctAnswer": "b",
  "explanation": "Saxitoxin (STX) is the principal toxin responsible for PSP. It acts by blocking voltage-gated sodium channels in nerve cells, preventing signal transmission. PSP toxins are produced mainly by dinoflagellates of the genus Alexandrium.",
  "references": "FAO (2004) Marine Biotoxins; WHO Fact Sheet on Algal Toxins",
  "tags": ["saxitoxin", "sodium_channel", "alexandrium", "dinoflagellate"]
}
```

### 5.2 Category Definitions
```json
{
  "categories": [
    {
      "id": "shellfish_poisoning",
      "name": "Shellfish Poisoning Syndromes",
      "icon": "🐚",
      "description": "PSP, DSP, ASP, NSP, AZP & Ciguatera — symptoms, mechanisms, causative toxins",
      "color": "#ef4444"
    },
    {
      "id": "organisms",
      "name": "Causative Organisms",
      "icon": "🔬",
      "description": "Dinoflagellates, diatoms, cyanobacteria — taxonomy, ecology, bloom dynamics",
      "color": "#10b981"
    },
    {
      "id": "toxin_chemistry",
      "name": "Biotoxin Chemistry",
      "icon": "⚗️",
      "description": "Chemical structures, mechanisms of action, stability, metabolism of marine toxins",
      "color": "#8b5cf6"
    },
    {
      "id": "monitoring",
      "name": "Monitoring & Detection",
      "icon": "📡",
      "description": "Analytical methods, bioassays, ELISA, HPLC, receptor binding assays, remote sensing",
      "color": "#0891b2"
    },
    {
      "id": "environment",
      "name": "Environmental Drivers",
      "icon": "🌊",
      "description": "Eutrophication, climate change, ocean warming, upwelling, nutrient cycling",
      "color": "#f59e0b"
    },
    {
      "id": "health_safety",
      "name": "Human Health & Food Safety",
      "icon": "🏥",
      "description": "Regulatory limits, seafood safety, public health response, treatment protocols",
      "color": "#ec4899"
    }
  ]
}
```

### 5.3 Question Bank File Structure
```
src/data/
├── questions/
│   ├── shellfish_poisoning.json    (PSP, DSP, ASP, NSP, AZP, CFP questions)
│   ├── organisms.json              (dinoflagellates, diatoms, cyanobacteria)
│   ├── toxin_chemistry.json        (chemical structures, mechanisms)
│   ├── monitoring.json             (analytical methods, detection)
│   ├── environment.json            (HAB drivers, climate, nutrients)
│   └── health_safety.json          (regulations, food safety, treatment)
├── categories.json                 (category metadata as above)
└── index.js                        (aggregates and exports all questions)
```

### 5.4 Seed Questions
The initial build should include **10-15 questions per category** (60-90 total) as a starter set. These will be a mix of:
- **Beginner:** Factual recall, basic definitions, well-known associations
- **Intermediate:** Applied knowledge, connections between concepts, less common facts
- **Expert:** Nuanced distinctions, quantitative details, cutting-edge research, regulatory specifics

**IMPORTANT FOR CLAUDE CODE:** Generate scientifically accurate starter questions using the knowledge provided by the project owner and general marine biotoxin knowledge. The project owner (a marine biochemist at IAEA) will review ALL questions for accuracy before deployment. Flag any questions where confidence in accuracy is below 95% with a `"reviewFlag": true` field. Err on the side of caution — it is better to generate fewer high-confidence questions than many uncertain ones.

**After the initial build, the project owner will:**
1. Review and correct all generated questions
2. Add additional expert-curated questions
3. Adjust difficulty ratings based on his teaching experience

---

## 6. State Management

### 6.1 Quiz Session State
```javascript
const quizSessionState = {
  // Configuration (set during setup)
  config: {
    categories: ['shellfish_poisoning', 'organisms'],  // selected categories
    difficulty: 'intermediate',                          // 'beginner' | 'intermediate' | 'expert' | 'mixed'
    timedMode: true,
    timePerQuestion: 30,                                 // seconds
    questionCount: 20,
  },

  // Active quiz state
  session: {
    questions: [],            // shuffled array of question objects for this session
    currentIndex: 0,          // which question we're on (0-based)
    answers: [],              // array of { questionId, selectedAnswer, correct, timeSpent }
    startTime: null,          // ISO timestamp
    status: 'active',         // 'active' | 'completed' | 'abandoned'
  },

  // Derived (computed in components)
  // score, percentCorrect, categoryBreakdown, timeStats
};
```

### 6.2 Persistent State (localStorage)
```javascript
const persistentState = {
  // Lifetime stats
  stats: {
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    totalSessions: 0,
    bestScore: { percent: 0, date: null, config: {} },
    categoryStats: {
      'shellfish_poisoning': { answered: 0, correct: 0 },
      // ... per category
    },
    streakCurrent: 0,         // consecutive correct answers (current)
    streakBest: 0,            // all-time best streak
  },

  // User preferences
  preferences: {
    lastDifficulty: 'intermediate',
    lastCategories: [],
    timedMode: false,
    timePerQuestion: 30,
  },
};
```

### 6.3 Custom Hooks
```
hooks/
├── useQuiz.js           (main quiz logic: start, answer, next, finish)
├── useTimer.js          (countdown timer with pause/resume)
├── useLocalStorage.js   (persistent state read/write with JSON parse/stringify)
├── useStats.js          (lifetime statistics tracking)
└── useQuestionBank.js   (filtering, shuffling, selecting questions from bank)
```

---

## 7. Core Logic

### 7.1 Question Selection Algorithm
```
function selectQuestions(config, allQuestions):
  1. Filter by selected categories
  2. Filter by difficulty (if not 'mixed')
  3. Shuffle the filtered set (Fisher-Yates)
  4. Take first N questions (config.questionCount)
  5. If fewer questions available than requested, take all and warn user
  6. Return the selected questions array
```

### 7.2 Answer Flow
```
User selects answer →
  1. Stop timer (if timed mode)
  2. Record answer: { questionId, selectedAnswer, correct: bool, timeSpent }
  3. Show feedback overlay:
     - Green flash + checkmark + "Correct!" if right
     - Red flash + X + "Incorrect" + show correct answer if wrong
     - Always show explanation text
  4. User clicks "Next" (or auto-advance after 3s in timed mode)
  5. If last question → navigate to results
  6. Else → load next question, restart timer
```

### 7.3 Timer Logic
```
- Timer starts at config.timePerQuestion seconds
- Counts down every 100ms (smooth visual)
- At 5 seconds: timer turns amber, pulse animation starts
- At 0 seconds: auto-submit as "no answer" (counts as wrong), show correct answer
- Timer pauses when feedback overlay is shown
```

### 7.4 Scoring
```
- Base score: 1 point per correct answer
- Percentage: (correct / total) × 100
- Grade thresholds:
    90-100%: "Expert" 🏆
    75-89%:  "Advanced" 🎓
    60-74%:  "Intermediate" 📚
    40-59%:  "Beginner" 🌱
    0-39%:   "Keep Learning" 💡
- Streak tracking: consecutive correct answers, tracked across sessions
- Category breakdown: score per category shown in results
```

---

## 8. Build & Deployment Configuration

### 8.1 Vite Configuration (`quiz-src/vite.config.js`)
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/quiz/',  // CRITICAL: all assets load relative to /quiz/
  build: {
    outDir: path.resolve(__dirname, '../quiz'),  // Build output goes to repo root /quiz/
    emptyOutDir: true,  // Clean /quiz/ before each build
  },
});
```

### 8.2 Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build"
  }
}
```

### 8.3 Tailwind Configuration (`quiz-src/tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#0a1628',
          900: '#0f2035',
          800: '#132a42',
          700: '#1a3654',
          600: '#234a6b',
          500: '#2d6082',
        },
        accent: {
          teal: '#00d4aa',
          cyan: '#0891b2',
          amber: '#f59e0b',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'timer-pulse': 'timer-pulse 1s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 170, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 212, 170, 0.3)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'timer-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
};
```

### 8.4 .gitignore Additions
Add these lines to the EXISTING `.gitignore` in the repo root:
```
# Quiz app development files
quiz-src/node_modules/
quiz-src/.env
quiz-src/dist/

# Keep quiz/ (build output) tracked — do NOT ignore it
```

### 8.5 GitHub Pages SPA Workaround
Create `quiz/404.html` as a copy of `quiz/index.html` after each build. This ensures that if someone navigates directly to a sub-route, GitHub Pages serves the React app instead of a 404. Combined with HashRouter, this provides bulletproof routing.

Add a post-build step:
```bash
# After vite build completes:
cp quiz/index.html quiz/404.html
```

---

## 9. Development Workflow for Claude Code

### 9.1 Initial Setup Sequence
```bash
# Step 1: Clone the repo (or navigate to it if already cloned)
cd /path/to/KristofM854.github.io

# Step 2: Create the quiz-src directory and initialize React project
mkdir quiz-src
cd quiz-src
npm create vite@latest . -- --template react
# When prompted, select React and JavaScript

# Step 3: Install dependencies
npm install react-router-dom framer-motion lucide-react
npm install -D tailwindcss @tailwindcss/vite

# Step 4: Configure Vite (see 8.1)
# Step 5: Configure Tailwind (see 8.3)
# Step 6: Set up file structure (see 4.2)
# Step 7: Build and verify output goes to ../quiz/
npm run build
# Verify: ls ../quiz/ should show index.html and assets/
```

### 9.2 Implementation Order
Build in this exact order to enable incremental testing:

**Phase 1: Foundation (scaffold + routing + theme)**
1. Set up Vite + React + Tailwind with correct config
2. Create Layout component with Header/Footer
3. Set up HashRouter with all routes
4. Implement BackgroundEffects component (animated gradient)
5. Create shared components: Button, Card, Badge
6. Create placeholder pages for all routes
7. **TEST:** `npm run build` → verify `/quiz/index.html` works when opened

**Phase 2: Data Layer**
8. Create question bank JSON files with seed questions (10-15 per category)
9. Create categories.json
10. Create `data/index.js` aggregation module
11. Create `useQuestionBank` hook (filter, shuffle, select)
12. Create `useLocalStorage` hook
13. **TEST:** Console.log that questions load and filter correctly

**Phase 3: Quiz Setup Page**
14. Build CategorySelector component (multi-select grid)
15. Build DifficultySelector (toggle buttons)
16. Build TimerToggle + time slider
17. Build QuestionCountSelector
18. Wire up setup page → stores config → navigates to /play
19. **TEST:** Setup page works, config persists

**Phase 4: Quiz Play Page (core gameplay)**
20. Build QuestionCard + AnswerGrid
21. Implement answer selection logic
22. Build FeedbackOverlay (correct/wrong + explanation)
23. Build ProgressBar
24. Build `useQuiz` hook (orchestrates the full quiz flow)
25. Build `useTimer` hook
26. Build TimerDisplay (circular progress ring)
27. Wire up: answer → feedback → next → ... → results
28. **TEST:** Full quiz playthrough works

**Phase 5: Results Page**
29. Build ScoreHero (animated score reveal)
30. Build PerformanceBreakdown (category-level stats)
31. Build QuestionReviewList (expandable, shows explanations)
32. Build share-to-clipboard function
33. Build "Try Again" and "New Quiz" flows
34. Add CTA link to kristofmoeller.com
35. **TEST:** Complete flow from setup → play → results

**Phase 6: Welcome Page & Polish**
36. Build WelcomePage with hero section
37. Build CategoryGrid preview cards
38. Implement `useStats` hook (lifetime stats from localStorage)
39. Show returning user stats on welcome page
40. Add Framer Motion animations throughout:
    - Page transitions (fade + slide)
    - Answer button hover/tap states
    - Correct/wrong feedback animations
    - Score counter animation on results page
    - Category card hover effects
41. **TEST:** Full user journey, mobile responsiveness

**Phase 7: Final Polish & Deploy**
42. Responsive testing at all breakpoints
43. Keyboard navigation / accessibility audit
44. Performance check (Lighthouse)
45. Add meta tags (Open Graph, description) for link sharing
46. Final build: `npm run build && cp quiz/index.html quiz/404.html`
47. Commit everything (both quiz-src/ and quiz/) and push
48. **TEST:** Verify live at kristofmoeller.com/quiz

---

## 10. Seed Question Examples

These examples illustrate the target style, difficulty spread, and explanation depth. Use these as templates when generating the full question bank.

### Beginner Examples

```json
{
  "id": "sp-b-001",
  "category": "shellfish_poisoning",
  "subcategory": "psp",
  "difficulty": "beginner",
  "question": "What does PSP stand for in the context of marine biotoxins?",
  "answers": [
    { "id": "a", "text": "Primary Shellfish Pathogen" },
    { "id": "b", "text": "Paralytic Shellfish Poisoning" },
    { "id": "c", "text": "Periodic Shellfish Problem" },
    { "id": "d", "text": "Planktonic Shellfish Pollution" }
  ],
  "correctAnswer": "b",
  "explanation": "PSP stands for Paralytic Shellfish Poisoning. It is caused by saxitoxin and related toxins that block sodium channels in nerve cells, leading to paralysis. PSP is the most dangerous of the shellfish poisoning syndromes and can be fatal.",
  "tags": ["psp", "saxitoxin", "definition"]
}
```

```json
{
  "id": "org-b-001",
  "category": "organisms",
  "subcategory": "dinoflagellates",
  "difficulty": "beginner",
  "question": "Which genus of dinoflagellates is the primary producer of PSP toxins worldwide?",
  "answers": [
    { "id": "a", "text": "Pseudo-nitzschia" },
    { "id": "b", "text": "Dinophysis" },
    { "id": "c", "text": "Alexandrium" },
    { "id": "d", "text": "Karenia" }
  ],
  "correctAnswer": "c",
  "explanation": "Alexandrium is the most widespread genus responsible for PSP toxin production. There are over 30 recognized species of Alexandrium, and approximately half are known to produce saxitoxins. Other PSP-producing genera include Gymnodinium and Pyrodinium.",
  "tags": ["alexandrium", "dinoflagellate", "psp", "taxonomy"]
}
```

### Intermediate Examples

```json
{
  "id": "tc-i-001",
  "category": "toxin_chemistry",
  "subcategory": "mechanism",
  "difficulty": "intermediate",
  "question": "What is the primary molecular mechanism of action of saxitoxin?",
  "answers": [
    { "id": "a", "text": "Inhibition of protein phosphatases PP1 and PP2A" },
    { "id": "b", "text": "Blocking voltage-gated sodium channels" },
    { "id": "c", "text": "Activation of glutamate receptors" },
    { "id": "d", "text": "Inhibition of acetylcholinesterase" }
  ],
  "correctAnswer": "b",
  "explanation": "Saxitoxin blocks voltage-gated sodium channels by binding to site 1 of the channel, preventing sodium ion influx. This blocks nerve impulse transmission and can lead to paralysis and respiratory failure. Option A describes okadaic acid (DSP), option C describes domoic acid (ASP), and option D describes organophosphate poisoning.",
  "tags": ["saxitoxin", "sodium_channel", "mechanism", "pharmacology"]
}
```

```json
{
  "id": "mon-i-001",
  "category": "monitoring",
  "subcategory": "methods",
  "difficulty": "intermediate",
  "question": "What is the internationally recognized regulatory limit for PSP toxins in shellfish tissue?",
  "answers": [
    { "id": "a", "text": "20 µg STX eq./kg" },
    { "id": "b", "text": "80 µg STX eq./100g" },
    { "id": "c", "text": "800 µg STX eq./kg" },
    { "id": "d", "text": "160 µg STX eq./100g" }
  ],
  "correctAnswer": "c",
  "explanation": "The Codex Alimentarius regulatory limit for PSP toxins is 800 µg saxitoxin equivalents per kg of shellfish tissue (equivalent to 80 µg STX eq. per 100g). This limit has been adopted by most countries and is used as the action level for shellfish harvesting area closures.",
  "tags": ["regulatory", "codex", "saxitoxin", "limit", "monitoring"]
}
```

### Expert Examples

```json
{
  "id": "sp-e-001",
  "category": "shellfish_poisoning",
  "subcategory": "asp",
  "difficulty": "expert",
  "question": "The 1987 ASP outbreak on Prince Edward Island, Canada, which led to the identification of domoic acid as a shellfish toxin, was traced to which specific shellfish species?",
  "answers": [
    { "id": "a", "text": "Blue mussels (Mytilus edulis)" },
    { "id": "b", "text": "Eastern oysters (Crassostrea virginica)" },
    { "id": "c", "text": "Soft-shell clams (Mya arenaria)" },
    { "id": "d", "text": "Sea scallops (Placopecten magellanicus)" }
  ],
  "correctAnswer": "a",
  "explanation": "The 1987 Prince Edward Island outbreak was caused by blue mussels (Mytilus edulis) contaminated with domoic acid produced by the diatom Pseudo-nitzschia multiseries (then classified as Nitzschia pungens f. multiseries). This was the first recognized ASP event, resulting in 3 deaths and over 100 illnesses, and led to the establishment of domoic acid monitoring programs worldwide.",
  "tags": ["asp", "domoic_acid", "PEI", "1987", "mytilus", "pseudo-nitzschia", "historical"]
}
```

```json
{
  "id": "mon-e-001",
  "category": "monitoring",
  "subcategory": "methods",
  "difficulty": "expert",
  "question": "Which analytical method replaced the mouse bioassay as the EU reference method for lipophilic marine biotoxins (DSP toxins, AZA, YTX) in 2011?",
  "answers": [
    { "id": "a", "text": "ELISA (enzyme-linked immunosorbent assay)" },
    { "id": "b", "text": "LC-MS/MS (liquid chromatography-tandem mass spectrometry)" },
    { "id": "c", "text": "HPLC-FLD (high-performance liquid chromatography with fluorescence detection)" },
    { "id": "d", "text": "Receptor binding assay (RBA)" }
  ],
  "correctAnswer": "b",
  "explanation": "EU Regulation 15/2011 established LC-MS/MS as the reference method for lipophilic biotoxins, replacing the controversial mouse bioassay. LC-MS/MS offers superior specificity, sensitivity, and quantification of individual toxin analogues, while eliminating the ethical concerns of animal testing. The transition was a landmark event in marine biotoxin monitoring.",
  "tags": ["lc-ms", "eu_regulation", "mouse_bioassay", "lipophilic", "analytical_methods"]
}
```

---

## 11. Project Owner Preparation Checklist

Before and during implementation, the project owner should prepare:

### Before Build Starts
- [ ] Confirm Node.js (v18+) and npm are installed and available where Claude Code runs
- [ ] Confirm the repo `KristofM854/KristofM854.github.io` is cloned locally and Claude Code has access
- [ ] Confirm Git is configured with push access to the repo

### During Build (Parallel Tasks)
- [ ] Draft additional seed questions (aim for 10-15 per category; see format in Section 5.1 and examples in Section 10)
- [ ] Decide on a tagline/subtitle for the quiz (e.g., "Test Your Knowledge of Marine Biotoxins & Harmful Algal Blooms")
- [ ] Decide on an author bio blurb for the About page (2-3 sentences)
- [ ] Optional: Prepare a headshot/profile photo for the About page
- [ ] Optional: Decide if you want a "Buy Me a Coffee" or similar donation link in the footer

### After Build (Review Tasks)
- [ ] Review ALL generated quiz questions for scientific accuracy — correct any errors
- [ ] Adjust difficulty ratings based on your assessment
- [ ] Add additional expert-curated questions to the JSON files
- [ ] Test on mobile (your phone) and desktop
- [ ] Share test link with a colleague for feedback
- [ ] Push to GitHub and verify live deployment at kristofmoeller.com/quiz

---

## 12. Future Enhancements (Post-MVP Backlog)

These are NOT part of the initial build but document the roadmap:

1. **Leaderboard:** Anonymous global leaderboard (would require a simple backend — Firebase or Supabase free tier)
2. **Spaced repetition:** Track which questions users get wrong and resurface them more frequently
3. **Image questions:** Some questions include microscopy images of HAB species for identification
4. **Multi-language:** French and German translations (given user's language skills and IAEA context)
5. **API integration:** Fetch questions from a backend to enable updates without redeploying
6. **PWA support:** Add service worker + manifest for "Add to Home Screen" on mobile
7. **Certificate generation:** "You scored X% — download your certificate" (PDF generation)
8. **Classroom mode:** Teacher shares a code, students join and compete live (like Kahoot)
9. **React Native app:** Convert to mobile app for Google Play / App Store
10. **AI-generated questions:** Use Claude API to generate new questions from uploaded research papers

---

## 13. Key Reminders for Claude Code

1. **Do NOT modify any files outside of `quiz-src/` and `quiz/` directories.** The existing website files are off-limits.
2. **Always use HashRouter**, not BrowserRouter. GitHub Pages does not support server-side routing.
3. **Always set `base: '/quiz/'` in Vite config.** Without this, assets will 404.
4. **Scientific accuracy is paramount.** When generating quiz questions, only include facts you are highly confident about. Flag uncertain questions with `"reviewFlag": true`.
5. **Mobile-first design.** Test all components at 375px width first, then scale up.
6. **Commit both `quiz-src/` and `quiz/`** to the repo. The built `quiz/` folder must be tracked by Git for GitHub Pages to serve it.
7. **After every `npm run build`**, run `cp quiz/index.html quiz/404.html`.
8. **Performance matters.** No heavy libraries. Keep the bundle small. Quiz data is static JSON, not fetched from an API.
9. **The explanation is as important as the question.** Every question MUST have a meaningful, educational explanation. This is what differentiates the app from random trivia.
10. **Respect the design spec.** The ocean theme should feel immersive and professional, not gimmicky. Think "National Geographic meets interactive textbook."

---

## 14. Question Bank Data Files

The following JSON files contain the complete question bank (81 questions across 6 categories and 3 difficulty levels). These files are provided alongside this guide and should be placed at:

```
quiz-src/src/data/questions/shellfish_poisoning.json   (15 questions)
quiz-src/src/data/questions/organisms.json             (14 questions)
quiz-src/src/data/questions/toxin_chemistry.json       (13 questions)
quiz-src/src/data/questions/monitoring.json             (13 questions)
quiz-src/src/data/questions/environment.json            (12 questions)
quiz-src/src/data/questions/health_safety.json          (14 questions)
quiz-src/src/data/categories.json                       (6 categories)
```

**IMPORTANT:** These JSON files are provided as separate attachments. Copy them verbatim into the file paths above. Do NOT regenerate or modify the question content — it has been reviewed by the project owner (a marine biochemist). Two questions in `organisms.json` have `"reviewFlag": true` — these are flagged for the owner's review but should still be included in the build.

### 14.1 Question Bank Aggregation Module

Create this file at `quiz-src/src/data/index.js`:

```javascript
import shellfishPoisoning from './questions/shellfish_poisoning.json';
import organisms from './questions/organisms.json';
import toxinChemistry from './questions/toxin_chemistry.json';
import monitoring from './questions/monitoring.json';
import environment from './questions/environment.json';
import healthSafety from './questions/health_safety.json';
import categories from './categories.json';

const allQuestions = [
  ...shellfishPoisoning,
  ...organisms,
  ...toxinChemistry,
  ...monitoring,
  ...environment,
  ...healthSafety,
];

export { allQuestions, categories };

export const getQuestionsByCategory = (categoryId) =>
  allQuestions.filter((q) => q.category === categoryId);

export const getQuestionsByDifficulty = (difficulty) =>
  allQuestions.filter((q) => q.difficulty === difficulty);

export const getFilteredQuestions = ({ categories: cats, difficulty }) => {
  let filtered = allQuestions;
  if (cats && cats.length > 0) {
    filtered = filtered.filter((q) => cats.includes(q.category));
  }
  if (difficulty && difficulty !== 'mixed') {
    filtered = filtered.filter((q) => q.difficulty === difficulty);
  }
  return filtered;
};

// Fisher-Yates shuffle
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const selectQuestions = ({ categories: cats, difficulty, count }) => {
  const filtered = getFilteredQuestions({ categories: cats, difficulty });
  const shuffled = shuffleArray(filtered);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  // Shuffle answers within each question too
  return selected.map((q) => ({
    ...q,
    answers: shuffleArray(q.answers),
  }));
};
```

---

## 15. Complete Setup Commands (Copy-Paste Ready)

Once inside the cloned repo directory, execute these commands in sequence:

### 15.1 Project Initialization
```bash
# Create project directory
mkdir -p quiz-src
cd quiz-src

# Initialize Vite React project
npm create vite@latest . -- --template react

# Install core dependencies
npm install react-router-dom framer-motion lucide-react

# Install Tailwind CSS
npm install -D tailwindcss @tailwindcss/vite
```

### 15.2 Create Directory Structure
```bash
mkdir -p src/components/shared
mkdir -p src/components/pages
mkdir -p src/data/questions
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/styles
```

### 15.3 After Development — Build & Deploy
```bash
# Build (output goes to ../quiz/)
npm run build

# Create SPA fallback
cp ../quiz/index.html ../quiz/404.html

# Commit and push
cd ..
git add -A
git commit -m "Add HAB Quiz app"
git push origin main
```

### 15.4 Verification
After push, navigate to `https://kristofmoeller.com/quiz` and verify:
- [ ] Page loads without 404
- [ ] All assets (CSS, JS) load correctly (check browser console for errors)
- [ ] Quiz can be started and played through
- [ ] Results page displays correctly
- [ ] Navigation between all routes works
- [ ] Mobile responsiveness is acceptable
- [ ] Returning to the page shows localStorage stats

---

## 16. How to Feed This to Claude Code

Provide Claude Code with:

1. **This implementation guide** (the primary instruction document)
2. **The 7 JSON files** (6 question banks + 1 categories file) as separate files
3. **Access to the repo** `KristofM854/KristofM854.github.io`

Start with this prompt to Claude Code:

```
Read the attached implementation guide (HAB_QUIZ_IMPLEMENTATION_GUIDE.md) completely. 
Then follow the implementation order in Section 9.2 — build the HAB Quiz React app 
phase by phase. The question bank JSON files are attached separately — copy them 
verbatim into the correct paths as specified in Section 14.

Start with Phase 1 (Foundation). After each phase, confirm what was built and 
ask before proceeding to the next phase.

The repo is at: [path to your local KristofM854.github.io clone]
```

If Claude Code hits context limits, you can feed phases individually:
- "Continue with Phase 2 (Data Layer) from the implementation guide"
- "Continue with Phase 3 (Quiz Setup Page) from the implementation guide"
- etc.

