import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login'
import ArtistsPage from './pages/artists'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/artists' element={<ArtistsPage />} />
      </Routes>
    </Router>
  )
}

export default App