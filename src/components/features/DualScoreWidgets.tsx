import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  Shield, 
  User, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Info,
  Scan,
  Award,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react'
import { DualScoringEngine, type DualScoreResult } from '@/services/DualScoringEngine'
import { useAuth } from '@/hooks/useAuth'

interface DualScoreWidgetsProps {
  onScoreUpdate?: (scores: DualScoreResult) => void
}

export function DualScoreWidgets({ onScoreUpdate }: DualScoreWidgetsProps) {
  const { user } = useAuth()
  const [scores, setScores] = useState<DualScoreResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadScores = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError(null)
      const dualScores = await DualScoringEngine.getDualScores(user.id)
      setScores(dualScores)
      onScoreUpdate?.(dualScores)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scores')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, onScoreUpdate])

  // Load scores on component mount
  useEffect(() => {
    if (user?.id) {
      loadScores()
    }
  }, [user?.id, loadScores])

  const handleScan = async () => {
    if (!user?.id) return

    try {
      setIsScanning(true)
      setError(null)
      
      // Update cyber resilience score (technical scan)
      await DualScoringEngine.updateCyberResilienceScore(user.id)
      
      // Reload scores to get updated values
      await loadScores()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed')
    } finally {
      setIsScanning(false)
    }
  }

  const handleCompleteRecommendation = async (description: string) => {
    if (!user?.id) return

    try {
      await DualScoringEngine.addUserScorePoints(
        user.id,
        'recommendation_completed',
        10,
        description
      )
      await loadScores()
    } catch (err) {
      console.error('Failed to complete recommendation:', err)
    }
  }

  const handleEnableSafeSetting = async (description: string) => {
    if (!user?.id) return

    try {
      await DualScoringEngine.addUserScorePoints(
        user.id,
        'safe_setting_enabled',
        15,
        description
      )
      await loadScores()
    } catch (err) {
      console.error('Failed to enable safe setting:', err)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreRing = (score: number) => {
    if (score >= 85) return 'stroke-green-500'
    if (score >= 70) return 'stroke-yellow-500'
    return 'stroke-red-500'
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  const getCyberResilienceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'bg-green-100 text-green-800' }
    if (score >= 80) return { level: 'Good', color: 'bg-blue-100 text-blue-800' }
    if (score >= 70) return { level: 'Fair', color: 'bg-yellow-100 text-yellow-800' }
    return { level: 'Needs Work', color: 'bg-red-100 text-red-800' }
  }

  const getUserScoreLevel = (score: number) => {
    if (score >= 90) return { level: 'Champion', color: 'bg-purple-100 text-purple-800' }
    if (score >= 75) return { level: 'Engaged', color: 'bg-green-100 text-green-800' }
    if (score >= 60) return { level: 'Active', color: 'bg-blue-100 text-blue-800' }
    return { level: 'Getting Started', color: 'bg-gray-100 text-gray-800' }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Error loading scores: {error}</span>
          </div>
          <Button onClick={loadScores} className="mt-4" variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!scores) return null

  const cyberLevel = getCyberResilienceLevel(scores.cyberResilience.score)
  const userLevel = getUserScoreLevel(scores.userScore.score)

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Dual Score Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cyber Resilience Score */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Cyber Resilience Score</CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Measures your household's technical security state including device security, 
                        network health, data privacy, and threat levels. Only changes based on 
                        technical risk factors.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge className={cyberLevel.color}>
                  {cyberLevel.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center gap-6">
                {/* Score Circle */}
                <div className="relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(scores.cyberResilience.score / 100) * 201} 201`}
                      className={getScoreRing(scores.cyberResilience.score)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(scores.cyberResilience.score)}`}>
                        {scores.cyberResilience.score}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-1">
                    {getTrendIcon(scores.summary.cyberResilienceChange)}
                    <span className="text-sm text-gray-600">
                      {scores.summary.cyberResilienceChange === 0 ? 'Stable' : 
                       scores.summary.cyberResilienceChange > 0 ? `+${scores.summary.cyberResilienceChange}` : 
                       scores.summary.cyberResilienceChange}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Device Security</span>
                      <span className="font-medium">{scores.cyberResilience.deviceSecurity}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Network Health</span>
                      <span className="font-medium">{scores.cyberResilience.networkHealth}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Data Privacy</span>
                      <span className="font-medium">{scores.cyberResilience.dataPrivacy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Threat Level</span>
                      <span className="font-medium">{scores.cyberResilience.threatLevel}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {scores.summary.cyberResilienceMessage}
                </p>
              </div>

              <Button 
                onClick={handleScan} 
                disabled={isScanning}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              >
                {isScanning ? (
                  <>
                    <Scan className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4 mr-2" />
                    Run Security Scan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* User Score */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">User Score</CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Tracks your positive security behaviors like completing recommendations, 
                        enabling safe settings, and engaging with HAVEN's guidance. 
                        Resets weekly to encourage ongoing engagement.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge className={userLevel.color}>
                  {userLevel.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center gap-6">
                {/* Score Circle */}
                <div className="relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(scores.userScore.score / 100) * 201} 201`}
                      className="stroke-purple-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {scores.userScore.score}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-1">
                    {getTrendIcon(scores.summary.userScoreChange)}
                    <span className="text-sm text-gray-600">
                      {scores.summary.userScoreChange === 0 ? 'Stable' : 
                       scores.summary.userScoreChange > 0 ? `+${scores.summary.userScoreChange}` : 
                       scores.summary.userScoreChange}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Recommendations</span>
                      <span className="font-medium">{scores.userScore.recommendationsCompleted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Safe Settings</span>
                      <span className="font-medium">{scores.userScore.safeSettingsEnabled}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Screen Time Goals</span>
                      <span className="font-medium">{scores.userScore.screenTimeCompliance}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Engagement Level</span>
                      <span className="font-medium">{scores.userScore.engagementLevel}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  {scores.summary.userScoreMessage}
                </p>
              </div>

              {/* Weekly Reset Info */}
              {scores.userScore.weeklyResetDate && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>
                    Resets weekly • Next reset: {
                      new Date(new Date(scores.userScore.weeklyResetDate).getTime() + 7 * 24 * 60 * 60 * 1000)
                        .toLocaleDateString()
                    }
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions to Improve User Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Boost Your User Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => handleCompleteRecommendation('Enabled two-factor authentication')}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Complete a Recommendation</span>
                </div>
                <span className="text-sm text-gray-600">+10 points</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => handleEnableSafeSetting('Enabled automatic updates')}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Enable Safe Setting</span>
                </div>
                <span className="text-sm text-gray-600">+15 points</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}