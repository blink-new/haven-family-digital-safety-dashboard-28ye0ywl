import { useState, useEffect } from 'react'
import { blink } from '../lib/blink'
import type { BlinkUser } from '../lib/blink'

interface AuthState {
  user: BlinkUser | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  })

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setAuthState({
        user: state.user,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        error: null
      })
    })

    return unsubscribe
  }, [])

  const login = (nextUrl?: string) => {
    try {
      blink.auth.login(nextUrl)
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Login failed'
      }))
    }
  }

  const logout = (redirectUrl?: string) => {
    try {
      blink.auth.logout(redirectUrl)
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Logout failed'
      }))
    }
  }

  const updateProfile = async (data: { displayName?: string; avatar?: string }) => {
    try {
      const updatedUser = await blink.auth.updateMe(data)
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        error: null
      }))
      return updatedUser
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      setAuthState(prev => ({
        ...prev,
        error: errorMessage
      }))
      throw error
    }
  }

  return {
    ...authState,
    login,
    logout,
    updateProfile
  }
}