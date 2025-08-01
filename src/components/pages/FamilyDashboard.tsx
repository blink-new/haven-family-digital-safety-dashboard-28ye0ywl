import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Bell, Shield, Users, Wifi, Smartphone, Tv, Lock, Eye, EyeOff } from 'lucide-react'
import { ModernIcon } from '../ui/ModernIcon'

export function FamilyDashboard({ guardian }) {
  const [safetyScore, setSafetyScore] = useState(78)
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'suggestion',
      title: 'Smart TV Update Available',
      message: "Your smart TV hasn't been updated in a while. Want me to do it?",
      action: 'Update Now',
      icon: 'tv',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'New App Installed',
      message: "Emma installed TikTok. Should I set up some time limits?",
      action: 'Set Limits',
      icon: 'smartphone',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'success',
      title: 'Password Updated',
      message: "Great job! Your Netflix password is now much stronger.",
      icon: 'checkCircle',
      time: '2 days ago'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Unusual Login',
      message: "Someone tried to log into your email from a new location. This looks risky — should I fix it for you?",
      action: 'Secure Account',
      icon: 'warning',
      time: '3 days ago'
    }
  ])

  const [familyMembers] = useState([
    { name: 'Mom', avatar: 'family', devices: 3, status: 'safe' },
    { name: 'Dad', avatar: 'family', devices: 2, status: 'safe' },
    { name: 'Emma', avatar: 'family', devices: 2, status: 'needs-attention' },
    { name: 'Max', avatar: 'family', devices: 1, status: 'safe' }
  ])

  const [recentImprovements] = useState([
    { action: 'Enabled two-factor auth on Gmail', points: '+15', time: 'Yesterday' },
    { action: 'Updated router security settings', points: '+10', time: '2 days ago' },
    { action: 'Set up parental controls on iPad', points: '+12', time: '1 week ago' }
  ])

  const getGuardianMessage = () => {
    const messages = [
      "Everything looks good! Your family's digital safety is on track.",
      "I've been keeping an eye on things. A few small updates would help!",
      "Your safety score is looking great! Want to see what I've been up to?",
      "I found a couple of things that could use attention. Nothing urgent though!"
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const handleAlertAction = (alertId, action) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, resolved: true, resolvedAction: action }
        : alert
    ))
    // Simulate score improvement
    setSafetyScore(prev => Math.min(100, prev + 5))
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Work'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Guardian Welcome Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">{guardian.emoji}</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 mb-2">{guardian.name} says:</div>
              <div className="text-gray-700">{getGuardianMessage()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Household Safety Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(safetyScore)}`}>
                  {safetyScore}
                </div>
                <div className="text-sm text-gray-500">out of 100</div>
                <Badge variant="outline" className="mt-2">
                  {getScoreLabel(safetyScore)}
                </Badge>
              </div>
              <div className="flex-1">
                <Progress value={safetyScore} className="h-3 mb-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>12 devices protected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>8 apps secured</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>4 family members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>2 items need attention</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>Family Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {familyMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ModernIcon name={member.avatar} size="lg" className="text-blue-600" />
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">
                        {member.devices} devices
                      </div>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    member.status === 'safe' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <span>Recent Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${
                  alert.resolved ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <ModernIcon name={alert.icon} size="lg" className="text-gray-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{alert.title}</div>
                      <div className="text-gray-600 text-sm mt-1">{alert.message}</div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">{alert.time}</span>
                        {alert.action && !alert.resolved && (
                          <Button
                            size="sm"
                            onClick={() => handleAlertAction(alert.id, alert.action)}
                            className="text-xs"
                          >
                            {alert.action}
                          </Button>
                        )}
                        {alert.resolved && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <ModernIcon name="checkCircle" size="sm" />
                            Done
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Recent Improvements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentImprovements.map((improvement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{improvement.action}</div>
                    <div className="text-xs text-gray-500">{improvement.time}</div>
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    {improvement.points}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Improvements
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Wifi className="h-6 w-6" />
              <span className="text-sm">Check Network</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Smartphone className="h-6 w-6" />
              <span className="text-sm">Scan Devices</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Lock className="h-6 w-6" />
              <span className="text-sm">Update Passwords</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Eye className="h-6 w-6" />
              <span className="text-sm">Privacy Check</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}