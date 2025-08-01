import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ModernIcon } from '../ui/ModernIcon'

interface FamilyMember {
  id: string
  name: string
  role: string
  avatar: string
  devices: number
  screenTime: number
  riskLevel: 'Low' | 'Medium' | 'High'
  lastActivity: string
  topApps: string[]
  safetyScore: number
}

const familyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'Sarah',
    role: 'Mom',
    avatar: 'family',
    devices: 3,
    screenTime: 4.2,
    riskLevel: 'Low',
    lastActivity: '2 minutes ago',
    topApps: ['Banking', 'Email', 'News'],
    safetyScore: 92
  },
  {
    id: '2',
    name: 'Mike',
    role: 'Dad',
    avatar: 'family',
    devices: 2,
    screenTime: 3.8,
    riskLevel: 'Low',
    lastActivity: '15 minutes ago',
    topApps: ['Work Apps', 'Sports', 'Music'],
    safetyScore: 88
  },
  {
    id: '3',
    name: 'Emma',
    role: 'Teenager (16)',
    avatar: 'family',
    devices: 2,
    screenTime: 6.5,
    riskLevel: 'Medium',
    lastActivity: 'Active now',
    topApps: ['TikTok', 'Instagram', 'Snapchat'],
    safetyScore: 74
  },
  {
    id: '4',
    name: 'Jake',
    role: 'Kid (12)',
    avatar: 'family',
    devices: 1,
    screenTime: 3.2,
    riskLevel: 'Low',
    lastActivity: '1 hour ago',
    topApps: ['Games', 'YouTube Kids', 'Educational'],
    safetyScore: 85
  }
]

export function FamilyInsights() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [realTimeData, setRealTimeData] = useState(familyMembers)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => prev.map(member => ({
        ...member,
        screenTime: member.screenTime + (Math.random() - 0.5) * 0.1,
        safetyScore: Math.max(60, Math.min(100, member.safetyScore + (Math.random() - 0.5) * 2))
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Family Overview */}
      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Family's Digital Life</h2>
        <p className="text-gray-600 mb-4">
          See how everyone in your family is doing online, with real-time updates and personalized insights.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {realTimeData.reduce((sum, member) => sum + member.devices, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Devices</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(realTimeData.reduce((sum, member) => sum + member.safetyScore, 0) / realTimeData.length)}
            </div>
            <div className="text-sm text-gray-600">Family Safety Score</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {realTimeData.filter(member => member.lastActivity.includes('now') || member.lastActivity.includes('minute')).length}
            </div>
            <div className="text-sm text-gray-600">Active Now</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {realTimeData.filter(member => member.riskLevel === 'Medium' || member.riskLevel === 'High').length}
            </div>
            <div className="text-sm text-gray-600">Need Attention</div>
          </div>
        </div>
      </div>

      {/* Family Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {realTimeData.map((member, index) => (
          <Card 
            key={member.id} 
            className={`hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in-up ${
              selectedMember === member.id ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="animate-bounce-gentle" style={{ animationDelay: `${index * 0.2}s` }}>
                    <ModernIcon name={member.avatar} size="xl" className="text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(member.safetyScore)}`}>
                    {Math.round(member.safetyScore)}
                  </div>
                  <div className="text-xs text-gray-500">Safety Score</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Safety Score Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Safety Level</span>
                    <span className={getScoreColor(member.safetyScore)}>
                      {member.safetyScore >= 85 ? 'Excellent' : member.safetyScore >= 70 ? 'Good' : 'Needs Work'}
                    </span>
                  </div>
                  <Progress 
                    value={member.safetyScore} 
                    className="h-2"
                  />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-sm font-medium">{member.devices}</div>
                    <div className="text-xs text-gray-600">Devices</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-sm font-medium">{member.screenTime.toFixed(1)}h</div>
                    <div className="text-xs text-gray-600">Screen Time</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <Badge 
                      className={`text-xs ${
                        member.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                        member.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {member.riskLevel === 'Low' ? 'All Good' : 
                       member.riskLevel === 'Medium' ? 'Watch' : 'Alert'}
                    </Badge>
                  </div>
                </div>

                {/* Last Activity */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last seen:</span>
                  <span className={`font-medium ${
                    member.lastActivity.includes('now') ? 'text-green-600' :
                    member.lastActivity.includes('minute') ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {member.lastActivity}
                  </span>
                </div>

                {/* Expanded Details */}
                {selectedMember === member.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in-up">
                    <Tabs defaultValue="apps" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="apps">Top Apps</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="apps" className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 mb-2">Most Used Apps:</div>
                        {member.topApps.map((app, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{app}</span>
                            <Badge variant="outline" className="text-xs">
                              {Math.floor(Math.random() * 3) + 1}h today
                            </Badge>
                          </div>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="activity" className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 mb-2">Recent Activity:</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Opened Instagram</span>
                            <span className="text-xs text-gray-500">5 min ago</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Used YouTube</span>
                            <span className="text-xs text-gray-500">15 min ago</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Checked Messages</span>
                            <span className="text-xs text-gray-500">1 hour ago</span>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="settings" className="space-y-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Quick Actions:</div>
                        <div className="space-y-2">
                          <Button size="sm" variant="outline" className="w-full justify-start">
                            Set Screen Time Limits
                          </Button>
                          <Button size="sm" variant="outline" className="w-full justify-start">
                            Review App Permissions
                          </Button>
                          <Button size="sm" variant="outline" className="w-full justify-start">
                            Update Safety Settings
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Family Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ModernIcon name="lightbulb" size="lg" className="mr-2 text-yellow-600" />
            Smart Suggestions for Your Family
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">⏰</span>
                <div className="font-medium">Screen Time Balance</div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Emma's screen time is higher than recommended. Consider setting up some healthy limits.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Set Up Limits
              </Button>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">🔒</span>
                <div className="font-medium">Security Boost</div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Turn on two-factor authentication for your family's most important accounts.
              </p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Enable 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}