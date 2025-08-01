import React, { useState, useEffect } from 'react'
import { Shield, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SecurityScoreWidgetProps {
  score: number
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  summary?: string
  autoRemediations?: string[]
  recommendations?: string[]
  onScan?: () => Promise<void>
}

export function SecurityScoreWidget({ 
  score, 
  trend, 
  trendValue, 
  summary, 
  autoRemediations = [], 
  recommendations = [],
  onScan 
}: SecurityScoreWidgetProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 500)
    return () => clearTimeout(timer)
  }, [score])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    if (score >= 60) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle }
    return { label: 'Needs Attention', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <TrendingUp className="w-4 h-4 text-slate-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-slate-500'
    }
  }

  const handleRefresh = async () => {
    if (onScan) {
      setIsRefreshing(true)
      try {
        await onScan()
      } catch (error) {
        console.error('Scan failed:', error)
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  const status = getScoreStatus(score)
  const StatusIcon = status.icon

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <CardTitle>Digital Safety Score</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 p-0"
          >
            <Shield className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Your household's overall protection level
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Summary Message */}
          {summary && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {summary}
              </AlertDescription>
            </Alert>
          )}

          {/* Auto-Remediation Messages */}
          {autoRemediations.length > 0 && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-1">
                  {autoRemediations.map((remediation, index) => (
                    <div key={index}>• {remediation}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Score Display */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className={`text-5xl font-bold ${getScoreColor(animatedScore)} transition-all duration-1000`}>
                {Math.round(animatedScore)}
              </div>
              <div className="text-sm text-slate-500 font-medium">out of 100</div>
            </div>
            
            <div className="flex-1 space-y-3">
              <Progress 
                value={animatedScore} 
                className="h-4 transition-all duration-1000" 
              />
              <div className="flex items-center justify-between">
                <Badge className={status.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
                <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span>{trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendValue} this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">12</div>
              <div className="text-xs text-slate-500">Secure Devices</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">3</div>
              <div className="text-xs text-slate-500">Need Attention</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">8</div>
              <div className="text-xs text-slate-500">Active Services</div>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-700">Recommendations:</h4>
              <div className="space-y-1">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="text-sm text-slate-600 flex items-start gap-2">
                    <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Scanning Protection...' : 'Check Protection Status'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}