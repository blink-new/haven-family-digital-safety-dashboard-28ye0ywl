import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { SpinningHouseLogo } from '../ui/SpinningHouseLogo'
import { X, Users, Wifi, Monitor, Smartphone, Brain, Bell, Settings, Home } from 'lucide-react'

interface HotspotData {
  id: string
  title: string
  icon: React.ReactNode
  score: number
  status: 'good' | 'warning' | 'risk'
  insights: string[]
  suggestion: string
  position: { x: number; y: number }
}

const FuturisticHousehold: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const houseRef = useRef<HTMLDivElement>(null)

  // Auto-rotation when not interacting
  useEffect(() => {
    if (!isDragging && !selectedHotspot) {
      const interval = setInterval(() => {
        setRotation(prev => prev + 0.5)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isDragging, selectedHotspot])

  const hotspots: HotspotData[] = [
    {
      id: 'family-room',
      title: 'Family Room',
      icon: <Users className="w-5 h-5" />,
      score: 85,
      status: 'good',
      insights: [
        '4 family members actively protected',
        'All devices have secure profiles'
      ],
      suggestion: 'Consider setting up bedtime mode for kids\' devices',
      position: { x: 45, y: 60 }
    },
    {
      id: 'wifi',
      title: 'Network Security',
      icon: <Wifi className="w-5 h-5" />,
      score: 72,
      status: 'warning',
      insights: [
        'Home network is secure',
        '2 guest devices detected'
      ],
      suggestion: 'Update router firmware for enhanced security',
      position: { x: 50, y: 25 }
    },
    {
      id: 'study',
      title: 'Digital Services',
      icon: <Monitor className="w-5 h-5" />,
      score: 90,
      status: 'good',
      insights: [
        '12 services monitored',
        'All accounts have strong passwords'
      ],
      suggestion: 'Enable 2FA on remaining 2 accounts',
      position: { x: 25, y: 45 }
    },
    {
      id: 'bedroom',
      title: 'Screen Time Health',
      icon: <Smartphone className="w-5 h-5" />,
      score: 68,
      status: 'warning',
      insights: [
        'Average screen time: 4.2 hours/day',
        'Late night usage detected'
      ],
      suggestion: 'Set up digital wellness schedules',
      position: { x: 75, y: 50 }
    }
  ]

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x
      setRotation(prev => prev + deltaX * 0.5)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500 bg-green-100'
      case 'warning': return 'text-amber-500 bg-amber-100'
      case 'risk': return 'text-red-500 bg-red-100'
      default: return 'text-gray-500 bg-gray-100'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-cyan-400/10 animate-pulse" />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HAVEN
            </h1>
            <p className="text-sm text-gray-600 mt-1">Your Digital Household Guardian</p>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
              <Home className="w-4 h-4 mr-2" />
              Household
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </nav>
        </div>

        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
          <Brain className="w-4 h-4 mr-2" />
          Ask Haven
        </Button>
      </header>

      {/* Main 3D House Container */}
      <div className="flex-1 flex items-center justify-center relative px-4">
        <div className="relative w-96 h-96 md:w-[500px] md:h-[500px]">
          {/* 3D House with uploaded logo */}
          <div
            ref={houseRef}
            className="relative w-full h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Spinning House Logo */}
            <SpinningHouseLogo 
              size="xl" 
              interactive={true}
              onClick={() => {
                // Optional: Add click handler for the house itself
              }}
            />

            {/* Interactive Hotspots */}
            {hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${getStatusColor(hotspot.status)} ${
                  selectedHotspot?.id === hotspot.id ? 'scale-125 ring-4 ring-blue-300' : ''
                }`}
                style={{
                  left: `${hotspot.position.x}%`,
                  top: `${hotspot.position.y}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedHotspot(hotspot)
                }}
              >
                <div className="flex items-center justify-center w-full h-full">
                  {hotspot.icon}
                </div>
                
                {/* Pulsing ring animation */}
                <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-30" />
              </button>
            ))}
          </div>

          {/* Household Status Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-blue-100/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Household Protected</span>
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="absolute bottom-8 left-8 space-y-3">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm font-medium text-green-700">4 Members Protected</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-sm font-medium text-blue-700">12 Devices Secured</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cyber Score Display */}
        <div className="absolute bottom-8 right-8">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">82</div>
                <div className="text-xs text-gray-600">Cyber Score</div>
                <Badge variant="outline" className="mt-1 text-green-600 border-green-200">
                  Good
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sliding Info Panel */}
      {selectedHotspot && (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white/95 backdrop-blur-lg shadow-2xl border-l border-blue-100/50 z-50 transform transition-transform duration-300 ease-out">
          <div className="p-6 h-full overflow-y-auto">
            {/* Panel Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getStatusColor(selectedHotspot.status)}`}>
                  {selectedHotspot.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedHotspot.title}</h3>
                  <Badge variant="outline" className={getScoreColor(selectedHotspot.score)}>
                    {selectedHotspot.score}/100
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedHotspot(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Insights */}
            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-900">Current Status</h4>
              {selectedHotspot.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>

            {/* Suggestion */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4">
                <h4 className="font-medium text-amber-800 mb-2">💡 Suggested Action</h4>
                <p className="text-sm text-amber-700 mb-3">{selectedHotspot.suggestion}</p>
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                  Take Action
                </Button>
              </CardContent>
            </Card>

            {/* Return Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setSelectedHotspot(null)}
                className="w-full"
              >
                ← Return to Household View
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-blue-100/50 p-4">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm">
            <Home className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Brain className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FuturisticHousehold