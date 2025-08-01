import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Users, 
  Monitor, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Scan,
  Settings,
  Award,
  Clock,
  Eye,
  Lock,
  Smartphone
} from 'lucide-react'
import { NovaAvatar } from '@/components/features/NovaAvatar'
import { HouseholdScanner } from '@/components/features/HouseholdScanner'
import { AutomatedControls } from '@/components/features/AutomatedControls'
import { EnhancedCyberScore } from '@/components/features/EnhancedCyberScore'
import { DualScoreWidgets } from '@/components/features/DualScoreWidgets'
import { SpinningHouseLogo } from '@/components/ui/SpinningHouseLogo'
import { useDualScores } from '@/hooks/useDualScores'
import type { DualScoreResult } from '@/services/DualScoringEngine'

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [scanResults, setScanResults] = useState<any[]>([])
  const [currentScore, setCurrentScore] = useState(762)
  const [novaMessage, setNovaMessage] = useState("Hey there! Your family is looking safe and sound online today. Great job!")
  const { scores: dualScores, isLoading: scoresLoading } = useDualScores()

  const familyMembers = [
    { name: 'Sarah', role: 'Parent', risk: 'low', avatar: '👩', devices: 3 },
    { name: 'Mike', role: 'Parent', risk: 'low', avatar: '👨', devices: 4 },
    { name: 'Emma', role: 'Teen', risk: 'medium', avatar: '👧', devices: 2 },
    { name: 'Jake', role: 'Child', risk: 'low', avatar: '👦', devices: 1 }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'success',
      title: 'Your router got an update',
      description: 'We updated your Wi-Fi router to keep it secure - all done!',
      time: '2 hours ago',
      device: 'Home Wi-Fi'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Netflix used somewhere new',
      description: 'Someone watched Netflix from a new place - probably just vacation or a friend\'s house',
      time: '5 hours ago',
      device: 'Netflix'
    },
    {
      id: 3,
      type: 'info',
      title: 'Emma hit her screen time limit',
      description: 'Emma\'s iPad reached daily limit',
      time: '1 day ago',
      device: 'Kids\' iPad'
    },
    {
      id: 4,
      type: 'success',
      title: 'MFA enabled',
      description: 'Two-factor authentication activated on Gmail',
      time: '2 days ago',
      device: 'Email Accounts'
    }
  ]

  const quickStats = [
    { label: 'Gadgets We\'re Watching', value: '12', icon: Monitor, color: 'text-blue-600' },
    { label: 'Apps & Services', value: '8', icon: Wifi, color: 'text-green-600' },
    { label: 'People in Your Home', value: '4', icon: Users, color: 'text-purple-600' },
    { 
      label: 'Cyber Resilience', 
      value: dualScores?.cyberResilience.score.toString() || '75', 
      icon: Shield, 
      color: 'text-blue-600' 
    },
    { 
      label: 'User Score', 
      value: dualScores?.userScore.score.toString() || '50', 
      icon: Users, 
      color: 'text-purple-600' 
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Eye className="h-4 w-4 text-blue-500" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleScanComplete = (results: any[]) => {
    setScanResults(results)
    setNovaMessage("Your household scan is complete! I found a few areas we can improve together.")
  }

  const handleScoreUpdate = (newScore: number) => {
    setCurrentScore(newScore)
  }

  const getNovaContext = () => {
    if (activeTab === 'scanner') return 'scanning'
    if (activeTab === 'controls') return 'controls'
    return 'dashboard'
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dual-scores">Dual Scores</TabsTrigger>
          <TabsTrigger value="score">Cyber Score</TabsTrigger>
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Household Centerpiece */}
          <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <SpinningHouseLogo size="xl" onClick={() => setActiveTab('score')} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Your Digital Household</h2>
                  <p className="text-gray-600 mt-2">
                    Protected by HAVEN • Cyber Resilience: {dualScores?.cyberResilience.score || 75}/100 • User Score: {dualScores?.userScore.score || 50}/100
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Badge className="bg-green-100 text-green-800">
                      🛡️ Protected
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      👥 4 Members
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      📱 12 Devices
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Family Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Family Protection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {familyMembers.map((member, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{member.avatar}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRiskColor(member.risk)}>
                              {member.risk} risk
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {member.devices} devices
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{activity.title}</h4>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Device: {activity.device}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setActiveTab('scanner')}
                >
                  <Scan className="h-6 w-6" />
                  <span>Run Security Scan</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setActiveTab('controls')}
                >
                  <Settings className="h-6 w-6" />
                  <span>Review Controls</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2"
                  onClick={() => setActiveTab('dual-scores')}
                >
                  <TrendingUp className="h-6 w-6" />
                  <span>View Dual Scores</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dual-scores">
          <DualScoreWidgets 
            onScoreUpdate={(scores: DualScoreResult) => {
              setCurrentScore(scores.cyberResilience.score)
              setNovaMessage(
                `Great news! Your Cyber Resilience Score is ${scores.cyberResilience.score} and your User Score is ${scores.userScore.score}. ${scores.summary.cyberResilienceMessage}`
              )
            }}
          />
        </TabsContent>

        <TabsContent value="score">
          <EnhancedCyberScore 
            currentScore={currentScore}
            onScoreUpdate={handleScoreUpdate}
          />
        </TabsContent>

        <TabsContent value="scanner">
          <HouseholdScanner onScanComplete={handleScanComplete} />
        </TabsContent>

        <TabsContent value="controls">
          <AutomatedControls scanResults={scanResults} />
        </TabsContent>
      </Tabs>

      {/* Nova Avatar */}
      <NovaAvatar 
        message={novaMessage}
        isVisible={true}
        context={getNovaContext()}
      />
    </div>
  )
}