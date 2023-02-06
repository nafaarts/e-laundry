import React, { createContext, useState, useContext, useEffect } from "react"
import * as SecureStore from "expo-secure-store"
import { authService } from "../services/authService"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState()
  const [loading, setLoading] = useState(true)
  const [isSignout, setIsSignout] = useState(false)

  useEffect(() => {
    loadStorageData()
  }, [])

  async function loadStorageData() {
    try {
      const authDataSerialized = await SecureStore.getItemAsync("AuthData")
      if (authDataSerialized) {
        const _authData = JSON.parse(authDataSerialized)
        let getMe = await authService.getMe(_authData.token)
        if (getMe) {
          setAuthData(_authData)
        } else {
          await signOut()
        }
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
  }

  const getToken = async () => {
    let getMe = await authService.getMe(authData.token)
    if (!getMe) await signOut()
    return authData.token
  }

  const signIn = async ({ email, password }) => {
    setIsSignout(false)
    setAuthData(null)
    const _authData = await authService.signIn(email, password)
    setAuthData(_authData)
    await SecureStore.setItemAsync("AuthData", JSON.stringify(_authData))
  }

  const register = async ({ name, email, phone_number, password }) => {
    setIsSignout(false)
    setAuthData(null)
    const _authData = await authService.register(
      name,
      email,
      phone_number,
      password,
    )
    setAuthData(_authData)
    await SecureStore.setItemAsync("AuthData", JSON.stringify(_authData))
    return _authData
  }

  const signOut = async () => {
    setIsSignout(true)
    await SecureStore.deleteItemAsync("AuthData")
    setAuthData(null)
  }

  return (
    <AuthContext.Provider
      value={{
        authData,
        loading,
        register,
        getToken,
        signIn,
        signOut,
        isSignout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

export { AuthContext, AuthProvider, useAuth }
