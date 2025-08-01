import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MobileOptimizedOrbitHomepage } from './components/pages/MobileOptimizedOrbitHomepage'
import { OrbitHomepage } from './components/pages/OrbitHomepage'
import { Dashboard } from './components/pages/Dashboard'
import { FamilyDashboard } from './components/pages/FamilyDashboard'
import HavenDashboard from './components/pages/HavenDashboard'
import SimplifiedDashboard from './components/pages/SimplifiedDashboard'
import { Inventory } from './components/pages/Inventory'
import { PolicyVault } from './components/pages/PolicyVault'
import { Settings } from './components/pages/Settings'
import { SafetySettings } from './components/pages/SafetySettings'
import { SafetyJournal } from './components/pages/SafetyJournal'
import { Onboarding } from './components/pages/Onboarding'
import { FriendlyOnboarding } from './components/pages/FriendlyOnboarding'
import { FeatureShowcase } from './components/pages/FeatureShowcase'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { AppSidebar } from './components/layout/AppSidebar'
import { ModeSelector } from './components/ui/ModeSelector'
import { useHavenMode } from './hooks/useHavenMode'
import { useAuth } from './hooks/useAuth'
import { blink } from './lib/blink'
import { Shield, Loader2 } from 'lucide-react'
import { Button } from './components/ui/button'
import './App.css'

function App() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { mode, setMode, config } = useHavenMode()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user needs onboarding
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if this is a first-time user (you can implement this logic)
      const hasCompletedOnboarding = localStorage.getItem('haven-onboarding-completed')
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true)
      }
    }
  }, [isAuthenticated, user])

  const handleOnboardingComplete = () => {
    localStorage.setItem('haven-onboarding-completed', 'true')
    setShowOnboarding(false)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">HAVEN</h1>
          <p className="text-gray-600">Loading your family's digital safety dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to HAVEN</h1>
            <p className="text-gray-600">Your family's digital safety dashboard</p>
          </div>
          <Button 
            onClick={() => blink.auth.login()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Sign In to Get Started
          </Button>
        </div>
      </div>
    )
  }

  // Show onboarding for new users
  if (showOnboarding) {
    return <FriendlyOnboarding onComplete={handleOnboardingComplete} />
  }

  // Render different layouts based on mode
  const renderMainContent = () => {
    switch (currentPage) {
      case 'dashboard':
        // Choose dashboard based on mode
        if (mode === 'simple') {
          return <SimplifiedDashboard />
        } else if (mode === 'family') {
          return <FamilyDashboard />
        } else if (mode === 'pro') {
          return <Dashboard />
        } else {
          return <MobileOptimizedOrbitHomepage />
        }
      
      case 'orbit':
        return <OrbitHomepage />
      
      case 'mobile-orbit':
        return <MobileOptimizedOrbitHomepage />
      
      case 'haven-dashboard':
        return <HavenDashboard />
      
      case 'inventory':
        return <Inventory />
      
      case 'policy-vault':
        return <PolicyVault />
      
      case 'settings':
        return <Settings />
      
      case 'safety-settings':
        return <SafetySettings />
      
      case 'safety-journal':
        return <SafetyJournal />
      
      case 'onboarding':
        return <FriendlyOnboarding onComplete={() => setCurrentPage('dashboard')} />
      
      case 'feature-showcase':
        return <FeatureShowcase />
      
      default:
        return <MobileOptimizedOrbitHomepage />
    }
  }

  // For silent mode, show minimal interface
  if (mode === 'silent') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">HAVEN Active</span>
              <ModeSelector 
                currentMode={mode} 
                onModeChange={setMode}
                className="ml-2"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-6">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Silent Mode Active</h2>
            <p className="text-gray-500 mb-4">
              HAVEN is protecting your family in the background. 
              Switch modes above to access the full dashboard.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // For other modes, show full interface with sidebar navigation
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block">
          <Sidebar 
            currentPage={currentPage} 
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <Header guardian={{ name: 'HAVEN', emoji: '🛡️' }} />
          
          {/* Mode Selector - Always visible */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {currentPage === 'dashboard' ? 'Dashboard' :
                   currentPage === 'orbit' ? 'Orbit View' :
                   currentPage === 'mobile-orbit' ? 'Mobile Orbit' :
                   currentPage === 'haven-dashboard' ? 'Haven Dashboard' :
                   currentPage === 'inventory' ? 'Device & Service Inventory' :
                   currentPage === 'policy-vault' ? 'Policy & Vault' :
                   currentPage === 'settings' ? 'Settings' :
                   currentPage === 'safety-settings' ? 'Safety Settings' :
                   currentPage === 'safety-journal' ? 'Safety Journal' :
                   currentPage === 'feature-showcase' ? 'Feature Showcase' :
                   'Dashboard'}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <ModeSelector 
                  currentMode={mode} 
                  onModeChange={setMode}
                />
                
                {/* Quick Page Switcher */}
                <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                    onClick={() => setCurrentPage('dashboard')}
                    className="text-xs"
                  >
                    Dashboard
                  </Button>
                  <Button
                    size="sm"
                    variant={currentPage === 'mobile-orbit' ? 'default' : 'ghost'}
                    onClick={() => setCurrentPage('mobile-orbit')}
                    className="text-xs"
                  >
                    Orbit
                  </Button>
                  <Button
                    size="sm"
                    variant={currentPage === 'haven-dashboard' ? 'default' : 'ghost'}
                    onClick={() => setCurrentPage('haven-dashboard')}
                    className="text-xs"
                  >
                    Classic
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="p-6">
            {renderMainContent()}
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <Button
            size="sm"
            variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setCurrentPage('dashboard')}
            className="flex-col h-auto py-2"
          >
            <Shield className="w-4 h-4 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            size="sm"
            variant={currentPage === 'mobile-orbit' ? 'default' : 'ghost'}
            onClick={() => setCurrentPage('mobile-orbit')}
            className="flex-col h-auto py-2"
          >
            <div className="w-4 h-4 mb-1 rounded-full border-2 border-current"></div>
            <span className="text-xs">Orbit</span>
          </Button>
          <Button
            size="sm"
            variant={currentPage === 'inventory' ? 'default' : 'ghost'}
            onClick={() => setCurrentPage('inventory')}
            className="flex-col h-auto py-2"
          >
            <div className="w-4 h-4 mb-1 grid grid-cols-2 gap-0.5">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
            <span className="text-xs">Devices</span>
          </Button>
          <Button
            size="sm"
            variant={currentPage === 'settings' ? 'default' : 'ghost'}
            onClick={() => setCurrentPage('settings')}
            className="flex-col h-auto py-2"
          >
            <div className="w-4 h-4 mb-1">⚙️</div>
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App