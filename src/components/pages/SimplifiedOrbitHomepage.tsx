import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Users, Wifi, Play, Laptop, Bell, Brain, Shield, CheckCircle, Star, Zap, Network, HelpCircle } from 'lucide-react'
import { EnhancedIcon } from '../ui/EnhancedIcon'
import { HavenLogo, HavenBrand } from '../ui/HavenLogo'
import { HavenAPI } from '../../services/api'
import { useCyberScore } from '../../hooks/useCyberScore'
import { useHavenMode } from '../../hooks/useHavenMode'
import { ModeSelector, QuickModeSwitch } from '../ui/ModeSelector'
import { SimpleModeHomepage } from './SimpleModeHomepage'
import { SilentModeHomepage } from './SilentModeHomepage'
import { FamilyModeHomepage } from './FamilyModeHomepage'

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
  iconName: string
}

const orbitIcons: OrbitIcon[] = [
  { 
    id: 'family', 
    icon: Users, 
    label: 'Family', 
    position: 0, 
    color: 'text-blue-600', 
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    insight: 'Emma: 3h screen time today',
    actionText: 'Review limits',
    actionType: 'secondary',
    iconName: 'family'
  },
  { 
    id: 'wifi', 
    icon: Wifi, 
    label: 'Wi-Fi', 
    position: 1, 
    color: 'text-green-600', 
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
    insight: '2 unknown devices detected',
    actionText: 'Secure network',
    actionType: 'warning',
    iconName: 'wifi'
  },
  { 
    id: 'services', 
    icon: Play, 
    label: 'Apps & Services', 
    position: 2, 
    color: 'text-purple-600', 
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    insight: '1 vulnerable account',
    actionText: 'Review alert',
    actionType: 'warning',
    iconName: 'smartphone'
  },
  { 
    id: 'technology', 
    icon: Laptop, 
    label: 'Gadgets', 
    position: 3, 
    color: 'text-cyan-600', 
    bgColor: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
    insight: 'All devices updated',
    actionText: 'Run check',
    actionType: 'success',
    iconName: 'laptop'
  },
  { 
    id: 'nest', 
    icon: Network, 
    label: 'Safety Nest', 
    position: 4, 
    color: 'text-pink-600', 
    bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
    insight: '3 connected homes',
    actionText: 'Manage nest',
    actionType: 'primary',
    iconName: 'home'
  },
  { 
    id: 'alerts', 
    icon: Bell, 
    label: 'Alerts', 
    position: 5, 
    color: 'text-orange-600', 
    bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
    insight: 'Late-night activity detected',
    actionText: 'Review activity',
    actionType: 'primary',
    iconName: 'bell'
  },
  { 
    id: 'ai', 
    icon: Brain, 
    label: 'Ask Haven', 
    position: 6, 
    color: 'text-blue-600', 
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    insight: 'Screen time improved +5 pts',
    actionText: 'Ask Haven',
    actionType: 'success',
    iconName: 'robot'
  }
]

const modalContent = {
  household: {
    title: 'How Your Family is Doing',
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold text-blue-600 mb-2">85</div>
          <div className="text-lg text-gray-600">Your Family's Safety Score</div>
          <Badge className="mt-2 bg-green-100 text-green-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Looking Good!
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
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">Things to Check</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
  wifi: {
    title: 'Wi-Fi Network Security',
    content: (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Wifi className="w-12 h-12 text-blue-600" />
          </div>
          <div className="text-lg font-semibold">Home Network Status</div>
          <Badge className="bg-yellow-100 text-yellow-800">2 Unknown Devices</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { 
              name: 'Main Router', 
              status: 'Secure', 
              ip: '192.168.1.1', 
              type: 'Router',
              logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/cisco.svg',
              color: '#1BA0D7'
            },
            { name: 'Sarah\'s iPhone', status: 'Secure', ip: '192.168.1.15', type: 'Phone' },
            { name: 'Unknown Device', status: 'Warning', ip: '192.168.1.23', type: 'Unknown' },
            { name: 'Smart TV', status: 'Secure', ip: '192.168.1.45', type: 'TV' }
          ].map((device, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 border">
                      <img 
                        src={device.logo} 
                        alt={`${device.name} logo`}
                        className="w-6 h-6"
                        style={{ filter: device.type === 'Unknown' ? `brightness(0) saturate(100%) invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)` : `brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)` }}
                      />
                    </div>
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm text-gray-600">{device.ip} • {device.type}</div>
                    </div>
                  </div>
                  <Badge className={device.status === 'Secure' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {device.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex space-x-2 mt-4">
          <Button className="flex-1">Secure Network</Button>
          <Button variant="outline" className="flex-1">Run Scan</Button>
        </div>
      </div>
    )
  },
  services: {
    title: 'Apps & Services',
    content: (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Play className="w-12 h-12 text-purple-600" />
          </div>
          <div className="text-lg font-semibold">Connected Services</div>
          <Badge className="bg-yellow-100 text-yellow-800">1 Vulnerable Account</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { 
              name: 'Netflix', 
              status: 'Secure', 
              users: 4, 
              lastUsed: '2 hours ago',
              logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netflix.svg',
              color: '#E50914'
            },
            { 
              name: 'Gmail', 
              status: 'Warning', 
              users: 2, 
              lastUsed: '5 minutes ago',
              logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg',
              color: '#EA4335'
            },
            { 
              name: 'PlayStation', 
              status: 'Secure', 
              users: 1, 
              lastUsed: '1 day ago',
              logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/playstation.svg',
              color: '#003791'
            },
            { 
              name: 'Ring Doorbell', 
              status: 'Secure', 
              users: 2, 
              lastUsed: '30 minutes ago',
              logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/ring.svg',
              color: '#0066CC'
            }
          ].map((service, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 border">
                      <img 
                        src={service.logo} 
                        alt={`${service.name} logo`}
                        className="w-6 h-6"
                        style={{ filter: `brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)` }}
                      />
                    </div>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-600">{service.users} users • {service.lastUsed}</div>
                    </div>
                  </div>
                  <Badge className={service.status === 'Secure' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {service.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex space-x-2 mt-4">
          <Button className="flex-1">Review Alert</Button>
          <Button variant="outline" className="flex-1">Add Service</Button>
        </div>
      </div>
    )
  },
  technology: {
    title: 'Gadgets & Devices',
    content: (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Laptop className="w-12 h-12 text-cyan-600" />
          </div>
          <div className="text-lg font-semibold">Device Security</div>
          <Badge className="bg-green-100 text-green-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            All Updated
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { 
              name: 'MacBook Pro', 
              status: 'Updated', 
              owner: 'Sarah', 
              lastUpdate: 'Yesterday',
              logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg',
              color: '#000000'
            },
            { 
              name: 'iPad', 
              status: 'Updated', 
              owner: 'Emma', 
              lastUpdate: '2 days ago',
              logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg',
              color: '#000000'
            },
            { 
              name: 'Smart TV', 
              status: 'Updated', 
              owner: 'Family', 
              lastUpdate: '1 week ago',
              logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/samsung.svg',
              color: '#1428A0'
            },
            { 
              name: 'Alexa Echo', 
              status: 'Updated', 
              owner: 'Family', 
              lastUpdate: '3 days ago',
              logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazonalexa.svg',
              color: '#00CAFF'
            }
          ].map((device, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 border">
                      <img 
                        src={device.logo} 
                        alt={`${device.name} logo`}
                        className="w-6 h-6"
                        style={{ filter: `brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)` }}
                      />
                    </div>
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm text-gray-600">{device.owner} • Updated {device.lastUpdate}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {device.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex space-x-2 mt-4">
          <Button className="flex-1">Run Check</Button>
          <Button variant="outline" className="flex-1">Add Device</Button>
        </div>
      </div>
    )
  },
  nest: {
    title: 'Safety Nest Network',
    content: (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Network className="w-12 h-12 text-pink-600" />
          </div>
          <div className="text-lg font-semibold">Connected Homes</div>
          <Badge className="bg-blue-100 text-blue-800">3 Homes Connected</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: 'Main House', status: 'Active', devices: 12, score: 85 },
            { name: 'Grandma\'s House', status: 'Active', devices: 6, score: 78 },
            { name: 'Vacation Home', status: 'Inactive', devices: 4, score: 92 }
          ].map((home, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{home.name}</div>
                    <div className="text-sm text-gray-600">{home.devices} devices • Score: {home.score}</div>
                  </div>
                  <Badge className={home.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {home.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex space-x-2 mt-4">
          <Button className="flex-1">Manage Nest</Button>
          <Button variant="outline" className="flex-1">Add Home</Button>
        </div>
      </div>
    )
  },
  ai: {
    title: 'Ask Haven AI',
    content: (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Brain className="w-12 h-12 text-indigo-600 animate-pulse" />
          </div>
          <div className="text-lg font-semibold">Haven AI Assistant</div>
          <Badge className="bg-green-100 text-green-800 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Screen Time +5 pts
          </Badge>
        </div>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-2">Recent Insight</div>
            <div className="text-sm text-blue-700">
              "Your family's screen time has improved by 15% this week. Emma's bedtime routine is more consistent, contributing to better digital wellness."
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Quick Questions:</div>
            {[
              'How can I improve our family\'s digital safety?',
              'What should I do about unknown devices?',
              'How to set better screen time limits?',
              'Is our network secure enough?'
            ].map((question, index) => (
              <Button key={index} variant="outline" size="sm" className="w-full text-left justify-start">
                {question}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <Button className="flex-1">Ask Haven</Button>
          <Button variant="outline" className="flex-1">View History</Button>
        </div>
      </div>
    )
  },
  family: {
    title: 'Your Family',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Sarah', role: 'Parent', devices: 3, risk: 'Low', avatar: 'family' },
            { name: 'Mike', role: 'Parent', devices: 2, risk: 'Medium', avatar: 'family' },
            { name: 'Emma', role: 'Teen', devices: 4, risk: 'High', avatar: 'family' },
            { name: 'Jake', role: 'Child', devices: 2, risk: 'Low', avatar: 'family' }
          ].map((member, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.role} • {member.devices} devices</div>
                  </div>
                  <Badge className={`${member.risk === 'Low' ? 'bg-green-100 text-green-800' : member.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {member.risk} Risk
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
    title: 'Recent Alerts',
    content: (
      <div className="space-y-4">
        {[
          {
            title: 'Smart TV Update Available',
            description: 'Your Samsung TV has a security update waiting',
            severity: 'Medium',
            time: '2 hours ago',
            icon: 'tv'
          },
          {
            title: 'New App Installed',
            description: 'Emma installed Discord on her phone',
            severity: 'Low',
            time: '1 day ago',
            icon: 'smartphone'
          }
        ].map((alert, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{alert.title}</div>
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
                <Badge className={`${alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                  {alert.severity === 'Medium' ? 'Worth Checking' : 'Just FYI'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}

export function SimplifiedOrbitHomepage() {
  const [selectedModal, setSelectedModal] = useState<string | null>(null)
  const [showReward, setShowReward] = useState(false)
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())
  const [earnedPoints, setEarnedPoints] = useState(0)
  const { score, updateScore, isLoading, summary, autoRemediations, recommendations, performScan } = useCyberScore()
  const { mode, setMode, config, isLoading: modeLoading } = useHavenMode()

  // Debug: Add connection status monitoring in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        HavenAPI.getConnectionStatus()
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [])

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

  const closeModal = () => {
    setSelectedModal(null)
  }

  const handleQuickAction = async (iconId: string, actionText: string) => {
    const pointsEarned = Math.floor(Math.random() * 5) + 2 // 2-6 points
    
    setCompletedActions(prev => new Set([...prev, iconId]))
    setEarnedPoints(pointsEarned)
    setShowReward(true)
    
    // Update the central score
    try {
      const currentScore = score?.score || 85 // Default to 85 if no score exists
      const newScore = Math.min(100, currentScore + pointsEarned)
      
      await updateScore({ 
        score: newScore,
        lastUpdate: new Date().toISOString(),
        trend: 'up' // Mark as improving when points are earned
      })
      
      console.log(`Score updated: ${currentScore} + ${pointsEarned} = ${newScore}`)
    } catch (error) {
      console.error('Failed to update score:', error)
    }
    
    setTimeout(() => setShowReward(false), 3000)
  }

  // Use the actual score from the hook, fallback to 85 if loading
  const cyberScore = score?.score || 85
  
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

  // Show loading state while mode is being determined
  if (modeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HAVEN...</p>
        </div>
      </div>
    )
  }

  // Render mode-specific components
  if (mode === 'simple') {
    return <SimpleModeHomepage key={`simple-${mode}`} />
  }
  
  if (mode === 'silent') {
    return <SilentModeHomepage key={`silent-${mode}`} />
  }
  
  if (mode === 'family') {
    return <FamilyModeHomepage key={`family-${mode}`} />
  }

  // Pro mode and default - show the full orbit interface
  return (
    <div key={`orbit-${mode}`} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden relative">
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-random-float-1"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-green-100 rounded-full opacity-25 animate-random-float-2"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-purple-100 rounded-full opacity-30 animate-random-float-3"></div>
        <div className="absolute bottom-20 right-32 w-28 h-28 bg-orange-100 rounded-full opacity-20 animate-random-float-4"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-pink-100 rounded-full opacity-25 animate-random-float-5"></div>
      </div>
      
      {/* Reward Animation */}
      {showReward && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 animate-pulse">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-medium">Great job! +{earnedPoints} points</span>
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <HavenLogo size="lg" showTagline={true} />
          </div>
          <div className="flex items-center space-x-4">
            <ModeSelector 
              currentMode={mode} 
              onModeChange={setMode}
              className="hidden md:flex"
            />
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
            <Button variant="ghost" size="sm">Settings</Button>
          </div>
        </div>
        
        {/* Mobile Mode Switcher */}
        <div className="md:hidden mt-4 flex justify-center">
          <QuickModeSwitch currentMode={mode} onModeChange={setMode} />
        </div>

        {/* Protection Status Messages */}
        {(summary || autoRemediations?.length > 0) && (
          <div className="max-w-4xl mx-auto mt-4 space-y-2">
            {summary && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-2 text-blue-800">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">{summary}</span>
                </div>
              </div>
            )}
            
            {autoRemediations && autoRemediations.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2 text-green-800">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium mb-1">Automatic Protection Applied:</div>
                    <div className="space-y-1">
                      {autoRemediations.map((remediation, index) => (
                        <div key={index} className="text-xs">• {remediation}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Orbit Container */}
      <div className="relative flex items-center justify-center" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Central Cyber Risk Score */}
        <div 
          className="absolute z-20 cursor-pointer transform transition-all duration-500 hover:scale-110 group"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => openModal('household')}
        >
          <div className="relative flex flex-col items-center animate-gentle-float">
            <div className="relative">
              <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-xl border-4 border-gray-100 flex flex-col items-center justify-center group-hover:shadow-2xl group-hover:border-blue-200 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-blue-50">
                <div className={`text-3xl md:text-4xl font-bold ${getScoreColor(cyberScore)} transition-all duration-500 group-hover:scale-110`}>
                  {cyberScore}
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium transition-all duration-300 group-hover:text-blue-600">
                  Grade A-
                </div>
                <div className="flex items-center mt-1 transition-all duration-300 group-hover:scale-105">
                  <Star className="w-4 h-4 mr-1 text-green-600 animate-bounce" />
                  <span className="text-xs text-gray-500 group-hover:text-green-600">+5 Today</span>
                </div>
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
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${cyberScore * 2.83} 283`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
              </div>
              
              {/* Status indicator */}
              <div className={`absolute -top-2 -right-2 w-6 h-6 ${getScoreBgColor(cyberScore)} rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-bounce-gentle`}>
                <div className={`w-2 h-2 ${getScoreColor(cyberScore).replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="text-lg font-medium text-gray-800">Cyber Risk Score</div>
              <div className="text-sm text-gray-600">Click to see details</div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getScoreBgColor(cyberScore)} ${getScoreColor(cyberScore)} gap-2`}>
                  <Shield className="w-4 h-4" />
                  Good
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orbiting Icons */}
        <div className="hidden md:block">
          {orbitIcons.map((icon) => {
            const position = getOrbitPosition(icon.position, 220)
            const isCompleted = completedActions.has(icon.id)
            
            return (
              <div
                key={icon.id}
                className="absolute z-40 cursor-pointer transform transition-all duration-300 hover:scale-110"
                style={{
                  left: `calc(50% + ${position.x}px)`,
                  top: `calc(50% + ${position.y}px)`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto'
                }}
              >
                <div className="relative group">
                  <div 
                    className={`w-20 h-20 ${icon.bgColor} rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-500 hover:border-gray-200 hover:scale-110 animate-orbit-pulse group-hover:animate-wiggle ${isCompleted ? 'ring-2 ring-green-400' : ''} cursor-pointer`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Icon clicked:', icon.id, icon.label)
                      openModal(icon.id)
                    }}
                  >
                    <icon.icon 
                      className={`w-8 h-8 ${icon.color} transition-all duration-300 group-hover:scale-110 ${isCompleted ? 'text-green-600' : ''}`} 
                    />
                    {isCompleted && (
                      <div className="absolute -bottom-1 -right-1">
                        <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Tooltip with Hover Persistence */}
                  <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-500 z-[70] pointer-events-auto">
                    <div className="bg-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium text-gray-700 border border-gray-200 max-w-48 text-center backdrop-blur-sm bg-white/95 hover:shadow-2xl transition-all duration-300">
                      <div className="font-semibold text-gray-800 mb-1">{icon.label}</div>
                      <div className="text-xs text-gray-600 mb-2">
                        {icon.insight}
                      </div>
                      <div className="w-full h-px bg-gray-200 mb-2"></div>
                      <div className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors duration-200"
                           onClick={(e) => {
                             e.preventDefault()
                             e.stopPropagation()
                             openModal(icon.id)
                           }}>
                        Click to explore →
                      </div>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
                  </div>

                  {/* Quick Action Button with Better Hover */}
                  <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-500 delay-200 pointer-events-auto z-[80]">
                    <Button 
                      size="sm" 
                      variant={icon.actionType === 'primary' ? 'default' : icon.actionType === 'warning' ? 'destructive' : icon.actionType === 'success' ? 'default' : 'outline'}
                      className={`text-xs px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${icon.actionType === 'success' ? 'bg-green-600 hover:bg-green-700' : ''} ${isCompleted ? 'bg-green-600 text-white' : ''} backdrop-blur-sm relative`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleQuickAction(icon.id, icon.actionText)
                      }}
                      disabled={isCompleted}
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
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile Icons */}
        <div className="block md:hidden">
          {orbitIcons.slice(0, 6).map((icon) => {
            const position = getOrbitPosition(icon.position, 160)
            const isCompleted = completedActions.has(icon.id)
            
            return (
              <div
                key={icon.id}
                className="absolute z-40 cursor-pointer transform transition-all duration-300 hover:scale-110"
                style={{
                  left: `calc(50% + ${position.x}px)`,
                  top: `calc(50% + ${position.y}px)`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto'
                }}
              >
                <div className="relative group">
                  <div 
                    className={`w-16 h-16 ${icon.bgColor} rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-gray-200 ${isCompleted ? 'ring-2 ring-green-400' : ''} cursor-pointer`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Mobile icon clicked:', icon.id, icon.label)
                      openModal(icon.id)
                    }}
                  >
                    <icon.icon 
                      className={`w-6 h-6 ${icon.color} ${isCompleted ? 'text-green-600' : ''}`} 
                    />
                    {isCompleted && (
                      <div className="absolute -bottom-1 -right-1">
                        <CheckCircle className="w-4 h-4 text-green-500 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Mobile Tooltip with Hover Persistence */}
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-500 z-[70] pointer-events-auto">
                    <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium text-gray-700 border border-gray-200 max-w-32 text-center backdrop-blur-sm bg-white/95 hover:shadow-xl transition-all duration-300 cursor-pointer"
                         onClick={(e) => {
                           e.preventDefault()
                           e.stopPropagation()
                           openModal(icon.id)
                         }}>
                      <div className="font-semibold text-gray-800 text-xs mb-1">{icon.label}</div>
                      <div className="text-xs text-gray-600 truncate">
                        {icon.insight}
                      </div>
                      <div className="text-xs text-blue-600 font-medium mt-1">
                        Tap to explore
                      </div>
                    </div>
                    {/* Mobile tooltip arrow */}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Enhanced Orbit Ring */}
        <div 
          className="absolute pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="border-2 border-dashed border-blue-200 rounded-full opacity-30 w-[480px] h-[480px] md:w-[480px] md:h-[480px] sm:w-[360px] sm:h-[360px] animate-spin" style={{ animationDuration: '60s' }}></div>
          <div className="absolute inset-4 border border-blue-100 rounded-full opacity-20"></div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 animate-fade-in-up">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 px-6 py-3 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-4">
            <Button 
              size="sm" 
              variant="ghost" 
              className="rounded-full hover:bg-blue-100 transition-all duration-300 hover:scale-110 group"
              onClick={async () => {
                try {
                  await performScan()
                } catch (error) {
                  console.error('Quick scan failed:', error)
                }
              }}
            >
              <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Protection Check
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="rounded-full hover:bg-green-100 transition-all duration-300 hover:scale-110 group"
              onClick={() => openModal('ai')}
            >
              <Brain className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Ask Haven
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="rounded-full hover:bg-purple-100 transition-all duration-300 hover:scale-110 group"
            >
              <HelpCircle className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Settings
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