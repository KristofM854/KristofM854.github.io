import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, query, orderByChild, limitToLast, get, set } from 'firebase/database'

// ============================================================
// FIREBASE CONFIG — loaded from quiz-src/.env (never committed)
// Copy quiz-src/.env.example → quiz-src/.env and fill in values.
// ============================================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Only initialize if the API key env var has been provided
const isConfigured = !!firebaseConfig.apiKey

let app = null
let db = null

if (isConfigured) {
  app = initializeApp(firebaseConfig)
  db = getDatabase(app)
}

// ---- Leaderboard ----

export async function submitScore({ name, score, total, percent, difficulty, categories, date }) {
  if (!db) return null
  const scoresRef = ref(db, 'leaderboard')
  const newEntry = {
    name: name.slice(0, 30), // limit name length
    score,
    total,
    percent,
    difficulty,
    categories,
    date: date || new Date().toISOString(),
  }
  await push(scoresRef, newEntry)
  return newEntry
}

export async function getTopScores(limit = 10) {
  if (!db) return []
  const scoresRef = ref(db, 'leaderboard')
  const q = query(scoresRef, orderByChild('percent'), limitToLast(limit))
  const snapshot = await get(q)
  if (!snapshot.exists()) return []

  const scores = []
  snapshot.forEach((child) => {
    scores.push({ id: child.key, ...child.val() })
  })
  // Sort descending by percent, then by date (earlier = better for ties)
  return scores.sort((a, b) => b.percent - a.percent || new Date(a.date) - new Date(b.date))
}

// ---- Question Flags ----

export async function submitFlag({ questionId, questionText, concern, flaggedAt, submitterName, submitterAffiliation, type }) {
  if (!db) return null
  const flagsRef = ref(db, 'flags')
  const newFlag = {
    questionId,
    questionText: (questionText || '').slice(0, 200),
    concern: (concern || '').slice(0, 500),
    flaggedAt: flaggedAt || new Date().toISOString(),
    type: type || 'flag',
    submitterName: submitterName ? submitterName.slice(0, 50) : null,
    submitterAffiliation: submitterAffiliation ? submitterAffiliation.slice(0, 100) : null,
  }
  await push(flagsRef, newFlag)
  return newFlag
}

export { isConfigured }
