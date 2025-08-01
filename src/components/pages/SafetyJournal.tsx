import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { BookOpen, TrendingUp, Award, Calendar, Shield, Users, Smartphone, Wifi } from 'lucide-react'

export function SafetyJournal({ guardian }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  
  const [journalEntries] = useState([
    {
      date: 'Today',
      score: 78,
      improvements: [
        { action: 'Updated Emma\'s screen time limits', points: '+5', category: 'Parental Controls' },
        { action: 'Enabled auto-updates on smart TV', points: '+3', category: 'Device Security' }
      ],
      alerts: 2,
      emoji: '📈'
    },
    {
      date: 'Yesterday',
      score: 75,
      improvements: [
        { action: 'Set up two-factor auth on Gmail', points: '+15', category: 'Account Security' },
        { action: 'Reviewed app permissions on iPad', points: '+8', category: 'Privacy' }
      ],
      alerts: 1,
      emoji: '🔐'
    },
    {
      date: '2 days ago',
      score: 68,
      improvements: [
        { action: 'Updated router security settings', points: '+10', category: 'Network Security' },
        { action: 'Blocked suspicious website', points: '+7', category: 'Web Protection' }
      ],
      alerts: 3,
      emoji: '🛡️'
    },
    {
      date: '1 week ago',
      score: 62,
      improvements: [
        { action: 'Started using HAVEN protection', points: '+25', category: 'Initial Setup' },
        { action: 'Completed family safety assessment', points: '+12', category: 'Assessment' }
      ],
      alerts: 0,
      emoji: '🚀'
    }
  ])

  const [achievements] = useState([
    {
      id: 1,
      title: 'First Steps',
      description: 'Completed your first safety scan',
      earned: true,
      date: '1 week ago',
      emoji: '👶',
      points: 25
    },
    {
      id: 2,
      title: 'Security Champion',
      description: 'Enabled 2FA on 3 important accounts',
      earned: true,
      date: '2 days ago',
      emoji: '🏆',
      points: 50
    },
    {
      id: 3,
      title: 'Family Guardian',
      description: 'Set up parental controls for all kids',
      earned: true,
      date: 'Yesterday',
      emoji: '👨‍👩‍👧‍👦',
      points: 30
    },
    {
      id: 4,
      title: 'Privacy Pro',
      description: 'Review privacy settings on 10 apps',
      earned: false,
      progress: 60,
      emoji: '🔒',
      points: 40
    },
    {
      id: 5,
      title: 'Network Ninja',
      description: 'Secure all home network devices',
      earned: false,
      progress: 30,
      emoji: '🥷',
      points: 60
    }
  ])

  const [weeklyStats] = useState({
    totalPoints: 95,
    actionsCompleted: 12,
    alertsResolved: 8,
    devicesSecured: 6,
    scoreImprovement: 16
  })

  const getGuardianMessage = () => {
    return "Look how much safer your family has become! I'm so proud of the progress we've made together. 🌟"
  }

  const getScoreChange = (current, previous) => {
    const change = current - previous
    return change > 0 ? `+${change}` : change.toString()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Guardian Message */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
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

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>This Week's Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{weeklyStats.totalPoints}</div>
              <div className="text-sm text-gray-500">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weeklyStats.actionsCompleted}</div>
              <div className="text-sm text-gray-500">Actions Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{weeklyStats.alertsResolved}</div>
              <div className="text-sm text-gray-500">Alerts Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{weeklyStats.devicesSecured}</div>
              <div className="text-sm text-gray-500">Devices Secured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">+{weeklyStats.scoreImprovement}</div>
              <div className="text-sm text-gray-500">Score Improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Journal Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>Safety Journal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {journalEntries.map((entry, index) => (
                <div key={index} className="relative">
                  {index < journalEntries.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">{entry.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{entry.date}</div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Score:</span>
                          <span className="font-bold text-blue-600">{entry.score}</span>
                          {index > 0 && (
                            <span className={`text-sm ${
                              entry.score > journalEntries[index - 1].score 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              ({getScoreChange(entry.score, journalEntries[index - 1].score)})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {entry.improvements.map((improvement, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm bg-green-50 p-2 rounded">
                            <span>{improvement.action}</span>
                            <Badge variant="outline" className="text-green-700">
                              {improvement.points}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      {entry.alerts > 0 && (
                        <div className="mt-2 text-sm text-gray-500">
                          {entry.alerts} alert{entry.alerts > 1 ? 's' : ''} handled
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`p-4 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`text-3xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                      {achievement.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <Badge variant="outline" className="text-xs">
                          {achievement.points} pts
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">{achievement.description}</div>
                      {achievement.earned ? (
                        <div className="text-xs text-green-600">
                          ✅ Earned {achievement.date}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Progress value={achievement.progress} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {achievement.progress}% complete
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Export Monthly Report</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Share Safety Score</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Show Achievements</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}