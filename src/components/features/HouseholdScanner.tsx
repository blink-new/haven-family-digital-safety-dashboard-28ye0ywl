import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Scan, 
  Wifi, 
  Smartphone, 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Eye,
  Lock,
  Users
} from 'lucide-react'

interface ScanResult {
  id: string
  category: 'device' | 'vulnerability' | 'pattern' | 'control'
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  device?: string
  recommendation: string
}

interface HouseholdScannerProps {
  onScanComplete?: (results: ScanResult[]) => void
}

export function HouseholdScanner({ onScanComplete }: HouseholdScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [currentScanStep, setCurrentScanStep] = useState('')
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null)
  const [scanHistory, setScanHistory] = useState<Array<{ date: Date; score: number; issues: number }>>([
    { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), score: 720, issues: 8 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), score: 745, issues: 6 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), score: 762, issues: 4 }
  ])

  const scanSteps = [
    'Discovering connected devices...',
    'Checking device security settings...',
    'Analyzing app permissions...',
    'Scanning for vulnerabilities...',
    'Reviewing usage patterns...',
    'Evaluating parental controls...',
    'Generating recommendations...'
  ]

  const mockScanResults: ScanResult[] = [
    {
      id: '1',
      category: 'device',
      severity: 'high',
      title: '3 devices with weak passwords',
      description: 'Smart TV, Ring Doorbell, and iPad use default or weak passwords',
      device: 'Multiple devices',
      recommendation: 'Update to strong, unique passwords for each device'
    },
    {
      id: '2',
      category: 'vulnerability',
      severity: 'medium',
      title: 'Outdated firmware detected',
      description: 'Router firmware is 6 months behind latest security updates',
      device: 'Home Router',
      recommendation: 'Enable automatic updates or update manually'
    },
    {
      id: '3',
      category: 'pattern',
      severity: 'medium',
      title: 'Unusual login activity',
      description: 'Netflix accessed from unknown location last week',
      device: 'Streaming Services',
      recommendation: 'Review account activity and enable location alerts'
    },
    {
      id: '4',
      category: 'control',
      severity: 'high',
      title: 'No parental controls on kids\' devices',
      description: 'Children\'s tablets have unrestricted access to all content',
      device: 'Kids\' iPads',
      recommendation: 'Set up screen time limits and content filtering'
    },
    {
      id: '5',
      category: 'vulnerability',
      severity: 'low',
      title: 'Social media privacy settings',
      description: 'Instagram profiles are set to public for family members',
      device: 'Social Media',
      recommendation: 'Review and tighten privacy settings'
    }
  ]

  const startScan = async () => {
    setIsScanning(true)
    setScanProgress(0)
    setScanResults([])

    for (let i = 0; i < scanSteps.length; i++) {
      setCurrentScanStep(scanSteps[i])
      setScanProgress((i + 1) / scanSteps.length * 100)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    setScanResults(mockScanResults)
    setLastScanTime(new Date())
    setScanHistory(prev => [...prev, { 
      date: new Date(), 
      score: 785, 
      issues: mockScanResults.length 
    }])
    setIsScanning(false)
    onScanComplete?.(mockScanResults)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'medium': return <Eye className="h-4 w-4 text-yellow-500" />
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'device': return <Monitor className="h-4 w-4" />
      case 'vulnerability': return <Shield className="h-4 w-4" />
      case 'pattern': return <Eye className="h-4 w-4" />
      case 'control': return <Lock className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Scan Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Check Your Family's Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isScanning && !scanResults.length && (
            <div className="text-center py-8">
              <Shield className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Ready to Check How You're Doing</h3>
              <p className="text-muted-foreground mb-6">
                HAVEN will look at all your family's gadgets, apps, and online accounts — 
                we don't peek at your personal stuff, just check if everything is safe.
              </p>
              <Button onClick={startScan} size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Scan className="h-4 w-4 mr-2" />
                Check My Family's Safety
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="animate-pulse">
                  <Scan className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Checking Your Family's Safety</h3>
                <p className="text-muted-foreground mb-4">{currentScanStep}</p>
              </div>
              <Progress value={scanProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(scanProgress)}% complete
              </p>
            </div>
          )}

          {lastScanTime && !isScanning && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Last scan: {lastScanTime.toLocaleString()}
              </div>
              <Button onClick={startScan} variant="outline" size="sm">
                <Scan className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">12</p>
                          <p className="text-sm text-muted-foreground">Connected Devices</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-2xl font-bold">{scanResults.length}</p>
                          <p className="text-sm text-muted-foreground">Issues Found</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">4</p>
                          <p className="text-sm text-muted-foreground">Family Members</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  {scanResults.map((result) => (
                    <Card key={result.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(result.severity)}
                            {getCategoryIcon(result.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{result.title}</h4>
                              <Badge variant={getSeverityColor(result.severity) as any}>
                                {result.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {result.description}
                            </p>
                            {result.device && (
                              <p className="text-xs text-muted-foreground mb-2">
                                Device: {result.device}
                              </p>
                            )}
                            <p className="text-sm font-medium text-blue-600">
                              💡 {result.recommendation}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Vulnerabilities by Severity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">High Risk</span>
                          <span className="text-sm font-semibold text-red-500">
                            {scanResults.filter(r => r.severity === 'high').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Medium Risk</span>
                          <span className="text-sm font-semibold text-yellow-500">
                            {scanResults.filter(r => r.severity === 'medium').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Low Risk</span>
                          <span className="text-sm font-semibold text-green-500">
                            {scanResults.filter(r => r.severity === 'low').length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Issues by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Device Security</span>
                          <span className="text-sm font-semibold">
                            {scanResults.filter(r => r.category === 'device').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Vulnerabilities</span>
                          <span className="text-sm font-semibold">
                            {scanResults.filter(r => r.category === 'vulnerability').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Usage Patterns</span>
                          <span className="text-sm font-semibold">
                            {scanResults.filter(r => r.category === 'pattern').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Missing Controls</span>
                          <span className="text-sm font-semibold">
                            {scanResults.filter(r => r.category === 'control').length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="space-y-3">
                  {scanHistory.map((scan, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{scan.date.toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {scan.date.toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">Score: {scan.score}</p>
                            <p className="text-sm text-muted-foreground">
                              {scan.issues} issues found
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}