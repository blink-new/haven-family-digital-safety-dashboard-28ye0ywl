import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Monitor,
  Database,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
  Award,
  History,
  Target
} from 'lucide-react'

interface ScoreCategory {
  id: string
  name: string
  score: number
  maxScore: number
  description: string
  icon: React.ReactNode
  improvements: string[]
  trend: 'up' | 'down' | 'stable'
  trendValue: number
}

interface ScoreHistory {
  date: Date
  score: number
  change: number
  reason: string
}

interface EnhancedCyberScoreProps {
  currentScore?: number
  onScoreUpdate?: (newScore: number) => void
}

export function EnhancedCyberScore({ currentScore = 762, onScoreUpdate }: EnhancedCyberScoreProps) {
  const [score, setScore] = useState(currentScore)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showSimulation, setShowSimulation] = useState(false)

  const categories: ScoreCategory[] = [
    {
      id: 'digital-surface',
      name: 'Digital Surface',
      score: 145,
      maxScore: 170,
      description: 'Number of devices, services, and accounts in your household',
      icon: <Monitor className="h-4 w-4" />,
      improvements: [
        'Remove unused accounts (+8 points)',
        'Consolidate duplicate services (+5 points)',
        'Update device inventory (+3 points)'
      ],
      trend: 'stable',
      trendValue: 0
    },
    {
      id: 'data-sensitivity',
      name: 'Data Sensitivity',
      score: 128,
      maxScore: 170,
      description: 'Types of sensitive data stored and protection levels',
      icon: <Database className="h-4 w-4" />,
      improvements: [
        'Enable encryption on cloud storage (+15 points)',
        'Secure financial documents (+12 points)',
        'Review data sharing permissions (+8 points)'
      ],
      trend: 'up',
      trendValue: 5
    },
    {
      id: 'behavioral-risk',
      name: 'Behavioral Risk',
      score: 142,
      maxScore: 170,
      description: 'Digital habits and security practices of family members',
      icon: <Users className="h-4 w-4" />,
      improvements: [
        'Reduce password reuse (+20 points)',
        'Enable password manager (+15 points)',
        'Improve social media privacy (+10 points)'
      ],
      trend: 'down',
      trendValue: -3
    },
    {
      id: 'exposure-threats',
      name: 'Exposure & Threats',
      score: 155,
      maxScore: 170,
      description: 'Dark web presence, phishing attempts, and security incidents',
      icon: <AlertTriangle className="h-4 w-4" />,
      improvements: [
        'Monitor dark web mentions (+12 points)',
        'Enable advanced threat detection (+10 points)',
        'Review recent security alerts (+5 points)'
      ],
      trend: 'up',
      trendValue: 8
    },
    {
      id: 'controls-compliance',
      name: 'Controls & Compliance',
      score: 192,
      maxScore: 170,
      description: 'Security controls, MFA, updates, and parental controls',
      icon: <Shield className="h-4 w-4" />,
      improvements: [
        'All controls optimally configured',
        'Consider advanced security features (+5 points)'
      ],
      trend: 'up',
      trendValue: 12
    }
  ]

  const scoreHistory: ScoreHistory[] = [
    { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), score: 698, change: 0, reason: 'Initial assessment' },
    { date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), score: 715, change: 17, reason: 'Enabled MFA on email accounts' },
    { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), score: 728, change: 13, reason: 'Updated router firmware' },
    { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), score: 745, change: 17, reason: 'Set up parental controls' },
    { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), score: 738, change: -7, reason: 'New vulnerability detected' },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), score: 755, change: 17, reason: 'Applied security patches' },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), score: 762, change: 7, reason: 'Improved password hygiene' }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600'
    if (score >= 650) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreRing = (score: number) => {
    if (score >= 750) return 'stroke-green-500'
    if (score >= 650) return 'stroke-yellow-500'
    return 'stroke-red-500'
  }

  const getScoreLevel = (score: number) => {
    if (score >= 800) return { level: 'Platinum', color: 'bg-purple-100 text-purple-800' }
    if (score >= 750) return { level: 'Gold', color: 'bg-yellow-100 text-yellow-800' }
    if (score >= 650) return { level: 'Silver', color: 'bg-gray-100 text-gray-800' }
    return { level: 'Bronze', color: 'bg-orange-100 text-orange-800' }
  }

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  const simulateImprovement = (categoryId: string, points: number) => {
    const newScore = score + points
    setScore(newScore)
    onScoreUpdate?.(newScore)
    
    // Reset after 3 seconds to show it's a simulation
    setTimeout(() => {
      setScore(currentScore)
      onScoreUpdate?.(currentScore)
    }, 3000)
  }

  const scoreLevel = getScoreLevel(score)
  const totalMaxScore = categories.reduce((sum, cat) => sum + cat.maxScore, 0)
  const scorePercentage = (score / totalMaxScore) * 100

  return (
    <div className="space-y-6">
      {/* Main Score Display */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Cyber Risk Score</h2>
              <p className="text-sm text-muted-foreground">
                Your family's digital protection level
              </p>
            </div>
            <Badge className={scoreLevel.color}>
              {scoreLevel.level} Protection
            </Badge>
          </div>

          <div className="flex items-center gap-8">
            {/* Score Circle */}
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${scorePercentage * 3.14} 314`}
                  className={getScoreRing(score)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </div>
                  <div className="text-xs text-muted-foreground">/ 850</div>
                </div>
              </div>
            </div>

            {/* Score Details */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-green-600">+17 points</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className="font-semibold">Top 15% of families</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Score Breakdown</p>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between text-sm">
                      <span>{category.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{category.score}</span>
                        {getTrendIcon(category.trend, category.trendValue)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Score Breakdown & Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="simulation">Simulation</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-4">
              <div className="space-y-4">
                {categories.map((category) => (
                  <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {category.icon}
                          <div>
                            <h4 className="font-semibold">{category.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">{category.score}</span>
                            <span className="text-muted-foreground">/ {category.maxScore}</span>
                            {getTrendIcon(category.trend, category.trendValue)}
                          </div>
                          <Progress 
                            value={(category.score / category.maxScore) * 100} 
                            className="w-24 mt-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Improvement Opportunities:</p>
                        {category.improvements.map((improvement, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">• {improvement}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="space-y-3">
                {scoreHistory.reverse().map((entry, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{entry.date.toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">{entry.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{entry.score}</p>
                          {entry.change !== 0 && (
                            <div className={`text-sm flex items-center gap-1 ${
                              entry.change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {entry.change > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {entry.change > 0 ? '+' : ''}{entry.change}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="simulation" className="space-y-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Score Simulation</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Click on any improvement below to see how it would affect your score.
                    Changes are temporary and for demonstration only.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">{category.name}</h4>
                      <div className="space-y-2">
                        {category.improvements.map((improvement, index) => {
                          const points = parseInt(improvement.match(/\+(\d+)/)?.[1] || '0')
                          return (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full justify-between"
                              onClick={() => simulateImprovement(category.id, points)}
                            >
                              <span className="text-left">{improvement}</span>
                              <Badge variant="secondary">Simulate</Badge>
                            </Button>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}