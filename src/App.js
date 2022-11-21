import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login'
import ArtistsPage from './pages/artists'

import { useAuthContext } from './contexts/auth'
import { StoreContextProvider } from './contexts/store'

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
      <Route path='/artists' element={<StoreContextProvider><ArtistsPage /></StoreContextProvider>} />
      <Route path='*' element={<StoreContextProvider><ArtistsPage /></StoreContextProvider>} />
    </Routes>
  </Router>
)

const App = () => {
  const { auth: { isAuth } } = useAuthContext()
  return isAuth ? <AuthRoutes /> : <NoAuthRoutes />
}

export default App