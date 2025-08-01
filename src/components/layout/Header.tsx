import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { HavenBrand } from '../ui/HavenLogo'
import { ModernIcon, ModernIconContainer } from '../ui/ModernIcon'


export function Header({ guardian }) {
  const safetyScore = 78
  const householdName = "The Johnson Family"
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Work'
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Household info */}
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{householdName}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <ModernIcon type="shield-check" size="sm" color="primary" />
              <span>Protected by {guardian?.name || 'HAVEN'}</span>
            </div>
          </div>
          
          {/* Safety Score */}
          <div className="flex items-center space-x-4 bg-gray-50 rounded-lg px-4 py-2">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(safetyScore)}`}>
                {safetyScore}
              </div>
              <div className="text-xs text-gray-500">Safety Score</div>
            </div>
            <div className="flex items-center space-x-1">
              <ModernIcon type="trending-up" size="sm" color="success" animated />
              <Badge variant="outline" className="text-xs">
                {getScoreLabel(safetyScore)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <ModernIcon type="bell-ring" size="md" color="default" animated />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">2</span>
            </div>
          </Button>

          {/* Guardian Avatar */}
          {guardian && (
            <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2">
              <span className="text-2xl">{guardian.emoji}</span>
              <div className="text-sm">
                <div className="font-medium">{guardian.name}</div>
                <div className="text-gray-500">Online</div>
              </div>
            </div>
          )}

          {/* User Menu */}
          <Button variant="ghost" size="sm">
            <ModernIcon type="user" size="md" color="default" animated />
          </Button>
        </div>
      </div>
    </header>
  )
}