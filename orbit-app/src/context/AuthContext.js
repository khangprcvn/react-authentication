import React, { createContext } from 'react'
import { useHistory } from 'react-router-dom'

const AuthContext = createContext()
const { Provider } = AuthContext

const AuthProvider = ({ children }) => {
  const history = useHistory()
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')
  const expiresAt = localStorage.getItem('expiresAt')

  const [authState, setAuthState] = React.useState({
    token,
    expiresAt,
    userInfo: userInfo ? JSON.parse(userInfo) : {},
  })

  const setAuthInfo = ({ token, userInfo, expiresAt }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    localStorage.setItem('expiresAt', expiresAt)
    setAuthState({
      token,
      userInfo,
      expiresAt,
    })
  }

  const logout = () => {
    localStorage.clear()
    setAuthState({
      token: null,
      expiresAt: null,
      userInfo: {},
    })
    history.push('/login')
  }

  const isAuthenticated = () => {
    if (!authState.token || !authState.userInfo) return false

    return new Date().getTime() / 1000 < authState.expiresAt
  }

  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </Provider>
  )
}

export { AuthContext, AuthProvider }
