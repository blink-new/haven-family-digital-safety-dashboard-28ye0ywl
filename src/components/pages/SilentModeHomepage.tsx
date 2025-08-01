import React from 'react'
import { Card, CardContent } from '../ui/card'
import { HavenBrand } from '../ui/HavenLogo'
import { Shield, Eye, Settings } from 'lucide-react'
import { Button } from '../ui/button'
import { useCyberScore } from '../../hooks/useCyberScore'
import { useHavenMode } from '../../hooks/useHavenMode'
import { ModeSelector } from '../ui/ModeSelector'

export function SilentModeHomepage() {
  const { score } = useCyberScore()
  const { mode, setMode } = useHavenMode()
  const cyberScore = score?.score || 85

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm mx-auto text-center">
        {/* Minimal Status Indicator */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="mb-3">
                <HavenBrand />
              </div>
              
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Protecting You Silently
              </h2>
              
              <p className="text-gray-600 text-sm mb-4">
                Silent monitoring active
              </p>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Score: {cyberScore}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Background Protection</span>
                <div className="flex items-center text-green-600">
                  <Eye className="w-4 h-4 mr-1" />
                  Active
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Alerts</span>
                <span className="text-gray-500">Emergency Only</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Scan</span>
                <span className="text-gray-500">2 min ago</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <ModeSelector 
                currentMode={mode} 
                onModeChange={setMode}
                className="w-full justify-center"
              />
            </div>
          </CardContent>
        </Card>
        
        <p className="text-xs text-gray-400 mt-4">
          HAVEN continues to protect your family in the background
        </p>
      </div>
    </div>
  )
}