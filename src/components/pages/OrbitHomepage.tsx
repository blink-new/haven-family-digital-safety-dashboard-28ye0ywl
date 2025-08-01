import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { SpinningHouseLogo } from '../ui/SpinningHouseLogo'
import { NetworkMonitor } from '../features/NetworkMonitor'
import SecurityDiscovery from '../features/SecurityDiscovery'
import AccountConnections from '../features/AccountConnections'
import { FamilyInsights } from '../features/FamilyInsights'
import { RealTimeStatus } from '../features/RealTimeStatus'
import { EnhancedIcon, BrandLogo } from '../ui/EnhancedIcon'
import NestManager from '../features/NestManager'
import { TutorialSystem } from '../ui/TutorialSystem'
import { useAuth } from '../../hooks/useAuth'
import { useCyberScore } from '../../hooks/useCyberScore'
import { useSecurityAlerts } from '../../hooks/useSecurityAlerts'
import { useTutorial } from '../../hooks/useTutorial'
import { Users, Wifi, Play, Laptop, Bell, Brain, Shield, CheckCircle, Star, Zap, Network, HelpCircle, Loader2 } from 'lucide-react'

interface OrbitIcon {
  id: string
  icon: React.ComponentType<any>
  label: string
  position: number // 0-5 for 6 positions around circle
  color: string
  bgColor: string
  insight: string
  actionText: string
  actionType: 'primary' | 'secondary' | 'success' | 'warning'
}

// Remove local interface as we're using the one from backend

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

// Notification count will be calculated from real alerts data

const modalContent = {
  household: {
    title: 'How Your Family is Doing',
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold text-blue-600 mb-2">82</div>
          <div className="text-lg text-gray-600">Your Family's Safety Score</div>
          <Badge className="mt-2 bg-green-100 text-green-800">Looking Good! 👍</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">People in Your Home</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Gadgets We're Watching</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-gray-600">Apps & Accounts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">Things to Check</div>
            </CardContent>
          </Card>
        </div>
        <RealTimeStatus />
      </div>
    )
  },
  family: {
    title: 'Your Family',
    content: <FamilyInsights />
  },
  wifi: {
    title: 'Your Home Internet',
    content: (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>How Your Wi-Fi is Doing</span>
              <Badge className="bg-yellow-100 text-yellow-800">2 Unknown Devices</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Wi-Fi Name:</span>
                  <span className="font-medium">Haven_Family_5G</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Protection Level:</span>
                  <span className="font-medium">Strong & Secure</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Things Connected:</span>
                  <span className="font-medium">12 gadgets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guest Wi-Fi:</span>
                  <span className="font-medium">Set Up & Safe</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <NetworkMonitor />
      </div>
    )
  },
  services: {
    title: 'Your Apps & Online Accounts',
    content: (
      <div className="space-y-6">
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">What Your Family Uses Online</h3>
          <p className="text-purple-600">
            See all the apps and websites your family uses, keep track of what you're paying for, and make sure everything is safe.
          </p>
        </div>
        <AccountConnections />
      </div>
    )
  },
  technology: {
    title: 'Your Family\'s Gadgets',
    content: (
      <div className="space-y-4">
        <div className="text-center p-4 bg-cyan-50 rounded-lg">
          <h3 className="text-lg font-semibold text-cyan-800 mb-2">All Your Family's Tech</h3>
          <p className="text-cyan-600">
            Keep track of phones, tablets, smart TVs, and all the other gadgets in your home.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Devices Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">📱</span>
              Phones & Tablets
            </h4>
            <div className="space-y-3">
              {[
                { name: 'iPhone 15 Pro', owner: 'Sarah', status: 'All Good', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg', brand: 'Apple', risk: 'Low' },
                { name: 'Samsung Galaxy S24', owner: 'Mike', status: 'All Good', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/samsung.svg', brand: 'Samsung', risk: 'Low' },
                { name: 'iPad Air', owner: 'Emma', status: 'Keeping Watch', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg', brand: 'Apple', risk: 'Medium' },
                { name: 'MacBook Pro', owner: 'Family', status: 'All Good', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg', brand: 'Apple', risk: 'Low' }
              ].map((device, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <BrandLogo 
                          src={device.logo} 
                          alt={`${device.name} logo`}
                          brand={device.brand}
                          size="sm"
                        />
                        <div>
                          <div className="font-medium text-sm">{device.name}</div>
                          <div className="text-xs text-gray-600">{device.owner}</div>
                        </div>
                      </div>
                      <Badge className={`${device.risk === 'Low' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} text-xs`}>
                        {device.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Smart Home Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">🏠</span>
              Smart Home Stuff
            </h4>
            <div className="space-y-3">
              {[
                { name: 'Amazon Echo Dot', location: 'Living Room', status: 'Working Great', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg', brand: 'Amazon', risk: 'Low' },
                { name: 'Ring Doorbell', location: 'Front Door', status: 'Working Great', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/ring.svg', brand: 'Ring', risk: 'Low' },
                { name: 'Nest Thermostat', location: 'Hallway', status: 'Working Great', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlenest.svg', brand: 'Google', risk: 'Low' },
                { name: 'Samsung Smart TV', location: 'Living Room', status: 'Needs Update', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/samsung.svg', brand: 'Samsung', risk: 'Medium' }
              ].map((device, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <BrandLogo 
                          src={device.logo} 
                          alt={`${device.name} logo`}
                          brand={device.brand}
                          size="sm"
                        />
                        <div>
                          <div className="font-medium text-sm">{device.name}</div>
                          <div className="text-xs text-gray-600">{device.location}</div>
                        </div>
                      </div>
                      <Badge className={`${device.risk === 'Low' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} text-xs`}>
                        {device.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Security Tools Section */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <span className="text-2xl mr-2">🔒</span>
            Security Tools You Already Have
          </h4>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600 mb-4">
              Let's see what security apps and tools you already have, so we can avoid duplicates and save you money.
            </p>
            <SecurityDiscovery />
          </div>
        </div>
      </div>
    )
  },
  alerts: {
    title: 'Things That Need Your Attention',
    content: (
      <div className="space-y-4">
        {[
          {
            title: 'Your TV Has an Update',
            description: 'Your Samsung TV has a security update waiting - it\'ll just take a few minutes',
            severity: 'Medium',
            time: '2 hours ago',
            logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/samsung.svg',
            color: '#1428A0'
          },
          {
            title: 'Emma Downloaded a New App',
            description: 'Emma installed Discord on her phone - we\'re checking if it\'s safe',
            severity: 'Low',
            time: '1 day ago',
            logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg',
            color: '#5865F2'
          }
        ].map((alert, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 flex items-center justify-center mt-1">
                  <img 
                    src={alert.logo} 
                    alt={`${alert.title} logo`}
                    className="w-6 h-6"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{alert.title}</div>
                    <Badge className={`${alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                      {alert.severity === 'Medium' ? 'Worth Checking' : 'Just FYI'}
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
        {[].length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <EnhancedIcon type="shield" size="lg" variant="gradient" animated className="mx-auto" />
              <div className="text-lg font-medium text-gray-800 mb-2">Everything Looks Great!</div>
              <div className="text-gray-600">No issues to worry about right now</div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  },
  nest: {
    title: 'Your Safety Nest',
    content: <NestManager />
  },
  ai: {
    title: 'Ask Haven Anything',
    content: (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <EnhancedIcon type="robot" size="lg" variant="gradient" animated className="mx-auto" />
              <div className="text-lg font-medium">Hi! I'm here to help</div>
              <div className="text-gray-600">Ask me anything about keeping your family safe online</div>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                "Is TikTok safe for my teenager?"
              </Button>
              <Button variant="outline" className="w-full justify-start">
                "How can I make our Wi-Fi more secure?"
              </Button>
              <Button variant="outline" className="w-full justify-start">
                "What apps should I keep an eye on?"
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-3">Here's what I think you should do next:</div>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-sm">Turn on extra security for your bank apps</div>
                <div className="text-xs text-gray-600">It's called "two-factor authentication" - sounds fancy but it's easy!</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-sm">Set up screen time limits for Emma</div>
                <div className="text-xs text-gray-600">Especially for social media apps like Instagram and TikTok</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export function OrbitHomepage() {
  const [selectedModal, setSelectedModal] = useState<string | null>(null)
  const [showReward, setShowReward] = useState(false)
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())
  
  // Backend integration hooks
  const { user, isAuthenticated, isLoading: authLoading, login } = useAuth()
  const { score: cyberScore, isLoading: scoreLoading, performScan, isScanning } = useCyberScore()
  const { alerts, getAlertCounts } = useSecurityAlerts()
  const { showTutorial, hasSeenTutorial, startTutorial, completeTutorial, closeTutorial } = useTutorial()
  
  // Show loading screen while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading HAVEN...</p>
        </div>
      </div>
    )
  }
  
  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to HAVEN</h1>
            <p className="text-gray-600">Your family's digital safety dashboard</p>
          </div>
          <Button onClick={() => login()} className="bg-blue-600 hover:bg-blue-700">
            Sign In to Get Started
          </Button>
        </div>
      </div>
    )
  }

  // Get notification counts from real alerts data
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

  const getOrbitPosition = (position: number, radius: number = 200) => {
    const angle = (position * 51.43) - 90 // ~51.43 degrees apart (360/7), start from top
    const radian = (angle * Math.PI) / 180
    const x = Math.cos(radian) * radius
    const y = Math.sin(radian) * radius
    return { x, y }
  }

  const openModal = (modalId: string) => {
    setSelectedModal(modalId)
  }

  const handleHavenIconClick = () => {
    // If user hasn't seen tutorial, start it instead of opening modal
    if (!hasSeenTutorial) {
      startTutorial()
    } else {
      openModal('household')
    }
  }

  const closeModal = () => {
    setSelectedModal(null)
  }

  const handleQuickAction = async (iconId: string, actionText: string) => {
    // Add to completed actions
    setCompletedActions(prev => new Set([...prev, iconId]))
    
    // Show reward animation
    setShowReward(true)
    setTimeout(() => setShowReward(false), 3000)
    
    // Trigger a security scan to update the score
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      default: return '→'
    }
  }

  // Dynamic modal content with real data
  const getDynamicModalContent = () => ({
    household: {
      title: 'How Your Family is Doing',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {cyberScore?.score || '--'}
            </div>
            <div className="text-lg text-gray-600">Your Family's Safety Score</div>
            <Badge className={`mt-2 ${cyberScore && cyberScore.score >= 80 ? 'bg-green-100 text-green-800' : cyberScore && cyberScore.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {cyberScore ? (cyberScore.score >= 80 ? 'Looking Good! 👍' : cyberScore.score >= 70 ? 'Needs Attention 🔍' : 'Action Required ⚠️') : 'Loading...'}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600">People in Your Home</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Gadgets We're Watching</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-600">Apps & Accounts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{getAlertCounts().total || 0}</div>
                <div className="text-sm text-gray-600">Things to Check</div>
              </CardContent>
            </Card>
          </div>
          <RealTimeStatus />
        </div>
      )
    }
  })

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
          {/* Confetti effect */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">HAVEN</h1>
              <p className="text-sm text-gray-600">Keeping your family safe online</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={startTutorial}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
            <Button variant="ghost" size="sm">Settings</Button>
          </div>
        </div>
      </header>

      {/* Main Orbit Container */}
      <div className="relative flex items-center justify-center" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Central Cyber Risk Score - Perfectly Centered */}
        <div 
          className="absolute z-20 cursor-pointer transform transition-all duration-500 hover:scale-105 group"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          onClick={handleHavenIconClick}
          data-tutorial="center-score"
        >
          <div className="relative flex flex-col items-center animate-gentle-float">
            <div className="relative">
              {/* Dynamic Cyber Risk Score Display */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-xl border-4 border-gray-100 flex flex-col items-center justify-center group-hover:shadow-2xl transition-all duration-500">
                {scoreLoading || isScanning ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                    <div className="text-xs text-gray-500">
                      {isScanning ? 'Scanning...' : 'Loading...'}
                    </div>
                  </div>
                ) : cyberScore ? (
                  <>
                    <div className={`text-3xl md:text-4xl font-bold ${getScoreColor(cyberScore.score)} transition-colors duration-500`}>
                      {cyberScore.score}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">
                      Grade {cyberScore.grade}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 mr-1">{getTrendIcon(cyberScore.trend)}</span>
                      <span className="text-xs text-gray-500">{cyberScore.lastUpdate}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400 mb-1">--</div>
                    <div className="text-xs text-gray-500">No data</div>
                  </div>
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
                  {cyberScore && (
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={cyberScore.score >= 90 ? '#10b981' : cyberScore.score >= 80 ? '#3b82f6' : cyberScore.score >= 70 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="3"
                      strokeDasharray={`${cyberScore.score * 2.83} 283`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  )}
                </svg>
              </div>
              
              {/* Enhanced multi-layered glow effect */}
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="absolute inset-0 bg-purple-400 rounded-full opacity-10 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-0 bg-orange-300 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              {/* Status indicator with breathing animation */}
              {cyberScore && (
                <div className={`absolute -top-2 -right-2 w-6 h-6 ${getScoreBgColor(cyberScore.score)} rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-bounce-gentle`}>
                  <div className={`w-2 h-2 ${getScoreColor(cyberScore.score).replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                </div>
              )}
            </div>
            <div className="text-center mt-4">
              <div className="text-lg font-medium text-gray-800">Cyber Risk Score</div>
              <div className="text-sm text-gray-600">Click to see details</div>
              <div className="mt-2">
                {cyberScore ? (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getScoreBgColor(cyberScore.score)} ${getScoreColor(cyberScore.score)}`}>
                    🛡️ {cyberScore.score >= 90 ? 'Excellent' : cyberScore.score >= 80 ? 'Good' : cyberScore.score >= 70 ? 'Fair' : 'Needs Work'}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                    🛡️ Loading...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Orbiting Icons - Desktop */}
        <div className="hidden md:block" data-tutorial="orbit-icons">
          {orbitIcons.map((icon) => {
            const position = getOrbitPosition(icon.position, 220)
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
                {/* Modern Circle Icon with enhanced animations */}
                <div 
                  className={`w-20 h-20 ${icon.bgColor} rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-500 hover:border-gray-200 hover:scale-110 animate-orbit-pulse group-hover:animate-wiggle ${isCompleted ? 'ring-2 ring-green-400' : ''} cursor-pointer`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    openModal(icon.id)
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <IconComponent className={`w-8 h-8 ${icon.color} stroke-2 transition-all duration-300 group-hover:scale-110 ${isCompleted ? 'text-green-600' : ''}`} />
                  {isCompleted && (
                    <div className="absolute -bottom-1 -right-1">
                      <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                
                {/* Animated ring effect on hover */}
                <div className={`absolute inset-0 rounded-full border-2 ${icon.color.replace('text-', 'border-')} opacity-0 group-hover:opacity-50 scale-110 group-hover:scale-125 transition-all duration-500 animate-pulse pointer-events-none`}></div>
                
                {/* Notification Badge with bounce animation */}
                {notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-badge-bounce pointer-events-none">
                    <span className="text-xs font-bold text-white">{notificationCount}</span>
                  </div>
                )}
                
                {/* Mini-insight under icon */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none">
                  <div className="bg-white px-3 py-2 rounded-lg shadow-md text-xs font-medium text-gray-700 border border-gray-100 max-w-32 text-center">
                    <div className="font-semibold text-gray-800">{icon.label}</div>
                    <div className={`text-xs mt-1 ${notificationCount > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                      {icon.insight}
                    </div>
                  </div>
                </div>

                {/* Quick Action Button */}
                <div className="absolute -bottom-28 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button 
                    size="sm" 
                    variant={icon.actionType === 'primary' ? 'default' : icon.actionType === 'warning' ? 'destructive' : icon.actionType === 'success' ? 'default' : 'outline'}
                    className={`text-xs px-3 py-1 ${icon.actionType === 'success' ? 'bg-green-600 hover:bg-green-700' : ''} ${isCompleted ? 'bg-green-600 text-white' : ''} z-40`}
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
                        Done!
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3 mr-1" />
                        {icon.actionText}
                      </>
                    )}
                  </Button>
                </div>

                {/* Subtle glow effect */}
                <div className={`absolute inset-0 ${icon.color.replace('text-', 'bg-').replace('-600', '-200')} rounded-full opacity-20 blur-lg transition-opacity duration-300 hover:opacity-30 pointer-events-none`}></div>
              </div>
            </div>
          )
        })}
        </div>

        {/* Orbiting Icons - Mobile */}
        <div className="block md:hidden" data-tutorial="orbit-icons">
          {orbitIcons.map((icon) => {
            const position = getOrbitPosition(icon.position, 160)
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
                    className={`w-16 h-16 ${icon.bgColor} rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-gray-200 ${isCompleted ? 'ring-2 ring-green-400' : ''} cursor-pointer`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      openModal(icon.id)
                    }}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <IconComponent className={`w-6 h-6 ${icon.color} stroke-2 ${isCompleted ? 'text-green-600' : ''}`} />
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
                  
                  {/* Mini-insight under icon - Mobile */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none">
                    <div className="bg-white px-2 py-1 rounded-lg shadow-md text-xs font-medium text-gray-700 border border-gray-100 max-w-24 text-center">
                      <div className="font-semibold text-gray-800 text-xs">{icon.label}</div>
                      <div className={`text-xs mt-1 ${notificationCount > 0 ? 'text-orange-600' : 'text-gray-600'} truncate`}>
                        {icon.insight.length > 15 ? icon.insight.substring(0, 15) + '...' : icon.insight}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Button - Mobile */}
                  <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
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

                  {/* Subtle glow effect */}
                  <div className={`absolute inset-0 ${icon.color.replace('text-', 'bg-').replace('-600', '-200')} rounded-full opacity-20 blur-lg transition-opacity duration-300 hover:opacity-30 pointer-events-none`}></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Orbit Ring (subtle visual guide) - Perfectly Centered */}
        <div 
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div 
            className="border border-blue-200 rounded-full opacity-20 w-[480px] h-[480px] md:w-[480px] md:h-[480px] sm:w-[360px] sm:h-[360px]"
          ></div>
        </div>

        {/* Random floating particles with unpredictable movement patterns */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => {
            // Generate random starting positions
            const randomLeft = Math.random() * 90 + 5; // 5% to 95%
            const randomTop = Math.random() * 80 + 10; // 10% to 90%
            const randomDelay = Math.random() * 8; // 0 to 8 seconds delay
            const randomDuration = 14 + Math.random() * 8; // 14 to 22 seconds
            
            // Randomly assign animation patterns
            const animationPatterns = [
              'animate-random-float-1',
              'animate-random-float-2', 
              'animate-random-float-3',
              'animate-random-float-4',
              'animate-random-float-5'
            ];
            const randomAnimation = animationPatterns[i % 5];
            
            // Randomly assign colors and sizes
            const particleStyles = [
              'w-3 h-3 bg-blue-400',
              'w-4 h-4 bg-purple-400',
              'w-2 h-2 bg-orange-300',
              'w-5 h-5 bg-cyan-300',
              'w-3 h-3 bg-green-300',
              'w-4 h-4 bg-pink-300'
            ];
            const randomStyle = particleStyles[i % 6];
            
            return (
              <div
                key={i}
                className={`absolute rounded-full opacity-30 ${randomStyle} ${randomAnimation}`}
                style={{
                  left: `${randomLeft}%`,
                  top: `${randomTop}%`,
                  animationDelay: `${randomDelay}s`,
                  animationDuration: `${randomDuration}s`,
                }}
              ></div>
            );
          })}
          
          {/* Animated connecting lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {[...Array(3)].map((_, i) => (
              <line
                key={i}
                x1={`${20 + i * 30}%`}
                y1={`${30 + i * 20}%`}
                x2={`${60 + i * 15}%`}
                y2={`${70 - i * 25}%`}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                className="animate-pulse"
                style={{
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${3 + i * 0.5}s`,
                }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Enhanced Quick Actions Panel with slide-up animation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 animate-fade-in-up" data-tutorial="bottom-panel">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 px-6 py-3 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-4">
            <Button 
              size="sm" 
              variant="ghost" 
              className="rounded-full hover:bg-blue-100 transition-all duration-300 hover:scale-110 group"
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
                <span className="text-lg mr-2 group-hover:animate-wiggle">🔍</span>
              )}
              {isScanning ? 'Scanning...' : 'Quick Scan'}
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="rounded-full hover:bg-green-100 transition-all duration-300 hover:scale-110 group"
              onClick={() => openModal('ai')}
            >
              <span className="text-lg mr-2 group-hover:animate-wiggle">💬</span>
              Ask Haven
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="rounded-full hover:bg-purple-100 transition-all duration-300 hover:scale-110 group"
            >
              <span className="text-lg mr-2 group-hover:animate-wiggle">⚙️</span>
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedModal} onOpenChange={closeModal}>
        <DialogContent className={`${selectedModal === 'wifi' || selectedModal === 'services' || selectedModal === 'technology' || selectedModal === 'nest' ? 'max-w-6xl' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedModal === 'household' 
                ? getDynamicModalContent().household.title
                : selectedModal && modalContent[selectedModal as keyof typeof modalContent]?.title
              }
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedModal === 'household' 
              ? getDynamicModalContent().household.content
              : selectedModal && modalContent[selectedModal as keyof typeof modalContent]?.content
            }
          </div>
        </DialogContent>
      </Dialog>

      {/* Tutorial System */}
      <TutorialSystem 
        isOpen={showTutorial}
        onClose={closeTutorial}
        onComplete={completeTutorial}
      />
    </div>
  )
}