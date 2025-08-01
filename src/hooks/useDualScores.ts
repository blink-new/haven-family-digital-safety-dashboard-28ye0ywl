import { useState, useEffect, useCallback } from 'react'
import { DualScoringEngine, type DualScoreResult } from '../services/DualScoringEngine'
import { useAuth } from './useAuth'

interface DualScoresState {
  scores: DualScoreResult | null
  isLoading: boolean
  error: string | null
  isScanning: boolean
}

export function useDualScores() {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState<DualScoresState>({
    scores: null,
    isLoading: true,
    error: null,
    isScanning: false
  })

  // Load dual scores
  const loadScores = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const scores = await DualScoringEngine.getDualScores(user.id)
      setState(prev => ({ ...prev, scores, isLoading: false }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load scores',
        isLoading: false
      }))
    }
  }, [user?.id, isAuthenticated])

  // Perform cyber resilience scan
  const performCyberScan = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return

    try {
      setState(prev => ({ ...prev, isScanning: true, error: null }))
      
      // Update cyber resilience score
      await DualScoringEngine.updateCyberResilienceScore(user.id)
      
      // Reload scores to get updated values
      await loadScores()
      
      setState(prev => ({ ...prev, isScanning: false }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Cyber scan failed',
        isScanning: false
      }))
      throw error
    }
  }, [user?.id, isAuthenticated, loadScores])

  // Add user score points
  const addUserPoints = useCallback(async (
    activityType: 'recommendation_completed' | 'safe_setting_enabled' | 'screen_time_goal_met' | 'engagement_action',
    points: number,
    description: string
  ) => {
    if (!user?.id || !isAuthenticated) return

    try {
      setState(prev => ({ ...prev, error: null }))
      
      await DualScoringEngine.addUserScorePoints(user.id, activityType, points, description)
      
      // Reload scores to get updated values
      await loadScores()
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to add user points'
      }))
      throw error
    }
  }, [user?.id, isAuthenticated, loadScores])

  // Get cyber resilience score only
  const getCyberResilienceScore = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return null

    try {
      return await DualScoringEngine.getCyberResilienceScore(user.id)
    } catch (error) {
      console.error('Failed to get cyber resilience score:', error)
      return null
    }
  }, [user?.id, isAuthenticated])

  // Get user score only
  const getUserScore = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return null

    try {
      return await DualScoringEngine.getUserScore(user.id)
    } catch (error) {
      console.error('Failed to get user score:', error)
      return null
    }
  }, [user?.id, isAuthenticated])

  // Load initial data
  useEffect(() => {
    loadScores()
  }, [loadScores])

  return {
    ...state,
    loadScores,
    performCyberScan,
    addUserPoints,
    getCyberResilienceScore,
    getUserScore,
    refresh: loadScores
  }
}