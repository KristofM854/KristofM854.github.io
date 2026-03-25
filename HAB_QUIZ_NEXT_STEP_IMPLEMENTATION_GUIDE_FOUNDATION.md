# Claude Code Implementation Guide Foundation — HAB Quiz Next-Step Refinement

This guide is a foundation document for the next implementation cycle of the HAB & Marine Biotoxins Quiz app.

It is intentionally focused on:
- clarifying unresolved product decisions before coding
- preventing premature implementation
- closing feature gaps already partially scaffolded in the codebase
- refining quiz continuity, review workflows, and scientific transparency
- preserving intended mode-specific behavior already working in the app (for example: `I don't know` being available in Study mode only)

---

## 0. Non-skippable planning phase

Before making any implementation changes, Claude Code must enter a planning and clarification phase.

This phase is **mandatory** and must not be skipped. Claude Code must not begin implementation until this planning and clarification step has been completed and answered.

### 0.1 Required behavior before implementation
Claude Code must:

1. read the relevant current code paths first
2. compare the current implementation against this guide
3. identify where the app already has groundwork in place
4. ask re-clarification questions before implementation begins
5. wait for answers to those questions
6. only then start implementation

Claude Code must **not** assume that all items in this guide are missing. It must verify first.

### 0.2 Re-clarification questions are mandatory
Before implementing, Claude Code must ask targeted clarification questions covering at least:

- desired behavior when an active quiz exists and the user navigates to other tabs/routes
- expected behavior for the future review section
- whether “review” means:
  - quiz-review queue for missed/flagged questions
  - literature/reference review for scientific sources
  - or both
- preferred UI pattern for references:
  - inline expandable citations
  - modal
  - dedicated drawer/side panel
  - separate page
- whether starting a new quiz should always require explicit confirmation if an active session exists
- whether flagged questions and review-later questions should be merged or kept separate
- whether review queue items should be removed automatically after successful review completion or only manually
- how much metadata should be exposed to users (references only, or also sourceShort / learningObjective / jurisdiction)

Claude Code should keep the questions concise and grouped, but it must ask them before coding.

### 0.3 Implementation is blocked until clarification is received
If clarification is missing, Claude Code should stop after the planning summary and questions.

It must not continue into code changes until the unanswered product decisions are resolved.

---

## 1. Current observed groundwork already present

Claude Code must verify and preserve the following existing foundations rather than rebuilding them from scratch.

### 1.1 Session continuity groundwork
The current app already has:

- centralized session state in `QuizSessionContext`
- persisted active session in localStorage
- persisted review queue
- persisted last results
- persisted stats and preferences
- Home-page unfinished-session card with:
  - Resume
  - Discard

This groundwork should be extended, not replaced.

### 1.2 Current review groundwork
The current app already has:

- `reviewQueue` in session context
- `markForReview(questionId)`
- `removeFromReviewQueue(questionId)`
- `clearReviewQueue()`
- review-mode button on Home page
- reporting/error-submission should remain separate from review-queue logic

This means the review system is partially scaffolded, but the user-facing review workflow is incomplete.

### 1.3 Current references groundwork
The app already supports rendering question references if present in question data.

Claude Code must preserve this path and extend it into a more inspectable user-facing citation UX rather than replacing it with a disconnected solution.

---

## 2. Immediate priorities for the next implementation cycle

Priority order:

1. resolve active-session navigation UX across app tabs/routes
2. implement a real review workflow for the user
3. implement clear, user-accessible scientific references
4. only after that continue broader content refinement and extension

---

## 3. Active-session navigation behavior

### 3.1 Current observed behavior
Current observed behavior:

- if an active quiz exists and the user goes to Home, the app shows:
  - “Resume Previous Quiz”
  - Resume / Discard
- this works
- but clicking “Quiz” or “About” during an active session currently does nothing meaningful for the user

### 3.2 Goal
The app should handle route switching during an active session in a clear, consistent, and low-friction way.

### 3.3 Confirmed product decision
Confirmed direction:

- do **not** show a pop-up on every tab switch
- preserve the active session globally across routes
- keep the existing Home resume/discard behavior
- add the same active-session notice on Setup and About
- only interrupt the user with a modal when they are about to do something conflicting or destructive, especially:
  - starting a new quiz while one is already active
  - launching a new mode/session that would replace the current one
  - resetting/discarding an active session

### 3.4 Best implementation recommendation
Use a shared, route-level “active session notice” pattern instead of aggressive navigation interception.

Preferred behavior:

1. allow route navigation freely
2. preserve the active session globally
3. show a persistent session banner/card on relevant pages (`/`, `/setup`, `/about`)
4. intercept only conflicting actions with a confirmation modal:
   - Resume current quiz
   - Discard and start new
   - Cancel

This keeps the app calm and predictable while still protecting active work.

### 3.5 Implementation requirements
Claude Code should implement:

- a shared `ActiveSessionNotice` component
- show it on Home, Setup, and About pages when an active session exists
- keep the current Home resume card behavior or refactor it into the shared component
- add an action guard for starting a new session if one is already active
- ensure clicking “Quiz” or “About” while a session exists still gives the user clear recovery/resume visibility
- do not auto-discard the session on route change

---

## 4. Review-later / review section design

### 4.1 Current observed behavior
The current “Review later” / mark-for-review action does not yet produce a meaningful user-facing review workflow.

### 4.2 Goal
Create a robust, simple, elegant review system for missed, unknown, and manually marked questions.

### 4.3 Confirmed conceptual model
Use **one unified review queue** with typed reasons.

Each queue entry should be represented as something like:

```js
{
  questionId: '...',
  reasons: ['incorrect', 'unknown', 'flagged', 'marked_for_review'],
  addedAt: 'ISO timestamp',
  sourceSessionId: '...'
}
```

This is the confirmed preferred direction because it is:
- simpler
- more debuggable
- easier to surface in UI
- easier to deduplicate
- easier to extend later without multiple competing review systems

### 4.4 Recommended user-facing review experience
Create a dedicated review section for the user with three access points:

1. Home page review button (already partly present)
2. Results page CTA
3. Optional dedicated `/#/review` route or review dashboard card

### 4.5 Recommended minimum viable review UX
The simplest robust version:

- review queue stored persistently
- Home page shows count badge
- user can start “Review Mode”
- review mode draws only from review queue questions
- review queue page or card lets the user:
  - see how many questions are queued
  - see why they were queued
  - remove individual items
  - clear all
  - start review quiz button

### 4.6 Should there be a separate review page?
Yes — recommended.

Best simple route:
- `/#/review`

This page should show:
- queued question count
- grouped reasons
- simple item list
- remove item button
- clear all button
- start review quiz button

This is more robust and transparent than hiding everything behind only a button on Home.

### 4.7 Recommended queue behavior
Suggested behavior:

- `incorrect` and `unknown` auto-add in study/review modes
- `marked_for_review` always adds manually
- `reported` should **not** enter the learner review queue automatically; reporting is for content QA
- add a separate learner action such as `Review later` to place a question into the review queue manually
- queue entries should deduplicate by question ID while preserving multiple reasons where relevant
- removal should be manual by default
- optional future enhancement: remove automatically after correct answer in review mode, but only after explicit confirmation/product decision

### 4.8 Implementation requirements
Claude Code should implement:

- normalized review queue data model
- review queue selectors/utilities
- `ReviewPage` route
- review queue summary card on Home and/or Results
- start-review action from queue
- remove/clear actions
- reason badges per queued question

---

## 5. References and literature access for the user

### 5.1 Clarified product intent
In this guide, “references” means scientific or regulatory sources supporting a question.

This is distinct from the learner review queue.

The app must provide a clear user-facing way to inspect references.

### 5.2 Product goal
Users should be able to:

- see that a question is source-backed
- inspect the references without cluttering the main quiz flow
- access those references again later outside the immediate answer-feedback moment

### 5.3 Recommended UX model
Use a **hybrid references system** with both:

1. **inline expandable references**
   - shown in answer feedback
   - shown in results review
   - compact and low-friction

2. **a dedicated references route/page**
   - route suggestion: `/#/references`
   - serves as a persistent access point
   - can display all references used in the question bank, or at minimum the references relevant to the current/recent session

This is the most robust and elegant solution because:

- inline disclosure is best during answering/review flow
- a dedicated page is best for later consultation, browsing, and scientific credibility
- it avoids overloading the quiz card while still making the literature genuinely accessible

### 5.4 Best implementation recommendation
Implement a reusable `QuestionReferences` component plus a dedicated references page.

#### Inline component behavior
For each question with references:

- show a small `References` disclosure or button below the explanation
- on expand, show structured citations
- each citation should support:
  - label
  - external link
  - source type
  - optional jurisdiction

#### Dedicated references page behavior
Recommended route:
- `/#/references`

Recommended content:
- introduction explaining that the quiz is source-backed
- searchable/filterable list of references
- optional grouping by:
  - category
  - source type
  - jurisdiction
- optional section for:
  - references from the current/last session
  - references for a selected question
  - all references used in the bank

### 5.5 Recommended data model
Support structured references such as:

```json
"references": [
  {
    "label": "EFSA 2009 opinion on the saxitoxin group",
    "url": "https://...",
    "type": "risk_assessment",
    "jurisdiction": "EU"
  }
],
"sourceShort": "EFSA 2009",
"learningObjective": "Distinguish screening methods from confirmatory methods for PSP monitoring.",
"lastReviewed": "2026-03-25",
"jurisdiction": "EU"
```

### 5.6 Recommended rollout order
Implement in this order:

1. support structured references in data
2. build reusable `QuestionReferences` component
3. render it in answer feedback
4. render it in results review
5. add a `References` link in global navigation or About page
6. build `/#/references` page

### 5.7 Navigation recommendation
Best low-friction entry points:

- a `References` link in the top navigation **or**
- a prominent `Scientific References` link on the About page
- optional contextual “Open references page” link from feedback/results

If you want the cleanest UI with minimal nav clutter:
- keep the main top nav unchanged
- add a strong `Scientific References` section/link on About
- later add top-nav entry only if users actually need more direct access

### 5.8 Implementation requirements
Claude Code should implement:

- a reusable `QuestionReferences` component
- structured array-based reference support
- backward compatibility for older plain-text reference values if still present
- expandable/collapsible citation block
- a `ReferencesPage` route
- a stable user-facing link to that page
- safe external-link handling (`target="_blank"`, `rel="noopener noreferrer"`)

### 5.9 Suggested first version of the dedicated page
The first version should stay simple:

- page title: `Scientific References`
- short explanation of why references are included
- list of references grouped by category
- deduplicate references globally (same source shown once, with category tags if needed)
- each entry includes:
  - label
  - optional short note
  - external link if available
  - non-clickable label-only support if no URL exists
  - jurisdiction badge if relevant
- include simple filters based on question categories in v1

Do not overbuild with citation export or advanced filtering beyond category filters in the first iteration.

---

## 6. Responsive layout / fitting the visible area

### 6.1 Goal
Improve layout behavior for:
- different screen sizes
- smaller browser windows
- embedded app/webview contexts
- mobile app-style visible viewport changes

### 6.2 Best implementation recommendation
Do **not** proportionally scale the entire app by measuring window dimensions.

Instead use:
- CSS `dvh` / `svh`
- max-height constrained sections
- compact spacing modes
- internal scroll only where needed
- sticky positioning for key controls when appropriate

### 6.3 Practical implementation direction
Claude Code should:

- make the main shell height-aware using `min-h-[100dvh]`
- define compact-height layout variants for short viewports
- keep progress/timer/actions visible where possible
- allow question content/explanation area to scroll independently if needed
- avoid shrinking text globally just to fit the window

---

## 7. Non-skippable implementation order after clarification

After clarification is received, Claude Code should implement in this order:

1. active-session cross-route UX
2. unified review queue model + review page
3. user-facing structured references
4. responsive height-aware layout improvements
5. only then continue broader content refinement and extension

---

## 8. Confirmed product decisions

The following decisions are considered confirmed unless the user changes them later.

### 8.1 References page
- show **only quiz-linked sources**
- deduplicate references globally
- allow references without URLs
- include category-based filters in v1
- show jurisdiction badges in:
  - inline references
  - results review
  - references page

### 8.2 Reporting vs learner review
The current “Flag question” concept should be renamed to a more standard wording.

Confirmed action split:
- `Report issue`
- `Review later`
- `Suggest improvement`

Preferred default wording:
- `Report issue`

Behavior:
- `Report issue`
  - for factual errors, broken references, wrong answer keys, unclear wording, UI/content problems
  - should **not** automatically place the question into the learner review queue
- `Review later`
  - for learner-side revisit / practice intent
  - should place the question into the learner review queue
- `Suggest improvement`
  - for stronger wording, better distractors, better explanations, improved references, or scientifically stronger framing
  - may optionally include user credentials or affiliation

### 8.3 Learner contribution / reviewer suggestion workflow
Add a second, separate pathway alongside reporting:

- `Suggest improvement` or `Suggest edit`

This is distinct from `Report issue`.

Recommended behavior:
- `Report issue`
  - for factual errors, broken references, wrong answer keys, unclear wording, UI/content problems
- `Suggest improvement`
  - for better wording, stronger distractors, richer explanations, updated references
  - optionally allow the user to provide credentials or reviewer affiliation

Recommended first version:
- lightweight form
- optional name
- optional credentials / affiliation
- free-text suggestion
- include question ID automatically

This is a strong idea and fits the scientific character of the app very well. It should be treated as an optional enhancement after the core references/review flow is stable.

### 8.4 Review queue behavior
- manual removal only in v1
- no auto-removal after correct re-answer

### 8.5 In-development banner
Add a temporary visible banner indicating the app is still under development.

Recommended wording options:
1. `In development — feel free to explore and test it.`
2. `Preview version — feel free to try it out.`
3. `Work in progress — feedback welcome.`

Best recommendation:
- `Preview version — feel free to try it out.`

Avoid:
- `Use at your own risk`
- `Try at your own risk`

Those sound too unstable or unsafe for an educational/scientific tool.

---

## 9. Deliverables expected from Claude Code

After implementation, Claude Code should report:

- what existing groundwork it reused
- what clarification choices were made
- which routes/components were added or changed
- how active-session navigation now works
- how the review queue now works
- how references are exposed to users
- any unresolved product decisions still requiring input
