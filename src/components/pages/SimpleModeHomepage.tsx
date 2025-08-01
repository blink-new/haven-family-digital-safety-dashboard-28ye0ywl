import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { HavenLogo } from '../ui/HavenLogo'
import { Shield, AlertTriangle, CheckCircle, Zap, Settings } from 'lucide-react'
import { useCyberScore } from '../../hooks/useCyberScore'
import { useHavenMode } from '../../hooks/useHavenMode'
import { ModeSelector } from '../ui/ModeSelector'

export function SimpleModeHomepage() {
  const [showAlert, setShowAlert] = useState(false)
  const { score } = useCyberScore()
  const { mode, setMode } = useHavenMode()
  
  const cyberScore = score?.score || 85
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 80) return 'bg-blue-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getScoreStatus = (score: number) => {
    if (score >= 90) return { text: 'Excellent', icon: CheckCircle, color: 'text-green-600' }
    if (score >= 80) return { text: 'Good', icon: Shield, color: 'text-blue-600' }
    if (score >= 70) return { text: 'Fair', icon: AlertTriangle, color: 'text-yellow-600' }
    return { text: 'Needs Attention', icon: AlertTriangle, color: 'text-red-600' }
  }

  const status = getScoreStatus(cyberScore)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="flex justify-between items-start mb-4">
          <div></div>
          <div className="text-center">
            <HavenLogo size="xl" showTagline={false} />
            <p className="text-gray-600 mt-2">Your family's digital safety, simplified</p>
          </div>
          <ModeSelector currentMode={mode} onModeChange={setMode} />
        </div>
      </header>

      {/* Main Score Display */}
      <div className="max-w-md mx-auto mb-8">
        <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="mb-4">
              <div className={`text-6xl font-bold ${getScoreColor(cyberScore)} mb-2`}>
                {cyberScore}
              </div>
              <div className="text-lg text-gray-600 mb-4">Safety Score</div>
              
              <div className="flex items-center justify-center mb-4">
                <status.icon className={`w-6 h-6 ${status.color} mr-2`} />
                <span className={`text-lg font-medium ${status.color}`}>
                  {status.text}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    cyberScore >= 90 ? 'bg-green-500' :
                    cyberScore >= 80 ? 'bg-blue-500' :
                    cyberScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${cyberScore}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Alert */}
      <div className="max-w-md mx-auto mb-8">
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800 mb-1">
                  Action Needed
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  2 unknown devices detected on your network
                </p>
                <Button 
                  size="sm" 
                  className="bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => setShowAlert(true)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Fix This Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Status */}
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">4</div>
              <div className="text-sm text-gray-600">Family Members</div>
              <Badge className="mt-2 bg-green-100 text-green-800">Protected</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Devices</div>
              <Badge className="mt-2 bg-blue-100 text-blue-800">Monitored</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alert Detail Modal */}
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              Unknown Devices Found
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              We found 2 devices on your network that we don't recognize. This could be:
            </p>
            
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• New devices you recently added</li>
              <li>• Guests using your Wi-Fi</li>
              <li>• Potentially unauthorized access</li>
            </ul>
            
            <div className="space-y-2">
              <Button className="w-full" onClick={() => setShowAlert(false)}>
                Secure My Network
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setShowAlert(false)}>
                These Are My Devices
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}