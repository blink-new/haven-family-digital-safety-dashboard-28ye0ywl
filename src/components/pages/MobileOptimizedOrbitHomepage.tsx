import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { HavenLogo } from '../ui/HavenLogo'
import { useAuth } from '../../hooks/useAuth'

export function MobileOptimizedOrbitHomepage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const [cyberScore] = useState(85)
  const [userScore] = useState(50)

  if (isLoading) {
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

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">HAVEN</h1>
          <p className="text-gray-600 mb-6">Family Digital Safety Dashboard</p>
          <Button 
            onClick={() => window.location.href = 'https://blink.new/auth'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    )
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

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🛡️'
    if (score >= 80) return '✅'
    if (score >= 70) return '⚠️'
    return '🚨'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="relative z-10 p-4 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <HavenLogo size="md" />
          <Button variant="ghost" size="sm">
            <span className="text-sm">Menu</span>
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
      </header>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Welcome Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">👋</span>
              Welcome back, {user.displayName || user.email}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your family's digital safety is looking good. Here's what's happening:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600">Family Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Devices Protected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-600">Apps Monitored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-gray-600">Items to Review</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">📱</div>
              <div className="font-medium">Check Devices</div>
              <div className="text-sm text-gray-600">Review security status</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
              <div className="font-medium">Family Status</div>
              <div className="text-sm text-gray-600">See who's online</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">🔔</div>
              <div className="font-medium">Alerts</div>
              <div className="text-sm text-gray-600">2 items need attention</div>
              <Badge className="mt-1 bg-orange-100 text-orange-800">2</Badge>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">🤖</div>
              <div className="font-medium">Ask Haven</div>
              <div className="text-sm text-gray-600">Get AI assistance</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Smart TV updated successfully', time: '2 hours ago', type: 'success', emoji: '📺' },
                { title: 'Emma installed Discord', time: '1 day ago', type: 'info', emoji: '📱' },
                { title: 'Network scan completed', time: '2 days ago', type: 'success', emoji: '📶' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <span className="text-2xl">{activity.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.title}</div>
                    <div className="text-xs text-gray-600">{activity.time}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2 px-4">
          <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2 px-3 rounded-xl">
            <span className="text-2xl">🏠</span>
            <span className="text-xs">Home</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2 px-3 rounded-xl">
            <span className="text-2xl">🔔</span>
            <span className="text-xs">Alerts</span>
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              2
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2 px-3 rounded-xl">
            <span className="text-2xl">🔍</span>
            <span className="text-xs">Scan</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2 px-3 rounded-xl">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <span className="text-xs">Family</span>
          </Button>
        </div>
      </div>
    </div>
  )
}