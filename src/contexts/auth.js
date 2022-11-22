import { createContext, useContext, useState, useEffect } from 'react'

const initialState = {
  isAuth: false,
  accessToken: null,
  refreshToken: null
}

const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialState)

  const checkAuth = () => {
    const credentials = window.localStorage.getItem('auth') ? JSON.parse(window.localStorage.getItem('auth')) : undefined

    if (!credentials) {
      return setAuth(initialState)
    }

    setAuth({ isAuth: true, ...credentials })
  }

  useEffect(() => {
    checkAuth()
  }, [])
  
  // Values to provide
  const value = { auth, setAuth, }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Auth contex Hook
export const useAuthContext = () => useContext(AuthContext) 