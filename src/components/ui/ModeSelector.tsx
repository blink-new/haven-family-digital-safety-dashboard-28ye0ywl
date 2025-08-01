import React, { useState, useEffect } from 'react'
import { Card, CardContent } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { HavenBrand } from './HavenLogo'
import { 
  Zap, 
  Users, 
  Settings, 
  EyeOff, 
  Check, 
  Smartphone,
  Shield,
  Brain,
  Bell,
  BarChart3,
  Clock,
  Volume2,
  VolumeX
} from 'lucide-react'

export type HavenMode = 'simple' | 'family' | 'pro' | 'silent'

interface ModeConfig {
  id: HavenMode
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
  features: string[]
  uiComplexity: 'minimal' | 'moderate' | 'full' | 'background'
  showAlerts: boolean
  showDashboard: boolean
  showAI: boolean
  showLogs: boolean
  showSettings: boolean
}

const modeConfigs: ModeConfig[] = [
  {
    id: 'simple',
    name: 'Simple Mode',
    description: 'Clean, minimal interface with just the essentials',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    features: [
      'Basic cyber score display',
      'Single priority alert',
      'One-click actions only',
      'Simplified navigation'
    ],
    uiComplexity: 'minimal',
    showAlerts: true,
    showDashboard: true,
    showAI: false,
    showLogs: false,
    showSettings: false
  },
  {
    id: 'family',
    name: 'Family Mode',
    description: 'Tailored for households with kids and elderly members',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    features: [
      'Family member insights',
      'Weekly safety recaps',
      'Parental controls',
      'Behavior tips & guidance',
      'Screen time tracking'
    ],
    uiComplexity: 'moderate',
    showAlerts: true,
    showDashboard: true,
    showAI: true,
    showLogs: false,
    showSettings: true
  },
  {
    id: 'pro',
    name: 'Pro Mode',
    description: 'Full feature access for power users',
    icon: Settings,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    features: [
      'Complete dashboard access',
      'Detailed security logs',
      'Advanced AI assistant',
      'Risk history & analytics',
      'Custom configurations',
      'Export capabilities'
    ],
    uiComplexity: 'full',
    showAlerts: true,
    showDashboard: true,
    showAI: true,
    showLogs: true,
    showSettings: true
  },
  {
    id: 'silent',
    name: 'Silent Mode',
    description: 'Background monitoring with no interruptions',
    icon: EyeOff,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    features: [
      'Background-only monitoring',
      'No alerts or notifications',
      'Minimal UI presence',
      'Protection continues silently',
      'Emergency alerts only'
    ],
    uiComplexity: 'background',
    showAlerts: false,
    showDashboard: false,
    showAI: false,
    showLogs: false,
    showSettings: false
  }
]

interface ModeSelectorProps {
  currentMode: HavenMode
  onModeChange: (mode: HavenMode) => void
  className?: string
}

export function ModeSelector({ currentMode, onModeChange, className = '' }: ModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMode, setSelectedMode] = useState<HavenMode>(currentMode)

  const currentConfig = modeConfigs.find(config => config.id === currentMode)

  const handleModeSelect = (mode: HavenMode) => {
    setSelectedMode(mode)
    // Trigger mode change immediately
    onModeChange(mode)
    // Close dialog after a brief delay to allow state to update
    setTimeout(() => setIsOpen(false), 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${className} hover:scale-105 transition-all duration-300 group`}
        >
          {currentConfig && (
            <>
              <currentConfig.icon className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              {currentConfig.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {currentMode.toUpperCase()}
              </Badge>
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <HavenBrand />
          </div>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Choose Your HAVEN Experience
          </DialogTitle>
          <p className="text-gray-600 text-center">
            Select the mode that best fits your needs. You can change this anytime.
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {modeConfigs.map((config) => {
            const isSelected = selectedMode === config.id
            const isCurrent = currentMode === config.id
            
            return (
              <Card 
                key={config.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                } ${isCurrent ? 'border-green-500 bg-green-50/50' : ''}`}
                onClick={() => setSelectedMode(config.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full ${config.bgColor}`}>
                        <config.icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{config.name}</h3>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </div>
                    </div>
                    {isCurrent && (
                      <Badge className="bg-green-100 text-green-800">
                        Current
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {config.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Smartphone className="w-3 h-3 mr-1" />
                            Mobile Ready
                          </div>
                          <div className="flex items-center">
                            <Shield className="w-3 h-3 mr-1" />
                            Full Protection
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {config.showAI && <Brain className="w-3 h-3 text-blue-500" />}
                          {config.showAlerts && <Bell className="w-3 h-3 text-orange-500" />}
                          {config.showLogs && <BarChart3 className="w-3 h-3 text-purple-500" />}
                          {!config.showAlerts && <VolumeX className="w-3 h-3 text-gray-400" />}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleModeSelect(config.id)
                        }}
                        className="w-full"
                        size="sm"
                      >
                        {isCurrent ? 'Keep Current Mode' : `Switch to ${config.name}`}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Protection Level Unchanged</h4>
              <p className="text-sm text-blue-700 mt-1">
                All modes provide the same level of security protection. Only the interface complexity and features change.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook for mode-specific UI configuration
export function useModeConfig(mode: HavenMode) {
  const config = modeConfigs.find(c => c.id === mode)
  
  return {
    config,
    shouldShowComponent: (component: 'alerts' | 'dashboard' | 'ai' | 'logs' | 'settings') => {
      if (!config) return true
      
      switch (component) {
        case 'alerts': return config.showAlerts
        case 'dashboard': return config.showDashboard
        case 'ai': return config.showAI
        case 'logs': return config.showLogs
        case 'settings': return config.showSettings
        default: return true
      }
    },
    getUIComplexity: () => config?.uiComplexity || 'full',
    isMinimalMode: () => config?.uiComplexity === 'minimal',
    isSilentMode: () => config?.id === 'silent',
    isFamilyMode: () => config?.id === 'family',
    isProMode: () => config?.id === 'pro'
  }
}

// Quick mode switcher for mobile
export function QuickModeSwitch({ currentMode, onModeChange }: { currentMode: HavenMode, onModeChange: (mode: HavenMode) => void }) {
  const modes: HavenMode[] = ['simple', 'family', 'pro', 'silent']
  
  return (
    <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
      {modes.map((mode) => {
        const config = modeConfigs.find(c => c.id === mode)
        const isActive = currentMode === mode
        
        return (
          <Button
            key={mode}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={`rounded-full px-3 py-1 text-xs transition-all duration-300 ${
              isActive ? 'shadow-md' : 'hover:bg-gray-100'
            }`}
            onClick={() => {
              console.log('Quick mode switch to:', mode)
              onModeChange(mode)
            }}
          >
            {config && <config.icon className="w-3 h-3 mr-1" />}
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        )
      })}
    </div>
  )
}