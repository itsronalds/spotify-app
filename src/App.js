import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/login'
import ArtistsPage from './pages/artists'
import MyAlbums from './pages/myAlbums'

import { useAuthContext } from './contexts/auth'

const NoAuthRoutes = () => (
  <Router>
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='*' element={<LoginPage />} />
    </Routes>
  </Router>
)

const AuthRoutes = () => (
  <Router>
    <Routes>
      <Route path='/artists'   element={<ArtistsPage />} />
      <Route path='/my-albums' element={<MyAlbums />} />
      <Route path='*'          element={<ArtistsPage />} />
    </Routes>
  </Router>
)

const App = () => {
  const { auth: { isAuth } } = useAuthContext()
  return isAuth ? <AuthRoutes /> : <NoAuthRoutes />
}

export default App