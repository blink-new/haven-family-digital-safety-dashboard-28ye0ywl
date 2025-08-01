import { useState, useEffect, useCallback } from 'react'
import { HavenAPI } from '../services/api'
import { useAuth } from './useAuth'
import type { UserPreferences } from '../lib/blink'

interface UserPreferencesState {
  preferences: UserPreferences | null
  isLoading: boolean
  error: string | null
}

export function useUserPreferences() {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState<UserPreferencesState>({
    preferences: null,
    isLoading: true,
    error: null
  })

  // Load user preferences
  const loadPreferences = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const preferences = await HavenAPI.getUserPreferences(user.id)
      setState(prev => ({ ...prev, preferences, isLoading: false }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load preferences',
        isLoading: false
      }))
    }
  }, [user?.id, isAuthenticated])

  // Update user preferences
  const updatePreferences = useCallback(async (preferencesData: Partial<UserPreferences>) => {
    if (!user?.id || !isAuthenticated) return

    try {
      setState(prev => ({ ...prev, error: null }))
      const updatedPreferences = await HavenAPI.updateUserPreferences(user.id, preferencesData)
      setState(prev => ({ ...prev, preferences: updatedPreferences }))
      return updatedPreferences
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update preferences'
      }))
      throw error
    }
  }, [user?.id, isAuthenticated])

  // Update specific preference sections
  const updateNotifications = useCallback(async (notifications: Partial<UserPreferences['notifications']>) => {
    if (!state.preferences) return
    
    return updatePreferences({
      notifications: {
        ...state.preferences.notifications,
        ...notifications
      }
    })
  }, [state.preferences, updatePreferences])

  const updatePrivacy = useCallback(async (privacy: Partial<UserPreferences['privacy']>) => {
    if (!state.preferences) return
    
    return updatePreferences({
      privacy: {
        ...state.preferences.privacy,
        ...privacy
      }
    })
  }, [state.preferences, updatePreferences])

  const updateSecurity = useCallback(async (security: Partial<UserPreferences['security']>) => {
    if (!state.preferences) return
    
    return updatePreferences({
      security: {
        ...state.preferences.security,
        ...security
      }
    })
  }, [state.preferences, updatePreferences])

  const updateTutorial = useCallback(async (tutorial: Partial<UserPreferences['tutorial']>) => {
    if (!state.preferences) return
    
    return updatePreferences({
      tutorial: {
        ...state.preferences.tutorial,
        ...tutorial
      }
    })
  }, [state.preferences, updatePreferences])

  // Load initial data
  useEffect(() => {
    loadPreferences()
  }, [loadPreferences])

  return {
    ...state,
    loadPreferences,
    updatePreferences,
    updateNotifications,
    updatePrivacy,
    updateSecurity,
    updateTutorial,
    refresh: loadPreferences
  }
}