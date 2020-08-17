import React, { createContext } from 'react'
import axios from 'axios'
import { AuthContext } from './AuthContext'

const FetchContext = createContext()
const { Provider } = FetchContext

const FetchProvider = ({ children }) => {
  const authContext = React.useContext(AuthContext)

  const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL
  })

  authAxios.interceptors.request.use(
    config => {
      config.headers.Authorization = `Bearer ${authContext.authState.token}`
      return config
    },
    error => new Promise.reject(error)
  )

  return (
    <Provider
      value={{
        authAxios
      }}
    >
      {children}
    </Provider>
  )
}

export { FetchContext, FetchProvider }
