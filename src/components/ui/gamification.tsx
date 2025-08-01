import React from 'react'
import { 
  Shield, 
  Award, 
  TrendingUp, 
  Zap, 
  Target,
  Star,
  CheckCircle,
  Lock,
  Wifi,
  Users
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProgressLevelProps {
  currentLevel: string
  currentPoints: number
  nextLevelPoints: number
}

export function ProgressLevel({ currentLevel, currentPoints, nextLevelPoints }: ProgressLevelProps) {
  const progressPercentage = (currentPoints / nextLevelPoints) * 100

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'bronze':
        return 'text-amber-600 bg-amber-100'
      case 'silver':
        return 'text-slate-600 bg-slate-100'
      case 'gold':
        return 'text-yellow-600 bg-yellow-100'
      case 'platinum':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-slate-600 bg-slate-100'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Protection Level
        </CardTitle>
        <CardDescription>Your family's security progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={getLevelColor(currentLevel)}>
              {currentLevel} Shield
            </Badge>
            <span className="text-sm text-slate-600">
              {currentPoints} / {nextLevelPoints} points
            </span>
          </div>
          
          <Progress value={progressPercentage} className="h-3" />
          
          <div className="text-sm text-slate-600">
            <p>{nextLevelPoints - currentPoints} points to Gold Shield</p>
          </div>
          
          <Button variant="outline" size="sm" className="w-full">
            View Progress Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function AchievementBadges() {
  const achievements = [
    {
      name: 'First Scan',
      description: 'Completed your first security scan',
      icon: Target,
      earned: true,
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'Device Guardian',
      description: 'Secured 5 devices',
      icon: Wifi,
      earned: true,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'Policy Master',
      description: 'Created family protection policies',
      icon: Lock,
      earned: false,
      color: 'text-slate-400 bg-slate-100'
    },
    {
      name: 'Family Protector',
      description: 'Set up protection for all family members',
      icon: Users,
      earned: false,
      color: 'text-slate-400 bg-slate-100'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Achievements
        </CardTitle>
        <CardDescription>Your security milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 transition-all ${
                achievement.earned 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-2 rounded-full ${achievement.color}`}>
                  <achievement.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900">{achievement.name}</p>
                  <p className="text-xs text-slate-500">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-4">
          View All Achievements
        </Button>
      </CardContent>
    </Card>
  )
}

export function QuickActions() {
  const actions = [
    {
      name: 'Run Security Scan',
      description: 'Check all devices and services',
      icon: Target,
      color: 'bg-blue-600 hover:bg-blue-700',
      points: '+10 points'
    },
    {
      name: 'Update Passwords',
      description: 'Strengthen weak passwords',
      icon: Lock,
      color: 'bg-green-600 hover:bg-green-700',
      points: '+15 points'
    },
    {
      name: 'Review Family Settings',
      description: 'Check protection levels',
      icon: Users,
      color: 'bg-purple-600 hover:bg-purple-700',
      points: '+5 points'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-600" />
          Quick Actions
        </CardTitle>
        <CardDescription>Boost your security score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start h-auto p-3"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`p-2 rounded-lg text-white ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{action.name}</p>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {action.points}
                </Badge>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}