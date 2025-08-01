import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ModernIcon } from '../ui/ModernIcon'

interface StatusUpdate {
  id: string
  type: 'security' | 'activity' | 'alert' | 'success'
  message: string
  timestamp: Date
  member?: string
  device?: string
  action?: string
}

const statusTypes = {
  security: { color: 'bg-blue-100 text-blue-800', icon: 'lock' },
  activity: { color: 'bg-purple-100 text-purple-800', icon: 'smartphone' },
  alert: { color: 'bg-orange-100 text-orange-800', icon: 'warning' },
  success: { color: 'bg-green-100 text-green-800', icon: 'checkCircle' }
}

export function RealTimeStatus() {
  const [updates, setUpdates] = useState<StatusUpdate[]>([])
  const [isLive, setIsLive] = useState(true)

  // Simulate real-time status updates
  useEffect(() => {
    if (!isLive) return

    const generateUpdate = (): StatusUpdate => {
      const updateTypes = [
        {
          type: 'activity' as const,
          messages: [
            'Emma opened Instagram on her iPhone',
            'Jake started playing Minecraft on iPad',
            'Mike checked work email on MacBook',
            'Sarah used banking app on iPhone'
          ]
        },
        {
          type: 'security' as const,
          messages: [
            'Wi-Fi security scan completed - all good!',
            'Password strength check passed for Netflix',
            'Two-factor authentication enabled for Gmail',
            'Device update installed on Samsung TV'
          ]
        },
        {
          type: 'success' as const,
          messages: [
            'Screen time limit reminder sent to Emma',
            'Parental controls updated successfully',
            'Backup completed for family photos',
            'Security score improved to 85/100'
          ]
        },
        {
          type: 'alert' as const,
          messages: [
            'New app installed: Discord (needs review)',
            'Unusual login detected on Netflix account',
            'Smart TV firmware update available',
            'High data usage detected on Emma\'s device'
          ]
        }
      ]

      const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)]
      const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)]

      return {
        id: Date.now().toString(),
        type: randomType.type,
        message: randomMessage,
        timestamp: new Date(),
        member: ['Emma', 'Jake', 'Mike', 'Sarah'][Math.floor(Math.random() * 4)],
        device: ['iPhone', 'iPad', 'MacBook', 'Samsung TV'][Math.floor(Math.random() * 4)]
      }
    }

    // Add initial updates
    if (updates.length === 0) {
      const initialUpdates = Array.from({ length: 3 }, generateUpdate)
      setUpdates(initialUpdates)
    }

    const interval = setInterval(() => {
      const newUpdate = generateUpdate()
      setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]) // Keep only last 10 updates
    }, 8000) // New update every 8 seconds

    return () => clearInterval(interval)
  }, [isLive, updates.length])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <h3 className="font-semibold text-gray-800">Live Activity Feed</h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsLive(!isLive)}
            className="text-xs"
          >
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {updates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-2">
                <ModernIcon name="wifi" size="xl" className="text-gray-400" />
              </div>
              <div className="text-sm">Waiting for activity...</div>
            </div>
          ) : (
            updates.map((update, index) => (
              <div
                key={update.id}
                className={`flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm animate-fade-in-up hover:shadow-md transition-all duration-300`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <ModernIcon name={statusTypes[update.type].icon} size="md" className="text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={`${statusTypes[update.type].color} text-xs`}>
                      {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatTime(update.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {update.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {updates.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{updates.length} recent updates</span>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-6 px-2"
                onClick={() => setUpdates([])}
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}