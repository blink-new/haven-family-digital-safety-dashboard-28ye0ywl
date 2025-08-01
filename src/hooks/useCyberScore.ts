import { useState, useEffect, useCallback } from 'react'
import { HavenAPI } from '../services/api'
import { CyberRiskEngine } from '../services/CyberRiskEngine'
import { useAuth } from './useAuth'
import type { CyberScore } from '../lib/blink'

interface CyberScoreState {
  score: CyberScore | null
  isLoading: boolean
  error: string | null
  isScanning: boolean
  summary?: string
  autoRemediations?: string[]
  recommendations?: string[]
}

export function useCyberScore() {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState<CyberScoreState>({
    score: null,
    isLoading: true,
    error: null,
    isScanning: false,
    summary: undefined,
    autoRemediations: [],
    recommendations: []
  })

  // Load cyber score
  const loadCyberScore = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const score = await HavenAPI.getCyberScore(user.id)
      setState(prev => ({ ...prev, score, isLoading: false }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load cyber score',
        isLoading: false
      }))
    }
  }, [user?.id, isAuthenticated])

  // Perform security scan using the new Cyber Risk Engine
  const performScan = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return

    try {
      setState(prev => ({ ...prev, isScanning: true, error: null }))
      
      // Use the new Cyber Risk Engine for protection-focused scoring
      const updatedScore = await CyberRiskEngine.updateUserScore(user.id)
      
      setState(prev => ({ 
        ...prev, 
        score: updatedScore,
        isScanning: false 
      }))
      
      return {
        score: updatedScore.score,
        alerts: [],
        recommendations: []
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Security scan failed',
        isScanning: false
      }))
      throw error
    }
  }, [user?.id, isAuthenticated])

  // Update cyber score
  const updateScore = useCallback(async (scoreData: Partial<CyberScore>) => {
    if (!user?.id || !isAuthenticated) return

    try {
      setState(prev => ({ ...prev, error: null }))
      const updatedScore = await HavenAPI.updateCyberScore(user.id, scoreData)
      setState(prev => ({ ...prev, score: updatedScore }))
      
      // Broadcast real-time update
      await HavenAPI.broadcastUpdate(user.id, 'score-update', updatedScore)
      
      return updatedScore
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update cyber score'
      }))
      throw error
    }
  }, [user?.id, isAuthenticated])

  // Subscribe to real-time updates with improved cleanup
  useEffect(() => {
    if (!user?.id || !isAuthenticated) return

    let unsubscribe: (() => void) | undefined
    let isSubscribed = true
    let retryTimeout: NodeJS.Timeout | undefined

    const setupRealtime = async () => {
      try {
        if (!isSubscribed) return
        
        console.log('Setting up realtime subscription for user:', user.id)
        
        unsubscribe = await HavenAPI.subscribeToUpdates(user.id, (data) => {
          if (!isSubscribed) {
            console.log('Ignoring realtime update - component unmounted')
            return
          }
          
          console.log('Received realtime update:', data)
          
          if (data.type === 'score-update') {
            setState(prev => ({ 
              ...prev, 
              score: data.score,
              summary: data.summary,
              autoRemediations: data.autoRemediations || [],
              recommendations: data.recommendations || []
            }))
          }
        })
        
        console.log('Successfully set up realtime subscription')
      } catch (error) {
        console.error('Failed to setup real-time updates:', error)
        
        // Only retry if still subscribed and not a validation error
        if (isSubscribed && !error?.message?.includes('Subscription cancelled')) {
          console.log('Retrying realtime setup in 5 seconds...')
          retryTimeout = setTimeout(() => {
            if (isSubscribed) {
              setupRealtime()
            }
          }, 5000)
        }
      }
    }

    setupRealtime()

    return () => {
      console.log('Cleaning up realtime subscription for user:', user.id)
      isSubscribed = false
      
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
      
      if (unsubscribe) {
        try {
          unsubscribe()
        } catch (error) {
          console.error('Error during unsubscribe:', error)
        }
      }
    }
  }, [user?.id, isAuthenticated])

  // Load initial data
  useEffect(() => {
    loadCyberScore()
  }, [loadCyberScore])

  return {
    ...state,
    loadCyberScore,
    performScan,
    updateScore,
    refresh: loadCyberScore
  }
}