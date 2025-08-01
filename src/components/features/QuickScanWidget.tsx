import React, { useState } from 'react'
import { 
  Shield, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  Clock,
  Target
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface ScanResult {
  category: string
  status: 'safe' | 'warning' | 'scanning'
  count: number
  issues?: string[]
}

export function QuickScanWidget() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [lastScan, setLastScan] = useState('2 hours ago')
  const [scanResults, setScanResults] = useState<ScanResult[]>([
    { category: 'Devices', status: 'safe', count: 12 },
    { category: 'Services', status: 'warning', count: 8, issues: ['Weak password on Netflix', 'Gmail 2FA disabled'] },
    { category: 'Network', status: 'safe', count: 1 },
    { category: 'Family Accounts', status: 'safe', count: 4 }
  ])

  const handleQuickScan = async () => {
    setIsScanning(true)
    setScanProgress(0)
    
    // Update scan results to show scanning state
    setScanResults(prev => prev.map(result => ({ ...result, status: 'scanning' as const })))
    
    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate scan completion
    setTimeout(() => {
      setIsScanning(false)
      setScanProgress(100)
      setLastScan('Just now')
      
      // Update with new scan results
      setScanResults([
        { category: 'Devices', status: 'safe', count: 12 },
        { category: 'Services', status: 'warning', count: 8, issues: ['Weak password on Netflix'] },
        { category: 'Network', status: 'safe', count: 1 },
        { category: 'Family Accounts', status: 'safe', count: 4 }
      ])
      
      // Reset progress after a delay
      setTimeout(() => setScanProgress(0), 2000)
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'scanning':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      default:
        return <Shield className="w-4 h-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'scanning':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const totalIssues = scanResults.reduce((acc, result) => 
    acc + (result.issues?.length || 0), 0
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <CardTitle>Security Scan</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickScan}
            disabled={isScanning}
            className="h-8"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 mr-2" />
                Quick Scan
              </>
            )}
          </Button>
        </div>
        <CardDescription>
          Last scan: {lastScan}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Scan Progress */}
          {isScanning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Scanning your digital ecosystem...</span>
                <span className="text-slate-600">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          )}

          {/* Scan Results Summary */}
          {!isScanning && (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-lg font-semibold text-slate-900">
                  {scanResults.reduce((acc, result) => acc + result.count, 0)}
                </div>
                <div className="text-xs text-slate-500">Items Scanned</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className={`text-lg font-semibold ${totalIssues > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {totalIssues}
                </div>
                <div className="text-xs text-slate-500">Issues Found</div>
              </div>
            </div>
          )}

          {/* Detailed Results */}
          <div className="space-y-2">
            {scanResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="text-sm font-medium text-slate-900">{result.category}</p>
                    <p className="text-xs text-slate-500">{result.count} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {result.issues && result.issues.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {result.issues.length} issue{result.issues.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  <Badge className={getStatusColor(result.status)}>
                    {result.status === 'scanning' ? 'Scanning' : 
                     result.status === 'safe' ? 'Secure' : 'Review'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {!isScanning && totalIssues > 0 && (
            <div className="pt-2 border-t border-slate-200">
              <Button variant="outline" className="w-full" size="sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Review {totalIssues} Issue{totalIssues > 1 ? 's' : ''}
              </Button>
            </div>
          )}

          {!isScanning && totalIssues === 0 && (
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>All systems secure</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}