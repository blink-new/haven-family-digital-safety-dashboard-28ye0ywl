import React, { useState, useEffect } from 'react'
import { Shield, Loader2, Home, Users, Settings as SettingsIcon, FileText, Zap, Menu, X } from 'lucide-react'
import { Button } from './components/ui/button'
import { ModeSelector } from './components/ui/ModeSelector'
import { useAuth } from './hooks/useAuth'
import { useHavenMode } from './hooks/useHavenMode'
import { blink } from './lib/blink'
import './App.css'

function App() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { mode, setMode } = useHavenMode()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  console.log('App render:', { authLoading, isAuthenticated, user: user?.email, mode, currentPage })

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

  // Main app layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">HAVEN</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <nav className="mt-6 px-3">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Main dashboard view' },
            { id: 'orbit', label: 'Orbit View', icon: Zap, description: 'Interactive orbit interface' },
            { id: 'inventory', label: 'Devices & Services', icon: SettingsIcon, description: 'Manage your digital inventory' },
            { id: 'policy-vault', label: 'Policy & Vault', icon: FileText, description: 'Documents and policies' },
            { id: 'feature-showcase', label: 'All Features', icon: Users, description: 'Explore all HAVEN features' },
            { id: 'settings', label: 'Settings', icon: SettingsIcon, description: 'App preferences and configuration' }
          ].map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-3 py-2 mb-1 text-left rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            )
          })}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user.displayName || user.email}
              </div>
              <div className="text-xs text-gray-500">
                {user.email}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => blink.auth.logout()}
            className="w-full mt-2 text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  {currentPage === 'dashboard' ? 'Dashboard' :
                   currentPage === 'orbit' ? 'Orbit View' :
                   currentPage === 'inventory' ? 'Devices & Services' :
                   currentPage === 'policy-vault' ? 'Policy & Vault' :
                   currentPage === 'feature-showcase' ? 'All Features' :
                   currentPage === 'settings' ? 'Settings' : 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentPage === 'dashboard' ? 'Main dashboard view' :
                   currentPage === 'orbit' ? 'Interactive orbit interface' :
                   currentPage === 'inventory' ? 'Manage your digital inventory' :
                   currentPage === 'policy-vault' ? 'Documents and policies' :
                   currentPage === 'feature-showcase' ? 'Explore all HAVEN features' :
                   currentPage === 'settings' ? 'App preferences and configuration' : 'Main dashboard view'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ModeSelector 
                currentMode={mode} 
                onModeChange={setMode}
              />
              
              {/* Quick page switcher */}
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
                  variant={currentPage === 'orbit' ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage('orbit')}
                  className="text-xs"
                >
                  Orbit
                </Button>
                <Button
                  size="sm"
                  variant={currentPage === 'feature-showcase' ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage('feature-showcase')}
                  className="text-xs"
                >
                  Features
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {currentPage === 'dashboard' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Digital Safety Score</h2>
                <div className="flex items-center justify-center">
                  <div className="text-6xl font-bold text-green-600">85</div>
                  <div className="ml-4">
                    <div className="text-lg font-medium text-gray-800">Excellent</div>
                    <div className="text-sm text-gray-600">Your family is well protected</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Family Members</h3>
                  <div className="text-3xl font-bold text-blue-600">4</div>
                  <div className="text-sm text-gray-600">All protected</div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Connected Devices</h3>
                  <div className="text-3xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">All secure</div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Alerts</h3>
                  <div className="text-3xl font-bold text-yellow-600">2</div>
                  <div className="text-sm text-gray-600">Need attention</div>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'orbit' && (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Orbit View</h2>
              <p className="text-gray-600">Interactive orbit interface coming soon...</p>
            </div>
          )}

          {currentPage === 'inventory' && (
            <div className="text-center py-12">
              <SettingsIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Devices & Services</h2>
              <p className="text-gray-600">Manage your digital inventory...</p>
            </div>
          )}

          {currentPage === 'policy-vault' && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Policy & Vault</h2>
              <p className="text-gray-600">Documents and policies...</p>
            </div>
          )}

          {currentPage === 'feature-showcase' && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">All Features</h2>
              <p className="text-gray-600">Explore all HAVEN features...</p>
            </div>
          )}

          {currentPage === 'settings' && (
            <div className="text-center py-12">
              <SettingsIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
              <p className="text-gray-600">App preferences and configuration...</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <Button
            size="sm"
            variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setCurrentPage('dashboard')}
            className="flex-col h-auto py-2"
          >
            <Home className="w-4 h-4 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            size="sm"
            variant={currentPage === 'orbit' ? 'default' : 'ghost'}
            onClick={() => setCurrentPage('orbit')}
            className="flex-col h-auto py-2"
          >
            <Zap className="w-4 h-4 mb-1" />
            <span className="text-xs">Orbit</span>
          </Button>
          <Button
            size="sm"
            variant={currentPage === 'inventory' ? 'default' : 'ghost'}
            onClick={() => setCurrentPage('inventory')}
            className="flex-col h-auto py-2"
          >
            <SettingsIcon className="w-4 h-4 mb-1" />
            <span className="text-xs">Devices</span>
          </Button>
          <Button
            size="sm"
            variant={currentPage === 'feature-showcase' ? 'default' : 'ghost'}
            onClick={() => setCurrentPage('feature-showcase')}
            className="flex-col h-auto py-2"
          >
            <Users className="w-4 h-4 mb-1" />
            <span className="text-xs">Features</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App