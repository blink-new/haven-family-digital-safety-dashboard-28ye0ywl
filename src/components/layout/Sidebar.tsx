import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { HavenLogo } from '../ui/HavenLogo'
import { 
  Home, 
  Settings, 
  BookOpen, 
  Shield, 
  Users, 
  Monitor, 
  FileText, 
  Activity,
  BarChart3,
  Orbit,
  Layers,
  Zap,
  Eye,
  Brain,
  Network
} from 'lucide-react'

const navigation = [
  // Main Dashboard Options
  { 
    id: 'dashboard', 
    name: 'Smart Dashboard', 
    icon: Home, 
    emoji: '🏠',
    description: 'Mode-adaptive main view',
    category: 'main'
  },
  { 
    id: 'mobile-orbit', 
    name: 'Orbit View', 
    icon: Orbit, 
    emoji: '🌍',
    description: 'Interactive orbit interface',
    category: 'main'
  },
  { 
    id: 'haven-dashboard', 
    name: 'Classic Dashboard', 
    icon: Layers, 
    emoji: '📊',
    description: 'Traditional dashboard layout',
    category: 'main'
  },

  // Feature Pages
  { 
    id: 'feature-showcase', 
    name: 'Feature Showcase', 
    icon: BarChart3, 
    emoji: '✨',
    description: 'Explore all advanced features',
    category: 'features'
  },
  { 
    id: 'inventory', 
    name: 'Device & Services', 
    icon: Monitor, 
    emoji: '📱',
    description: 'Manage connected devices',
    category: 'features'
  },
  { 
    id: 'policy-vault', 
    name: 'Policy & Vault', 
    icon: FileText, 
    emoji: '📋',
    description: 'Documents and policies',
    category: 'features'
  },
  { 
    id: 'safety-journal', 
    name: 'Safety Journal', 
    icon: BookOpen, 
    emoji: '📖',
    description: 'Activity logs and insights',
    category: 'features'
  },

  // Settings & Configuration
  { 
    id: 'safety-settings', 
    name: 'Safety Settings', 
    icon: Shield, 
    emoji: '🛡️',
    description: 'Configure protection levels',
    category: 'settings'
  },
  { 
    id: 'settings', 
    name: 'App Settings', 
    icon: Settings, 
    emoji: '⚙️',
    description: 'General preferences',
    category: 'settings'
  }
]

const categories = {
  main: 'Main Views',
  features: 'Features',
  settings: 'Settings'
}

interface SidebarProps {
  currentPage: string
  onPageChange: (pageId: string) => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const groupedNavigation = navigation.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof navigation>)

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <HavenLogo size="lg" showTagline={true} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {Object.entries(groupedNavigation).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {categories[category as keyof typeof categories]}
            </h3>
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-auto p-3 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => onPageChange(item.id)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.emoji}</span>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className={`text-xs ${
                          isActive ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onPageChange('onboarding')}
            >
              <Zap className="w-4 h-4 mr-2" />
              <span>Run Onboarding</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                // Trigger a security scan
                console.log('Triggering security scan...')
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              <span>Security Scan</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <div className="mb-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Protected by HAVEN</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Keeping families safe online
          </div>
          
          {/* Status Indicators */}
          <div className="mt-3 flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-green-500" />
              <span className="text-gray-600">Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-blue-500" />
              <span className="text-gray-600">Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <Network className="w-3 h-3 text-purple-500" />
              <span className="text-gray-600">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}