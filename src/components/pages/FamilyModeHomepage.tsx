import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { HavenLogo } from '../ui/HavenLogo'
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Calendar,
  Star,
  Shield,
  Smartphone,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Brain,
  BookOpen
} from 'lucide-react'
import { useCyberScore } from '../../hooks/useCyberScore'
import { useHavenMode } from '../../hooks/useHavenMode'
import { ModeSelector } from '../ui/ModeSelector'

export function FamilyModeHomepage() {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)
  const { score } = useCyberScore()
  const { mode, setMode } = useHavenMode()
  
  const cyberScore = score?.score || 85

  const familyMembers = [
    { name: 'Sarah', role: 'Parent', screenTime: '2h 15m', risk: 'Low', trend: 'down', avatar: '👩‍💼' },
    { name: 'Mike', role: 'Parent', screenTime: '3h 45m', risk: 'Medium', trend: 'up', avatar: '👨‍💼' },
    { name: 'Emma', role: 'Teen', screenTime: '5h 30m', risk: 'High', trend: 'down', avatar: '👧' },
    { name: 'Jake', role: 'Child', screenTime: '1h 45m', risk: 'Low', trend: 'stable', avatar: '👦' }
  ]

  const weeklyInsights = [
    {
      id: 'screen-time',
      title: 'Screen Time Improved',
      description: 'Family screen time decreased by 15% this week',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      tip: 'Great job! Consider setting up device-free dinner times to maintain this progress.'
    },
    {
      id: 'security',
      title: 'Security Score Up',
      description: 'All devices updated, passwords strengthened',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tip: 'Enable two-factor authentication on remaining accounts for even better security.'
    },
    {
      id: 'behavior',
      title: 'Bedtime Routine',
      description: 'Emma\'s bedtime device usage improved',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tip: 'Consider a family charging station outside bedrooms for better sleep hygiene.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div></div>
          <div className="text-center">
            <HavenLogo size="xl" showTagline={false} />
            <h1 className="text-2xl font-bold text-gray-800 mt-2 mb-2">Family Dashboard</h1>
            <p className="text-gray-600">Keeping your family safe and connected</p>
          </div>
          <ModeSelector currentMode={mode} onModeChange={setMode} />
        </div>
      </header>

      {/* Family Score Overview */}
      <div className="max-w-6xl mx-auto mb-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Score */}
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{cyberScore}</div>
                <div className="text-lg text-gray-600 mb-2">Family Safety Score</div>
                <Badge className="bg-green-100 text-green-800">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5 This Week
                </Badge>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">4</div>
                  <div className="text-sm text-gray-600">Family Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Protected Devices</div>
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
              
              {/* Weekly Progress */}
              <div>
                <h3 className="text-lg font-semibold mb-3">This Week's Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Screen Time Goals</span>
                    <span className="text-green-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Security Updates</span>
                    <span className="text-blue-600">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Family Members */}
      <div className="max-w-6xl mx-auto mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Family Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {familyMembers.map((member, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{member.avatar}</div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Screen Time</span>
                        <span className="font-medium">{member.screenTime}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>Risk Level</span>
                        <Badge className={`${
                          member.risk === 'Low' ? 'bg-green-100 text-green-800' :
                          member.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {member.risk}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>Trend</span>
                        <div className="flex items-center">
                          {member.trend === 'up' && <TrendingUp className="w-3 h-3 text-red-500" />}
                          {member.trend === 'down' && <TrendingUp className="w-3 h-3 text-green-500 rotate-180" />}
                          {member.trend === 'stable' && <div className="w-3 h-0.5 bg-gray-400"></div>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Insights & Tips */}
      <div className="max-w-6xl mx-auto mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              This Week's Insights & Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weeklyInsights.map((insight) => (
                <Card 
                  key={insight.id} 
                  className={`cursor-pointer hover:shadow-md transition-all ${insight.bgColor} border-0`}
                  onClick={() => setSelectedInsight(insight.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-white`}>
                        <insight.icon className={`w-5 h-5 ${insight.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{insight.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <Button size="sm" variant="ghost" className="text-xs p-0 h-auto">
                          View Tip →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-16 text-left justify-start bg-blue-600 hover:bg-blue-700">
            <Smartphone className="w-6 h-6 mr-3" />
            <div>
              <div className="font-semibold">Quick Device Scan</div>
              <div className="text-xs opacity-90">Check all family devices</div>
            </div>
          </Button>
          
          <Button className="h-16 text-left justify-start bg-green-600 hover:bg-green-700">
            <Brain className="w-6 h-6 mr-3" />
            <div>
              <div className="font-semibold">Ask Haven AI</div>
              <div className="text-xs opacity-90">Get family safety advice</div>
            </div>
          </Button>
          
          <Button className="h-16 text-left justify-start bg-purple-600 hover:bg-purple-700">
            <BookOpen className="w-6 h-6 mr-3" />
            <div>
              <div className="font-semibold">Family Policies</div>
              <div className="text-xs opacity-90">Review & update rules</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Insight Detail Modal */}
      <Dialog open={!!selectedInsight} onOpenChange={() => setSelectedInsight(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedInsight && weeklyInsights.find(i => i.id === selectedInsight)?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedInsight && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {(() => {
                  const insight = weeklyInsights.find(i => i.id === selectedInsight)
                  if (!insight) return null
                  return (
                    <>
                      <div className={`p-3 rounded-full ${insight.bgColor}`}>
                        <insight.icon className={`w-6 h-6 ${insight.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{insight.title}</h3>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </>
                  )
                })()}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">💡 Family Tip</h4>
                <p className="text-sm text-blue-700">
                  {weeklyInsights.find(i => i.id === selectedInsight)?.tip}
                </p>
              </div>
              
              <Button className="w-full" onClick={() => setSelectedInsight(null)}>
                Got It!
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}