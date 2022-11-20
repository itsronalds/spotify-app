import { createContext, useContext, useState } from 'react'

const initialState = {
  isAuth: false,
  accessToken: null,
  refreshToken: null
}

const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialState)
  
  // Values to provide
  const value = { auth, setAuth, }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Auth contex Hook
export const useAuthContext = () => useContext(AuthContext) 