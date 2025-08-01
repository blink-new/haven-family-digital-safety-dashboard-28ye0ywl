import { useState, useEffect, useCallback } from 'react'
import type { HavenMode } from '../components/ui/ModeSelector'

const HAVEN_MODE_STORAGE_KEY = 'haven-mode-preference'

interface HavenModeState {
  mode: HavenMode
  isLoading: boolean
  error: string | null
}

export function useHavenMode() {
  const [state, setState] = useState<HavenModeState>({
    mode: 'family', // Default to family mode
    isLoading: true,
    error: null
  })

  // Load mode from localStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(HAVEN_MODE_STORAGE_KEY) as HavenMode
      if (savedMode && ['simple', 'family', 'pro', 'silent'].includes(savedMode)) {
        setState(prev => ({ ...prev, mode: savedMode, isLoading: false }))
      } else {
        // First time user - default to family mode
        setState(prev => ({ ...prev, mode: 'family', isLoading: false }))
        localStorage.setItem(HAVEN_MODE_STORAGE_KEY, 'family')
      }
    } catch (error) {
      console.error('Failed to load Haven mode from localStorage:', error)
      setState(prev => ({ 
        ...prev, 
        mode: 'family', 
        isLoading: false,
        error: 'Failed to load saved mode preference'
      }))
    }
  }, [])

  // Listen for mode changes from other components (removed redundant event listener)

  // Update mode and save to localStorage
  const setMode = useCallback((newMode: HavenMode) => {
    console.log('useHavenMode: setMode called with:', newMode)
    try {
      // Update state immediately for instant UI response
      setState(prev => {
        console.log('useHavenMode: Updating state from', prev.mode, 'to', newMode)
        return { ...prev, mode: newMode, error: null }
      })
      
      // Save to localStorage
      localStorage.setItem(HAVEN_MODE_STORAGE_KEY, newMode)
      console.log('useHavenMode: Saved to localStorage:', newMode)
      
      // Optional: Track mode changes for analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'mode_change', {
          event_category: 'user_preference',
          event_label: newMode,
          value: 1
        })
      }
      
      console.log('useHavenMode: Mode changed to:', newMode)
    } catch (error) {
      console.error('Failed to save Haven mode to localStorage:', error)
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to save mode preference'
      }))
    }
  }, [])

  // Reset to default mode
  const resetMode = useCallback(() => {
    setMode('family')
  }, [setMode])

  // Get mode-specific configuration
  const getModeConfig = useCallback(() => {
    const { mode } = state
    
    switch (mode) {
      case 'simple':
        return {
          showOrbitIcons: 3, // Show only 3 most important icons
          showQuickActions: true,
          showDetailedTooltips: false,
          showProgressBars: false,
          showAIAssistant: false,
          showActivityTimeline: false,
          showFamilyInsights: false,
          maxAlertsShown: 1,
          enableAnimations: false,
          compactLayout: true
        }
      
      case 'family':
        return {
          showOrbitIcons: 7, // Show all icons
          showQuickActions: true,
          showDetailedTooltips: true,
          showProgressBars: true,
          showAIAssistant: true,
          showActivityTimeline: true,
          showFamilyInsights: true,
          maxAlertsShown: 3,
          enableAnimations: true,
          compactLayout: false,
          showWeeklyRecaps: true,
          showBehaviorTips: true,
          showScreenTimeTracking: true
        }
      
      case 'pro':
        return {
          showOrbitIcons: 7, // Show all icons
          showQuickActions: true,
          showDetailedTooltips: true,
          showProgressBars: true,
          showAIAssistant: true,
          showActivityTimeline: true,
          showFamilyInsights: true,
          maxAlertsShown: 10,
          enableAnimations: true,
          compactLayout: false,
          showAdvancedSettings: true,
          showSecurityLogs: true,
          showRiskHistory: true,
          showAnalytics: true,
          showExportOptions: true
        }
      
      case 'silent':
        return {
          showOrbitIcons: 0, // Hide all interactive elements
          showQuickActions: false,
          showDetailedTooltips: false,
          showProgressBars: false,
          showAIAssistant: false,
          showActivityTimeline: false,
          showFamilyInsights: false,
          maxAlertsShown: 0,
          enableAnimations: false,
          compactLayout: true,
          showMinimalStatus: true, // Only show basic status indicator
          backgroundMonitoring: true
        }
      
      default:
        return {
          showOrbitIcons: 7,
          showQuickActions: true,
          showDetailedTooltips: true,
          showProgressBars: true,
          showAIAssistant: true,
          showActivityTimeline: true,
          showFamilyInsights: true,
          maxAlertsShown: 5,
          enableAnimations: true,
          compactLayout: false
        }
    }
  }, [state])

  return {
    mode: state.mode,
    isLoading: state.isLoading,
    error: state.error,
    setMode,
    resetMode,
    config: getModeConfig(),
    isSimpleMode: state.mode === 'simple',
    isFamilyMode: state.mode === 'family',
    isProMode: state.mode === 'pro',
    isSilentMode: state.mode === 'silent'
  }
}