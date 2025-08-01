import React, { useState, useEffect, useRef } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ModernIcon, ModernIconContainer, SecurityIcon, FamilyIcon, AIIcon, NetworkIcon, AlertIcon, DeviceIcon } from '../ui/ModernIcon'
import { HavenLogo, HavenBrand } from '../ui/HavenLogo'
import { HavenAPI } from '../../services/api'
import { useCyberScore } from '../../hooks/useCyberScore'
import { useHavenMode } from '../../hooks/useHavenMode'
import { useDualScores } from '../../hooks/useDualScores'
import { useDeviceType } from '../../hooks/use-mobile'
import { cn } from '../../lib/utils'

interface OrbitIcon {
  id: string
  iconType: string
  label: string
  position: number
  color: string
  bgColor: string
  insight: string
  actionText: string
  actionType: 'primary' | 'secondary' | 'success' | 'warning'
  iconName: string
  emoji: string
}

const orbitIcons: OrbitIcon[] = [
  { 
    id: 'family', 
    iconType: 'users', 
    label: 'Family', 
    position: 0, 
    color: 'text-blue-600', 
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    insight: 'Emma: 3h screen time today',
    actionText: 'Review limits',
    actionType: 'secondary',
    iconName: 'family',
    emoji: '👨‍👩‍👧‍👦'
  },
  { 
    id: 'wifi', 
    iconType: 'wifi', 
    label: 'Wi-Fi', 
    position: 1, 
    color: 'text-green-600', 
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
    insight: '2 unknown devices detected',
    actionText: 'Secure network',
    actionType: 'warning',
    iconName: 'wifi',
    emoji: '📶'
  },
  { 
    id: 'services', 
    iconType: 'smartphone', 
    label: 'Apps', 
    position: 2, 
    color: 'text-purple-600', 
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    insight: '1 vulnerable account',
    actionText: 'Review alert',
    actionType: 'warning',
    iconName: 'smartphone',
    emoji: '📱'
  },
  { 
    id: 'technology', 
    iconType: 'laptop', 
    label: 'Gadgets', 
    position: 3, 
    color: 'text-cyan-600', 
    bgColor: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
    insight: 'All devices updated',
    actionText: 'Run check',
    actionType: 'success',
    iconName: 'laptop',
    emoji: '💻'
  },
  { 
    id: 'nest', 
    iconType: 'network', 
    label: 'Safety Nest', 
    position: 4, 
    color: 'text-pink-600', 
    bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
    insight: '3 connected homes',
    actionText: 'Manage nest',
    actionType: 'primary',
    iconName: 'home',
    emoji: '🏠'
  },
  { 
    id: 'alerts', 
    iconType: 'bell-ring', 
    label: 'Alerts', 
    position: 5, 
    color: 'text-orange-600', 
    bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
    insight: 'Late-night activity detected',
    actionText: 'Review activity',
    actionType: 'primary',
    iconName: 'bell',
    emoji: '🔔'
  },
  { 
    id: 'ai', 
    iconType: 'brain', 
    label: 'Ask Haven', 
    position: 6, 
    color: 'text-blue-600', 
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    insight: 'Screen time improved +5 pts',
    actionText: 'Ask Haven',
    actionType: 'success',
    iconName: 'robot',
    emoji: '🤖'
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
            <ModernIcon type="check-circle-2" size="sm" color="success" />
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
          <div className="text-4xl mb-2">📶</div>
          <div className="text-lg font-semibold">Home Network Status</div>
          <Badge className="bg-yellow-100 text-yellow-800">2 Unknown Devices</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: 'Main Router', status: 'Secure', ip: '192.168.1.1', type: 'Router', emoji: '🌐' },
            { name: 'Sarah\'s iPhone', status: 'Secure', ip: '192.168.1.15', type: 'Phone', emoji: '📱' },
            { name: 'Unknown Device', status: 'Warning', ip: '192.168.1.23', type: 'Unknown', emoji: '❓' },
            { name: 'Smart TV', status: 'Secure', ip: '192.168.1.45', type: 'TV', emoji: '📺' }
          ].map((device, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{device.emoji}</div>
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
          <div className="text-4xl mb-2">📱</div>
          <div className="text-lg font-semibold">Connected Services</div>
          <Badge className="bg-yellow-100 text-yellow-800">1 Vulnerable Account</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: 'Netflix', status: 'Secure', users: 4, lastUsed: '2 hours ago', emoji: '🎬' },
            { name: 'Gmail', status: 'Warning', users: 2, lastUsed: '5 minutes ago', emoji: '📧' },
            { name: 'PlayStation', status: 'Secure', users: 1, lastUsed: '1 day ago', emoji: '🎮' },
            { name: 'Ring Doorbell', status: 'Secure', users: 2, lastUsed: '30 minutes ago', emoji: '🔔' }
          ].map((service, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{service.emoji}</div>
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
          <div className="text-4xl mb-2">💻</div>
          <div className="text-lg font-semibold">Device Security</div>
          <Badge className="bg-green-100 text-green-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            All Updated
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: 'MacBook Pro', status: 'Updated', owner: 'Sarah', lastUpdate: 'Yesterday', emoji: '💻' },
            { name: 'iPad', status: 'Updated', owner: 'Emma', lastUpdate: '2 days ago', emoji: '📱' },
            { name: 'Smart TV', status: 'Updated', owner: 'Family', lastUpdate: '1 week ago', emoji: '📺' },
            { name: 'Alexa Echo', status: 'Updated', owner: 'Family', lastUpdate: '3 days ago', emoji: '🔊' }
          ].map((device, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{device.emoji}</div>
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
          <div className="text-4xl mb-2">🏠</div>
          <div className="text-lg font-semibold">Connected Homes</div>
          <Badge className="bg-blue-100 text-blue-800">3 Homes Connected</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: 'Main House', status: 'Active', devices: 12, score: 85, emoji: '🏠' },
            { name: 'Grandma\'s House', status: 'Active', devices: 6, score: 78, emoji: '🏡' },
            { name: 'Vacation Home', status: 'Inactive', devices: 4, score: 92, emoji: '🏖️' }
          ].map((home, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{home.emoji}</div>
                    <div>
                      <div className="font-medium">{home.name}</div>
                      <div className="text-sm text-gray-600">{home.devices} devices • Score: {home.score}</div>
                    </div>
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
          <div className="text-4xl mb-2 animate-pulse">🤖</div>
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
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: 'Sarah', role: 'Parent', devices: 3, risk: 'Low', emoji: '👩' },
            { name: 'Mike', role: 'Parent', devices: 2, risk: 'Medium', emoji: '👨' },
            { name: 'Emma', role: 'Teen', devices: 4, risk: 'High', emoji: '👧' },
            { name: 'Jake', role: 'Child', devices: 2, risk: 'Low', emoji: '👦' }
          ].map((member, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{member.emoji}</div>
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
            emoji: '📺'
          },
          {
            title: 'New App Installed',
            description: 'Emma installed Discord on her phone',
            severity: 'Low',
            time: '1 day ago',
            emoji: '📱'
          }
        ].map((alert, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{alert.emoji}</div>
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

export function MobileOptimizedOrbitHomepage() {
  const [selectedModal, setSelectedModal] = useState<string | null>(null)
  const [showReward, setShowReward] = useState(false)
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [currentView, setCurrentView] = useState(0) // For swipe navigation
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [hasError, setHasError] = useState(false)
  
  const { score, updateScore, isLoading, summary, autoRemediations, recommendations, performScan } = useCyberScore()
  const { mode, setMode, config, isLoading: modeLoading } = useHavenMode()
  const { scores: dualScores, isLoading: scoresLoading } = useDualScores()
  const { isMobile, isTablet, isDesktop, deviceType } = useDeviceType()
  const containerRef = useRef<HTMLDivElement>(null)

  // Swipe gesture handling
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentView < 2) {
      setCurrentView(currentView + 1)
    }
    if (isRightSwipe && currentView > 0) {
      setCurrentView(currentView - 1)
    }
  }

  const getOrbitPosition = (position: number, radius: number = 200) => {
    const angle = (position * 51.43) - 90
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
    const pointsEarned = Math.floor(Math.random() * 5) + 2
    
    setCompletedActions(prev => new Set([...prev, iconId]))
    setEarnedPoints(pointsEarned)
    setShowReward(true)
    
    try {
      const currentScore = score?.score || 85
      const newScore = Math.min(100, currentScore + pointsEarned)
      
      await updateScore({ 
        score: newScore,
        lastUpdate: new Date().toISOString(),
        trend: 'up'
      })
    } catch (error) {
      console.error('Failed to update score:', error)
      setHasError(true)
    }
    
    setTimeout(() => setShowReward(false), 3000)
  }

  const cyberScore = score?.score || 85
  const userScore = dualScores?.userScore.score || 50
  
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

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🛡️'
    if (score >= 80) return '✅'
    if (score >= 70) return '⚠️'
    return '🚨'
  }

  if (modeLoading || isLoading || scoresLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">HAVEN</h1>
          <p className="text-gray-600">Loading your family's digital safety dashboard...</p>
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
              <ModernIcon type="star" size="md" color="default" variant="filled" />
              <span className="font-medium">Great job! +{earnedPoints} points</span>
              <ModernIcon type="check-circle-2" size="md" color="default" />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header with Prominent Scores */}
      {isMobile && (
        <header className="relative z-10 p-4 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <HavenLogo size="md" />
            <Button variant="ghost" size="sm">
              <ModernIcon type="menu" size="md" color="default" animated />
            </Button>
          </div>
          
          {/* Prominent Score Display */}
          <div className="flex gap-3 mb-4">
            <div className={`flex-1 ${getScoreBgColor(cyberScore)} rounded-2xl p-4 text-center`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl">{getScoreEmoji(cyberScore)}</span>
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

          {/* Swipe Indicator */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  currentView === index ? "bg-blue-600" : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </header>
      )}

      {/* Tablet and Desktop Header */}
      {(isTablet || isDesktop) && (
        <header className="relative z-10 p-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-3">
              <HavenLogo size="lg" showTagline={true} />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ModernIcon type="help-circle" size="sm" color="default" className="mr-2" />
                Help
              </Button>
              <Button variant="ghost" size="sm">Settings</Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* Mobile Swipeable Views */}
        {isMobile && (
          <div
            ref={containerRef}
            className="h-full overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              className="flex h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentView * 100}%)` }}
            >
              {/* View 1: Orbit View */}
              <div className="w-full flex-shrink-0 relative flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
                {/* Central Score (Mobile) */}
                <div 
                  className="absolute z-20 cursor-pointer transform transition-all duration-500 hover:scale-105"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => openModal('household')}
                >
                  <div className="relative flex flex-col items-center">
                    <div className="relative w-24 h-24 bg-white rounded-full shadow-xl border-4 border-gray-100 flex flex-col items-center justify-center">
                      <div className="text-xl font-bold text-blue-600">
                        {cyberScore}
                      </div>
                      <div className="text-xs text-gray-600">Safe</div>
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-sm font-medium text-gray-800">Family Status</div>
                      <div className="text-xs text-gray-600">Tap for details</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Orbit Icons */}
                {orbitIcons.slice(0, 6).map((icon) => {
                  const position = getOrbitPosition(icon.position, 120)
                  const isCompleted = completedActions.has(icon.id)
                  
                  return (
                    <div
                      key={icon.id}
                      className="absolute z-30 cursor-pointer transform transition-all duration-300 active:scale-95"
                      style={{
                        left: `calc(50% + ${position.x}px)`,
                        top: `calc(50% + ${position.y}px)`,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'auto'
                      }}
                    >
                      <div className="relative group">
                        <ModernIconContainer
                          size="lg"
                          variant="circle"
                          background="gradient"
                          shadow={true}
                          animated={true}
                          className={`${isCompleted ? 'ring-2 ring-green-400' : ''} cursor-pointer`}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            openModal(icon.id)
                          }}
                        >
                          <ModernIcon 
                            type={icon.iconType as any} 
                            size="lg" 
                            color="primary" 
                            animated 
                          />
                          {isCompleted && (
                            <div className="absolute -bottom-1 -right-1">
                              <ModernIcon type="check-circle-2" size="sm" color="success" className="bg-white rounded-full" />
                            </div>
                          )}
                        </ModernIconContainer>
                        
                        {/* Mobile Label */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="text-xs font-medium text-gray-700 text-center">
                            {icon.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* View 2: Carousel View */}
              <div className="w-full flex-shrink-0 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {orbitIcons.map((icon) => (
                    <Card key={icon.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openModal(icon.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <ModernIconContainer size="lg" variant="circle" background="gradient" shadow={true}>
                            <ModernIcon type={icon.iconType as any} size="lg" color="primary" />
                          </ModernIconContainer>
                          <div className="flex-1">
                            <div className="font-medium">{icon.label}</div>
                            <div className="text-sm text-gray-600">{icon.insight}</div>
                          </div>
                          <Button size="sm" variant="outline" onClick={(e) => {
                            e.stopPropagation()
                            handleQuickAction(icon.id, icon.actionText)
                          }}>
                            {icon.actionText}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* View 3: Family Overview */}
              <div className="w-full flex-shrink-0 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ModernIcon type="users" size="md" color="secondary" />
                        Family Members
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { name: 'Sarah', role: 'Parent', devices: 3, risk: 'Low', emoji: '👩' },
                          { name: 'Mike', role: 'Parent', devices: 2, risk: 'Medium', emoji: '👨' },
                          { name: 'Emma', role: 'Teen', devices: 4, risk: 'High', emoji: '👧' },
                          { name: 'Jake', role: 'Child', devices: 2, risk: 'Low', emoji: '👦' }
                        ].map((member, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{member.emoji}</span>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-gray-600">{member.role} • {member.devices} devices</div>
                              </div>
                            </div>
                            <Badge className={`${member.risk === 'Low' ? 'bg-green-100 text-green-800' : member.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {member.risk}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tablet and Desktop Split View */}
        {(isTablet || isDesktop) && (
          <div className="flex h-full">
            {/* Left Panel: Orbit View */}
            <div className="w-1/2 relative flex items-center justify-center" style={{ height: 'calc(100vh - 120px)' }}>
              {/* Central Score (Tablet) */}
              <div 
                className="absolute z-20 cursor-pointer transform transition-all duration-500 hover:scale-110"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => openModal('household')}
              >
                <div className="relative flex flex-col items-center">
                  <div className="relative w-32 h-32 bg-white rounded-full shadow-xl border-4 border-gray-100 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {cyberScore}
                    </div>
                    <div className="text-sm text-gray-600">Grade A-</div>
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-lg font-medium text-gray-800">Cyber Risk Score</div>
                    <div className="text-sm text-gray-600">Click for details</div>
                  </div>
                </div>
              </div>

              {/* Tablet Orbit Icons */}
              {orbitIcons.map((icon) => {
                const position = getOrbitPosition(icon.position, 180)
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
                      <ModernIconContainer
                        size="xl"
                        variant="circle"
                        background="gradient"
                        shadow={true}
                        animated={true}
                        className={`${isCompleted ? 'ring-2 ring-green-400' : ''} cursor-pointer`}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          openModal(icon.id)
                        }}
                      >
                        <ModernIcon 
                          type={icon.iconType as any} 
                          size="xl" 
                          color="primary" 
                          animated 
                        />
                        {isCompleted && (
                          <div className="absolute -bottom-1 -right-1">
                            <ModernIcon type="check-circle-2" size="sm" color="success" className="bg-white rounded-full" />
                          </div>
                        )}
                      </ModernIconContainer>
                      
                      {/* Tablet Label */}
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-700 text-center">
                          {icon.label}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Panel: Details */}
            <div className="w-1/2 p-6 overflow-y-auto bg-white/50">
              <div className="space-y-6">
                {/* Score Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{getScoreEmoji(cyberScore)}</div>
                      <div className={`text-2xl font-bold ${getScoreColor(cyberScore)}`}>
                        {cyberScore}
                      </div>
                      <div className="text-sm text-gray-600">Cyber Score</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">👤</div>
                      <div className={`text-2xl font-bold ${getScoreColor(userScore)}`}>
                        {userScore}
                      </div>
                      <div className="text-sm text-gray-600">User Score</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">4</div>
                        <div className="text-sm text-gray-600">Family Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <div className="text-sm text-gray-600">Devices</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">8</div>
                        <div className="text-sm text-gray-600">Apps</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">2</div>
                        <div className="text-sm text-gray-600">Alerts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { title: 'Smart TV Update', time: '2h ago', type: 'success' },
                        { title: 'New App Installed', time: '1d ago', type: 'warning' },
                        { title: 'Screen Time Limit', time: '2d ago', type: 'info' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium text-sm">{activity.title}</div>
                            <div className="text-xs text-gray-600">{activity.time}</div>
                          </div>
                          <Badge variant="outline">{activity.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40">
          <div className="flex items-center justify-around py-2 px-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col gap-1 h-auto py-2 px-3 rounded-xl"
              onClick={() => openModal('alerts')}
            >
              <ModernIcon type="bell-ring" size="md" color="default" animated />
              <span className="text-xs">Alerts</span>
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                2
              </Badge>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col gap-1 h-auto py-2 px-3 rounded-xl"
              onClick={async () => {
                try {
                  await performScan()
                  setShowReward(true)
                  setTimeout(() => setShowReward(false), 3000)
                } catch (error) {
                  console.error('Scan failed:', error)
                }
              }}
            >
              <ModernIcon type="scan" size="md" color="primary" animated />
              <span className="text-xs">Check Score</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col gap-1 h-auto py-2 px-3 rounded-xl"
              onClick={() => openModal('ai')}
            >
              <ModernIcon type="brain" size="md" color="info" animated />
              <span className="text-xs">Ask Haven</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col gap-1 h-auto py-2 px-3 rounded-xl"
              onClick={() => openModal('family')}
            >
              <ModernIcon type="users" size="md" color="secondary" animated />
              <span className="text-xs">Family</span>
            </Button>
          </div>
        </div>
      )}

      {/* Swipe Navigation Arrows (Mobile) */}
      {isMobile && (
        <>
          {currentView > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/80 backdrop-blur-sm rounded-full w-10 h-10 p-0"
              onClick={() => setCurrentView(currentView - 1)}
            >
              <ModernIcon type="chevron-left" size="md" color="default" />
            </Button>
          )}
          
          {currentView < 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/80 backdrop-blur-sm rounded-full w-10 h-10 p-0"
              onClick={() => setCurrentView(currentView + 1)}
            >
              <ModernIcon type="chevron-right" size="md" color="default" />
            </Button>
          )}
        </>
      )}

      {/* Mobile Sheet (replaces modal) */}
      <Sheet open={!!selectedModal} onOpenChange={closeModal}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              {selectedModal && modalContent[selectedModal as keyof typeof modalContent]?.title}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 overflow-y-auto h-full pb-20">
            {selectedModal && modalContent[selectedModal as keyof typeof modalContent]?.content}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}