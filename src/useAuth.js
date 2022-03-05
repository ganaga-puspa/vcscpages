import React, { useState, useEffect, useCallback } from "react"

let logoutTimer

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  loginn: (token) => {},
  logout: () => {},
})

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime()
  const adjExpirationTime = new Date(expirationTime).getTime()

  const remainingDuration = adjExpirationTime - currentTime

  return remainingDuration
}

const retrieveStoredToken = () => {
  const storedToken = sessionStorage.getItem("token")
  const storedExpirationDate = sessionStorage.getItem("expirationTime")

  const remainingTime = calculateRemainingTime(storedExpirationDate)

  return {
    token: storedToken,
    duration: remainingTime,
  }
}

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken()

  let initialToken
  if (tokenData) {
    initialToken = tokenData.token
  }

  const [token, setToken] = useState(initialToken)

  const userIsLoggedIn = !!token

  const logoutHandler = useCallback(() => {
    setToken(null)
    // localStorage.removeItem("token")
    // localStorage.removeItem("expirationTime")
    sessionStorage.clear()

    if (logoutTimer) {
      clearTimeout(logoutTimer)
    }
  }, [])

  const loginHandler = (token, expirationTime) => {
    setToken(token)
    sessionStorage.setItem("token", token)
    sessionStorage.setItem("expirationTime", expirationTime)
  }

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    loginn: loginHandler,
    logout: logoutHandler,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext
