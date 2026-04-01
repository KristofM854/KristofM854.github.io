import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QuizSessionProvider } from './context/QuizSessionContext.jsx'
import App from './App.jsx'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <QuizSessionProvider>
        <App />
      </QuizSessionProvider>
    </HashRouter>
  </StrictMode>,
)
