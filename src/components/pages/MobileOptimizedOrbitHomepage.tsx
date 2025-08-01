import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { HavenLogo } from '../ui/HavenLogo'
import { ModeSelector } from '../ui/ModeSelector'
import { useAuth } from '../../hooks/useAuth'
import { useHavenMode } from '../../hooks/useHavenMode'
import { useCyberScore } from '../../hooks/useCyberScore'
import { useSecurityAlerts } from '../../hooks/useSecurityAlerts'
import { Users, Wifi, Play, Laptop, Bell, Brain, Shield, CheckCircle, Star, Zap, Network, HelpCircle, Loader2 } from 'lucide-react'

interface OrbitIcon {
  id: string
  icon: React.ComponentType<any>
  label: string
  position: number
  color: string
  bgColor: string
  insight: string
  actionText: string
  actionType: 'primary' | 'secondary' | 'success' | 'warning'
}

const orbitIcons: OrbitIcon[] = [
  { 
    id: 'family', 
    icon: Users, 
    label: 'Family', 
    position: 0, 
    color: 'text-blue-600', 
    bgColor: 'bg-white',
    insight: 'Emma: 3h screen time today',
    actionText: 'Review limits',
    actionType: 'secondary'
  },
  { 
    id: 'wifi', 
    icon: Wifi, 
    label: 'Wi-Fi', 
    position: 1, 
    color: 'text-green-600', 
    bgColor: 'bg-white',
    insight: '2 unknown devices detected',
    actionText: 'Secure network',
    actionType: 'warning'
  },
  { 
    id: 'services', 
    icon: Play, 
    label: 'Apps & Services', 
    position: 2, 
    color: 'text-purple-600', 
    bgColor: 'bg-white',
    insight: '1 vulnerable account',
    actionText: 'Review alert',
    actionType: 'warning'
  },
  { 
    id: 'technology', 
    icon: Laptop, 
    label: 'Gadgets', 
    position: 3, 
    color: 'text-cyan-600', 
    bgColor: 'bg-white',
    insight: 'All devices updated ✓',
    actionText: 'Run check',
    actionType: 'success'
  },
  { 
    id: 'nest', 
    icon: Network, 
    label: 'Safety Nest', 
    position: 4, 
    color: 'text-pink-600', 
    bgColor: 'bg-white',
    insight: '3 connected homes',
    actionText: 'Manage nest',
    actionType: 'primary'
  },
  { 
    id: 'alerts', 
    icon: Bell, 
    label: 'Alerts', 
    position: 5, 
    color: 'text-orange-600', 
    bgColor: 'bg-white',
    insight: 'Late-night activity detected',
    actionText: 'Review activity',
    actionType: 'primary'
  },
  { 
    id: 'ai', 
    icon: Brain, 
    label: 'Ask Haven', 
    position: 6, 
    color: 'text-indigo-600', 
    bgColor: 'bg-white',
    insight: 'Screen time improved +5 pts',
    actionText: 'Ask Haven',
    actionType: 'success'
  }
]

const modalContent = {
  family: {
    title: 'Your Family',
    content: (
      <div className="space-y-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Family Overview</h3>
          <p className="text-blue-600">
            Keep track of your family's digital activities and screen time.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Emma', age: '14', screenTime: '3h 15m', status: 'Online', avatar: '👧' },
            { name: 'Mike', age: '16', screenTime: '2h 45m', status: 'Offline', avatar: '👦' },
            { name: 'Sarah', age: 'Adult', screenTime: '1h 30m', status: 'Online', avatar: '👩' },
            { name: 'Dad', age: 'Adult', screenTime: '45m', status: 'Online', avatar: '👨' }
          ].map((member, index) => (
            <Card key={index}>
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">{member.avatar}</div>
                <div className="font-medium text-sm">{member.name}</div>
                <div className="text-xs text-gray-600">{member.screenTime} today</div>
                <Badge className={`mt-1 text-xs ${member.status === 'Online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {member.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  },
  wifi: {
    title: 'Your Home Internet',
    content: (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Network Status</span>
              <Badge className="bg-yellow-100 text-yellow-800">2 Unknown Devices</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Network Name:</span>
                <span className="font-medium">Haven_Family_5G</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security:</span>
                <span className="font-medium text-green-600">WPA3 Protected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Connected Devices:</span>
                <span className="font-medium">12 devices</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  services: {
    title: 'Apps & Services',
    content: (
      <div className="space-y-4">
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Connected Services</h3>
          <p className="text-purple-600">
            Monitor all the apps and online services your family uses.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Netflix', status: 'Safe', users: '4 users', icon: '📺' },
            { name: 'Instagram', status: 'Review', users: '2 users', icon: '📷' },
            { name: 'Gmail', status: 'Safe', users: '4 users', icon: '📧' },
            { name: 'TikTok', status: 'Monitor', users: '1 user', icon: '🎵' }
          ].map((service, index) => (
            <Card key={index}>
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">{service.icon}</div>
                <div className="font-medium text-sm">{service.name}</div>
                <div className="text-xs text-gray-600">{service.users}</div>
                <Badge className={`mt-1 text-xs ${
                  service.status === 'Safe' ? 'bg-green-100 text-green-800' : 
                  service.status === 'Review' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-orange-100 text-orange-800'
                }`}>
                  {service.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  },
  technology: {
    title: 'Your Gadgets',
    content: (
      <div className="space-y-4">
        <div className="text-center p-4 bg-cyan-50 rounded-lg">
          <h3 className="text-lg font-semibold text-cyan-800 mb-2">Device Overview</h3>
          <p className="text-cyan-600">
            All your family's devices are being monitored for security.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { name: 'iPhone 15 Pro', owner: 'Sarah', status: 'Protected', icon: '📱' },
            { name: 'Samsung Galaxy', owner: 'Mike', status: 'Protected', icon: '📱' },
            { name: 'iPad Air', owner: 'Emma', status: 'Update Available', icon: '📱' },
            { name: 'Smart TV', owner: 'Family', status: 'Protected', icon: '📺' }
          ].map((device, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{device.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{device.name}</div>
                      <div className="text-xs text-gray-600">{device.owner}</div>
                    </div>
                  </div>
                  <Badge className={`text-xs ${
                    device.status === 'Protected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {device.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  },
  nest: {
    title: 'Safety Nest',
    content: (
      <div className="space-y-4">
        <div className="text-center p-4 bg-pink-50 rounded-lg">
          <h3 className="text-lg font-semibold text-pink-800 mb-2">Connected Homes</h3>
          <p className="text-pink-600">
            Manage security across all your connected locations.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Main Home', address: '123 Oak Street', devices: '12 devices', status: 'Secure' },
            { name: 'Vacation Home', address: 'Lake House', devices: '4 devices', status: 'Secure' },
            { name: 'Office', address: 'Downtown', devices: '8 devices', status: 'Monitor' }
          ].map((location, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{location.name}</div>
                    <div className="text-xs text-gray-600">{location.address}</div>
                    <div className="text-xs text-gray-500">{location.devices}</div>
                  </div>
                  <Badge className={`text-xs ${
                    location.status === 'Secure' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {location.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  },
  alerts: {
    title: 'Active Alerts',
    content: (
      <div className="space-y-4">
        {[
          {
            title: 'TV Update Available',
            description: 'Your Samsung TV has a security update waiting',
            severity: 'Medium',
            time: '2 hours ago',
            icon: '📺'
          },
          {
            title: 'New App Installed',
            description: 'Emma installed Discord - checking safety',
            severity: 'Low',
            time: '1 day ago',
            icon: '📱'
          }
        ].map((alert, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{alert.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{alert.title}</div>
                    <Badge className={`${alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{alert.description}</div>
                  <div className="text-xs text-gray-500">{alert.time}</div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Fix This
                    </Button>
                    <Button size="sm" variant="outline">
                      Not Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  },
  ai: {
    title: 'Ask Haven',
    content: (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🤖</div>
              <div className="text-lg font-medium">Hi! I'm here to help</div>
              <div className="text-gray-600">Ask me anything about keeping your family safe online</div>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left">
                "Is TikTok safe for my teenager?"
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                "How can I make our Wi-Fi more secure?"
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                "What apps should I keep an eye on?"
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export function MobileOptimizedOrbitHomepage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const { mode, setMode, config } = useHavenMode()
  const { score: cyberScoreData, isLoading: scoreLoading, performScan, isScanning } = useCyberScore()
  const { alerts, getAlertCounts } = useSecurityAlerts()
  
  // Debug current mode
  console.log('MobileOptimizedOrbitHomepage: Current mode is:', mode)
  
  const [selectedModal, setSelectedModal] = useState<string | null>(null)
  const [showReward, setShowReward] = useState(false)
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())
  
  const cyberScore = cyberScoreData?.score || 85
  const userScore = 50

  // Helper functions
  const getOrbitPosition = (position: number, radius: number = 140) => {
    const angle = (position * 51.43) - 90 // ~51.43 degrees apart (360/7), start from top
    const radian = (angle * Math.PI) / 180
    const x = Math.cos(radian) * radius
    const y = Math.sin(radian) * radius
    return { x, y }
  }

  const getNotificationCount = (iconId: string): number => {
    const alertCounts = getAlertCounts()
    switch (iconId) {
      case 'alerts': return alertCounts.total || 0
      case 'wifi': return alerts.filter(a => a.category === 'network' && (a.status === 'new' || a.status === 'acknowledged')).length
      case 'services': return alerts.filter(a => a.category === 'app' && (a.status === 'new' || a.status === 'acknowledged')).length
      case 'technology': return alerts.filter(a => a.category === 'device' && (a.status === 'new' || a.status === 'acknowledged')).length
      default: return 0
    }
  }

  const openModal = (modalId: string) => {
    setSelectedModal(modalId)
  }

  const closeModal = () => {
    setSelectedModal(null)
  }

  const handleQuickAction = async (iconId: string, actionText: string) => {
    setCompletedActions(prev => new Set([...prev, iconId]))
    setShowReward(true)
    setTimeout(() => setShowReward(false), 3000)
    
    try {
      await performScan()
    } catch (error) {
      console.error('Failed to perform security scan:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 80) return 'bg-blue-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to HAVEN</h1>
            <p className="text-gray-600">Your family's digital safety dashboard</p>
          </div>
          <Button onClick={() => window.location.href = 'https://blink.new/auth'} className="bg-blue-600 hover:bg-blue-700">
            Sign In to Get Started
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden relative">
      
      {/* Reward Animation */}
      {showReward && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 animate-pulse">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-medium">Great job! +{Math.floor(Math.random() * 5) + 2} points</span>
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="relative z-10 p-4 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <HavenLogo size="md" />
          <ModeSelector 
            currentMode={mode} 
            onModeChange={(newMode) => {
              console.log('MobileOptimizedOrbitHomepage: onModeChange called with:', newMode)
              setMode(newMode)
            }} 
          />
        </div>
        
        {/* Prominent Score Display */}
        <div className="flex gap-3 mb-4">
          <div className={`flex-1 ${getScoreBgColor(cyberScore)} rounded-2xl p-4 text-center`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">🛡️</span>
              <span className="text-xs font-medium text-gray-600">CYBER SCORE</span>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(cyberScore)}`}>
              {cyberScore}
            </div>
            <div className="text-xs text-gray-600 mt-1">Grade A-</div>
          </div>
          
          <div className={`flex-1 ${getScoreBgColor(userScore)} rounded-2xl p-4 text-center`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">👤</span>
              <span className="text-xs font-medium text-gray-600">USER SCORE</span>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(userScore)}`}>
              {userScore}
            </div>
            <div className="text-xs text-gray-600 mt-1">Good</div>
          </div>
        </div>
      </header>

      {/* Main Orbit Container */}
      <div className="relative flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Central Cyber Risk Score */}
        <div 
          className="absolute z-20 cursor-pointer transform transition-all duration-500 hover:scale-105 group"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => openModal('household')}
        >
          <div className="relative flex flex-col items-center">
            <div className="relative">
              <div className="relative w-24 h-24 bg-white rounded-full shadow-xl border-4 border-gray-100 flex flex-col items-center justify-center group-hover:shadow-2xl transition-all duration-500">
                {scoreLoading || isScanning ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-1" />
                    <div className="text-xs text-gray-500">
                      {isScanning ? 'Scanning...' : 'Loading...'}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`text-2xl font-bold ${getScoreColor(cyberScore)} transition-colors duration-500`}>
                      {cyberScore}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      Grade {cyberScoreData?.grade || 'A-'}
                    </div>
                  </>
                )}
              </div>
              
              {/* Animated score ring */}
              <div className="absolute inset-0 rounded-full">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={cyberScore >= 90 ? '#10b981' : cyberScore >= 80 ? '#3b82f6' : cyberScore >= 70 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="3"
                    strokeDasharray={`${cyberScore * 2.83} 283`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-sm font-medium text-gray-800">Cyber Score</div>
              <div className="text-xs text-gray-600">Tap for details</div>
            </div>
          </div>
        </div>

        {/* Orbiting Icons - Mobile Optimized */}
        <div className="block">
          {orbitIcons.map((icon) => {
            const position = getOrbitPosition(icon.position, 140)
            const notificationCount = getNotificationCount(icon.id)
            const IconComponent = icon.icon
            const isCompleted = completedActions.has(icon.id)
            
            return (
              <div
                key={icon.id}
                className="absolute z-30 cursor-pointer transform transition-all duration-300 hover:scale-110"
                style={{
                  left: `calc(50% + ${position.x}px)`,
                  top: `calc(50% + ${position.y}px)`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto'
                }}
              >
                <div className="relative group">
                  {/* Modern Circle Icon */}
                  <div 
                    className={`w-14 h-14 ${icon.bgColor} rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-gray-200 ${isCompleted ? 'ring-2 ring-green-400' : ''} cursor-pointer`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      openModal(icon.id)
                    }}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <IconComponent className={`w-5 h-5 ${icon.color} stroke-2 ${isCompleted ? 'text-green-600' : ''}`} />
                    {isCompleted && (
                      <div className="absolute -bottom-1 -right-1">
                        <CheckCircle className="w-4 h-4 text-green-500 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  {/* Notification Badge */}
                  {notificationCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-white">{notificationCount}</span>
                    </div>
                  )}
                  
                  {/* Label under icon */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none">
                    <div className="bg-white px-2 py-1 rounded-lg shadow-md text-xs font-medium text-gray-700 border border-gray-100 text-center">
                      <div className="font-semibold text-gray-800 text-xs">{icon.label}</div>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button 
                      size="sm" 
                      variant={icon.actionType === 'primary' ? 'default' : icon.actionType === 'warning' ? 'destructive' : icon.actionType === 'success' ? 'default' : 'outline'}
                      className={`text-xs px-2 py-1 ${icon.actionType === 'success' ? 'bg-green-600 hover:bg-green-700' : ''} ${isCompleted ? 'bg-green-600 text-white' : ''} z-40`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleQuickAction(icon.id, icon.actionText)
                      }}
                      disabled={isCompleted}
                      style={{ pointerEvents: 'auto' }}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Done
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 mr-1" />
                          {icon.actionText.length > 8 ? icon.actionText.substring(0, 8) + '...' : icon.actionText}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Orbit Ring (subtle visual guide) */}
        <div 
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="border border-blue-200 rounded-full opacity-20 w-[320px] h-[320px]"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => {
            const randomLeft = Math.random() * 90 + 5
            const randomTop = Math.random() * 80 + 10
            const randomDelay = Math.random() * 4
            const randomDuration = 8 + Math.random() * 4
            
            const particleStyles = [
              'w-2 h-2 bg-blue-400',
              'w-3 h-3 bg-purple-400',
              'w-2 h-2 bg-orange-300',
              'w-3 h-3 bg-cyan-300'
            ]
            const randomStyle = particleStyles[i % 4]
            
            return (
              <div
                key={i}
                className={`absolute rounded-full opacity-30 ${randomStyle} animate-pulse`}
                style={{
                  left: `${randomLeft}%`,
                  top: `${randomTop}%`,
                  animationDelay: `${randomDelay}s`,
                  animationDuration: `${randomDuration}s`,
                }}
              ></div>
            )
          })}
        </div>
      </div>

      {/* Bottom Quick Actions */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 px-6 py-3 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <Button 
              size="sm" 
              variant="ghost" 
              className="rounded-full hover:bg-blue-100 transition-all duration-300"
              onClick={async () => {
                try {
                  await performScan()
                  setShowReward(true)
                  setTimeout(() => setShowReward(false), 3000)
                } catch (error) {
                  console.error('Scan failed:', error)
                }
              }}
              disabled={isScanning}
            >
              {isScanning ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <span className="text-lg mr-2">🔍</span>
              )}
              {isScanning ? 'Scanning...' : 'Quick Scan'}
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="rounded-full hover:bg-green-100 transition-all duration-300"
              onClick={() => openModal('ai')}
            >
              <span className="text-lg mr-2">💬</span>
              Ask Haven
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedModal} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedModal && modalContent[selectedModal as keyof typeof modalContent]?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedModal && modalContent[selectedModal as keyof typeof modalContent]?.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}