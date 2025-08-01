import { useState, useEffect, useCallback } from 'react'
import { HavenAPI } from '../services/api'
import { useAuth } from './useAuth'
import type { SecurityAlert } from '../lib/blink'

interface SecurityAlertsState {
  alerts: SecurityAlert[]
  isLoading: boolean
  error: string | null
}

export function useSecurityAlerts(limit: number = 10) {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState<SecurityAlertsState>({
    alerts: [],
    isLoading: true,
    error: null
  })

  // Load security alerts
  const loadAlerts = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const alerts = await HavenAPI.getSecurityAlerts(user.id, limit)
      setState(prev => ({ ...prev, alerts, isLoading: false }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load security alerts',
        isLoading: false
      }))
    }
  }, [user?.id, isAuthenticated, limit])

  // Create new alert
  const createAlert = useCallback(async (alertData: Omit<SecurityAlert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.id || !isAuthenticated) return

    try {
      const newAlert = await HavenAPI.createSecurityAlert(user.id, alertData)
      setState(prev => ({ 
        ...prev, 
        alerts: [newAlert, ...prev.alerts].slice(0, limit) 
      }))
      
      // Broadcast real-time update
      await HavenAPI.broadcastUpdate(user.id, 'alert', newAlert)
      
      return newAlert
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create alert'
      }))
      throw error
    }
  }, [user?.id, isAuthenticated, limit])

  // Update alert status
  const updateAlert = useCallback(async (alertId: string, alertData: Partial<SecurityAlert>) => {
    if (!user?.id || !isAuthenticated) return

    try {
      const updatedAlert = await HavenAPI.updateSecurityAlert(alertId, alertData)
      setState(prev => ({
        ...prev,
        alerts: prev.alerts.map(alert => 
          alert.id === alertId ? updatedAlert : alert
        )
      }))
      
      return updatedAlert
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update alert'
      }))
      throw error
    }
  }, [user?.id, isAuthenticated])

  // Dismiss alert
  const dismissAlert = useCallback(async (alertId: string) => {
    return updateAlert(alertId, { status: 'dismissed' })
  }, [updateAlert])

  // Acknowledge alert
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    return updateAlert(alertId, { status: 'acknowledged' })
  }, [updateAlert])

  // Resolve alert
  const resolveAlert = useCallback(async (alertId: string) => {
    return updateAlert(alertId, { status: 'resolved' })
  }, [updateAlert])

  // Get alert counts by severity
  const getAlertCounts = useCallback(() => {
    return state.alerts.reduce((counts, alert) => {
      if (alert.status === 'new' || alert.status === 'acknowledged') {
        counts[alert.severity] = (counts[alert.severity] || 0) + 1
        counts.total = (counts.total || 0) + 1
      }
      return counts
    }, {} as Record<string, number>)
  }, [state.alerts])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user?.id || !isAuthenticated) return

    let unsubscribe: (() => void) | undefined
    let isSubscribed = true

    const setupRealtime = async () => {
      try {
        if (!isSubscribed) return
        
        unsubscribe = await HavenAPI.subscribeToUpdates(user.id, (data) => {
          if (!isSubscribed) return
          
          if (data.type === 'alert') {
            setState(prev => ({ 
              ...prev, 
              alerts: [data.alert, ...prev.alerts].slice(0, limit) 
            }))
          }
        })
      } catch (error) {
        console.error('Failed to setup real-time updates for alerts:', error)
        // Don't retry immediately to avoid spam
        if (isSubscribed) {
          setTimeout(() => {
            if (isSubscribed) setupRealtime()
          }, 5000)
        }
      }
    }

    setupRealtime()

    return () => {
      isSubscribed = false
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user?.id, isAuthenticated, limit])

  // Load initial data
  useEffect(() => {
    loadAlerts()
  }, [loadAlerts])

  return {
    ...state,
    loadAlerts,
    createAlert,
    updateAlert,
    dismissAlert,
    acknowledgeAlert,
    resolveAlert,
    getAlertCounts,
    refresh: loadAlerts
  }
}