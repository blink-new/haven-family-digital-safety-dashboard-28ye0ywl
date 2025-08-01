import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Users, Wifi, Play, Laptop, Bell, Brain, Shield, CheckCircle, Star, Zap, Network, HelpCircle, Loader2 } from 'lucide-react'
import { useCyberScore } from '../../hooks/useCyberScore'
import { useDualScores } from '../../hooks/useDualScores'
import { useHavenMode } from '../../hooks/useHavenMode'

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
  emoji: string
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
    iconName: 'family',
    emoji: '👨‍👩‍👧‍👦'
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
    iconName: 'wifi',
    emoji: '📶'
  },
  { 
    id: 'services', 
    icon: Play, 
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
    icon: Laptop, 
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
    icon: Network, 
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
    icon: Bell, 
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
    icon: Brain, 
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

export function SplitViewLayout() {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())
  
  const { score, isLoading: scoreLoading, performScan, isScanning } = useCyberScore()
  const { scores: dualScores, isLoading: scoresLoading } = useDualScores()
  const { mode, isLoading: modeLoading } = useHavenMode()

  const getOrbitPosition = (position: number, radius: number = 180) => {
    const angle = (position * 51.43) - 90
    const radian = (angle * Math.PI) / 180
    const x = Math.cos(radian) * radius
    const y = Math.sin(radian) * radius
    return { x, y }
  }

  const handleQuickAction = async (iconId: string, actionText: string) => {
    setCompletedActions(prev => new Set([...prev, iconId]))
    
    try {
      await performScan()
    } catch (error) {
      console.error('Failed to perform security scan:', error)
    }
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

  if (modeLoading || scoreLoading || scoresLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">HAVEN</h1>
          <p className="text-gray-600">Loading split view...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">HAVEN</h1>
              <p className="text-sm text-gray-600">Split View Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
            <Button variant="ghost" size="sm">Settings</Button>
          </div>
        </div>
      </header>

      {/* Split View Container */}
      <div className="flex h-full max-w-6xl mx-auto px-6">
        {/* Left Panel: Orbit View */}
        <div className="w-1/2 relative flex items-center justify-center pr-6" style={{ height: 'calc(100vh - 120px)' }}>
          {/* Central Score */}
          <div 
            className="absolute z-20 cursor-pointer transform transition-all duration-500 hover:scale-110"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => setSelectedIcon('household')}
          >
            <div className="relative flex flex-col items-center animate-gentle-float">
              <div className="relative w-32 h-32 bg-white rounded-full shadow-xl border-4 border-gray-100 flex flex-col items-center justify-center">
                <div className={`text-3xl font-bold ${getScoreColor(cyberScore)}`}>
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

          {/* Orbit Icons */}
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
                  <div 
                    className={`w-16 h-16 ${icon.bgColor} rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 transition-all duration-300 ${isCompleted ? 'ring-2 ring-green-400' : ''}`}
                    onClick={() => setSelectedIcon(icon.id)}
                  >
                    <span className="text-2xl">{icon.emoji}</span>
                    {isCompleted && (
                      <div className="absolute -bottom-1 -right-1">
                        <CheckCircle className="w-4 h-4 text-green-500 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  {/* Label */}
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
        <div className="w-1/2 pl-6 overflow-y-auto bg-white/50 rounded-l-3xl" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="p-6 space-y-6">
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

            {/* Selected Icon Details */}
            {selectedIcon && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">
                      {orbitIcons.find(icon => icon.id === selectedIcon)?.emoji}
                    </span>
                    {orbitIcons.find(icon => icon.id === selectedIcon)?.label} Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm mb-2">Current Status</div>
                      <div className="text-sm text-gray-600">
                        {orbitIcons.find(icon => icon.id === selectedIcon)?.insight}
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        const icon = orbitIcons.find(i => i.id === selectedIcon)
                        if (icon) {
                          handleQuickAction(icon.id, icon.actionText)
                        }
                      }}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {orbitIcons.find(icon => icon.id === selectedIcon)?.actionText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={async () => {
                      try {
                        await performScan()
                      } catch (error) {
                        console.error('Scan failed:', error)
                      }
                    }}
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <span className="mr-2">🔍</span>
                    )}
                    {isScanning ? 'Scanning...' : 'Quick Scan'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <span className="mr-2">💬</span>
                    Ask Haven
                  </Button>
                  <Button variant="outline" size="sm">
                    <span className="mr-2">⚙️</span>
                    Settings
                  </Button>
                  <Button variant="outline" size="sm">
                    <span className="mr-2">📊</span>
                    Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}