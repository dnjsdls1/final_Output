import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ApplyPage from './pages/ApplyPage.jsx'
import MainPage from './pages/MainPage.jsx'
import RecommendationsPage from './pages/RecommendationsPage.jsx'
import ResultPage from './pages/ResultPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
