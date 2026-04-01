import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import WelcomePage from './components/pages/WelcomePage.jsx'
import QuizSetupPage from './components/pages/QuizSetupPage.jsx'
import QuizPlayPage from './components/pages/QuizPlayPage.jsx'
import ResultsPage from './components/pages/ResultsPage.jsx'
import AboutPage from './components/pages/AboutPage.jsx'
import ReviewPage from './components/pages/ReviewPage.jsx'
import ReferencesPage from './components/pages/ReferencesPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/setup" element={<QuizSetupPage />} />
        <Route path="/play" element={<QuizPlayPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/references" element={<ReferencesPage />} />
      </Route>
    </Routes>
  )
}

export default App
