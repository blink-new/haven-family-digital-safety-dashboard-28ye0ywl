import { useState, useEffect, useCallback } from 'react'
import { HavenAPI } from '../services/api'
import { useAuth } from './useAuth'

interface TutorialState {
  showTutorial: boolean
  hasSeenTutorial: boolean
  currentStep: number
  isLoading: boolean
  error: string | null
}

export function useTutorial() {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState<TutorialState>({
    showTutorial: false,
    hasSeenTutorial: false,
    currentStep: 0,
    isLoading: true,
    error: null
  })

  // Load tutorial state from backend
  const loadTutorialState = useCallback(async () => {
    if (!user?.id || !isAuthenticated) {
      setState(prev => ({ ...prev, isLoading: false }))
      return
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const preferences = await HavenAPI.getUserPreferences(user.id)
      
      if (preferences?.tutorial) {
        setState(prev => ({
          ...prev,
          hasSeenTutorial: Number(preferences.tutorial.completed) > 0,
          currentStep: preferences.tutorial.currentStep || 0,
          isLoading: false
        }))
      } else {
        // Initialize tutorial preferences if they don't exist
        await HavenAPI.updateUserPreferences(user.id, {
          tutorial: {
            completed: false,
            currentStep: 0,
            skipped: false
          }
        })
        setState(prev => ({
          ...prev,
          hasSeenTutorial: false,
          currentStep: 0,
          isLoading: false
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load tutorial state',
        isLoading: false
      }))
    }
  }, [user?.id, isAuthenticated])

  // Start tutorial
  const startTutorial = useCallback(async () => {
    setState(prev => ({ ...prev, showTutorial: true }))
    
    if (user?.id && isAuthenticated) {
      try {
        await HavenAPI.updateTutorialProgress(user.id, 0, false)
      } catch (error) {
        console.error('Failed to update tutorial start:', error)
      }
    }
  }, [user?.id, isAuthenticated])

  // Complete tutorial
  const completeTutorial = useCallback(async () => {
    setState(prev => ({ 
      ...prev, 
      showTutorial: false, 
      hasSeenTutorial: true,
      currentStep: 0
    }))
    
    if (user?.id && isAuthenticated) {
      try {
        await HavenAPI.updateTutorialProgress(user.id, 0, true)
        
        // Log tutorial completion activity
        await HavenAPI.logActivity(user.id, {
          type: 'tutorial',
          title: 'Tutorial Completed',
          description: 'User completed the HAVEN tutorial',
          metadata: { completedAt: new Date().toISOString() }
        })
      } catch (error) {
        console.error('Failed to complete tutorial:', error)
      }
    }
  }, [user?.id, isAuthenticated])

  // Close tutorial (without completing)
  const closeTutorial = useCallback(() => {
    setState(prev => ({ ...prev, showTutorial: false }))
  }, [])

  // Update tutorial step
  const updateTutorialStep = useCallback(async (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }))
    
    if (user?.id && isAuthenticated) {
      try {
        await HavenAPI.updateTutorialProgress(user.id, step, false)
      } catch (error) {
        console.error('Failed to update tutorial step:', error)
      }
    }
  }, [user?.id, isAuthenticated])

  // Reset tutorial (for testing or re-onboarding)
  const resetTutorial = useCallback(async () => {
    setState(prev => ({ 
      ...prev, 
      hasSeenTutorial: false, 
      currentStep: 0,
      showTutorial: false
    }))
    
    if (user?.id && isAuthenticated) {
      try {
        await HavenAPI.updateUserPreferences(user.id, {
          tutorial: {
            completed: false,
            currentStep: 0,
            skipped: false
          }
        })
      } catch (error) {
        console.error('Failed to reset tutorial:', error)
      }
    }
  }, [user?.id, isAuthenticated])

  // Skip tutorial
  const skipTutorial = useCallback(async () => {
    setState(prev => ({ 
      ...prev, 
      showTutorial: false, 
      hasSeenTutorial: true
    }))
    
    if (user?.id && isAuthenticated) {
      try {
        await HavenAPI.updateUserPreferences(user.id, {
          tutorial: {
            completed: false,
            currentStep: 0,
            skipped: true
          }
        })
        
        // Log tutorial skip activity
        await HavenAPI.logActivity(user.id, {
          type: 'tutorial',
          title: 'Tutorial Skipped',
          description: 'User skipped the HAVEN tutorial',
          metadata: { skippedAt: new Date().toISOString() }
        })
      } catch (error) {
        console.error('Failed to skip tutorial:', error)
      }
    }
  }, [user?.id, isAuthenticated])

  // Load initial tutorial state
  useEffect(() => {
    loadTutorialState()
  }, [loadTutorialState])

  return {
    ...state,
    startTutorial,
    completeTutorial,
    closeTutorial,
    updateTutorialStep,
    resetTutorial,
    skipTutorial,
    refresh: loadTutorialState
  }
}