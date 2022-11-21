import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthContextProvider } from './contexts/auth'
import { StoreContextProvider } from './contexts/store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthContextProvider>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </AuthContextProvider>
);