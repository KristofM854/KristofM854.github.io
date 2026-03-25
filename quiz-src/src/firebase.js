import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, query, orderByChild, limitToLast, get, set } from 'firebase/database'

// ============================================================
// FIREBASE CONFIG — Replace these values with your own!
// See the setup instructions provided by the developer.
// ============================================================
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  databaseURL: "https://REPLACE_ME-default-rtdb.firebaseio.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.firebasestorage.app",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
}

// Only initialize if config has been set up
const isConfigured = firebaseConfig.apiKey !== 'REPLACE_ME'

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

export async function submitFlag({ questionId, questionText, concern, flaggedAt }) {
  if (!db) return null
  const flagsRef = ref(db, 'flags')
  const newFlag = {
    questionId,
    questionText: (questionText || '').slice(0, 200),
    concern: (concern || '').slice(0, 500),
    flaggedAt: flaggedAt || new Date().toISOString(),
  }
  await push(flagsRef, newFlag)
  return newFlag
}

export { isConfigured }
