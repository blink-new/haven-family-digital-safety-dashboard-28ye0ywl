import React, { useState } from 'react'
import { 
  Clock, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Wifi,
  Smartphone,
  Tv,
  Lock,
  Eye,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ActivityItem {
  id: string
  time: string
  event: string
  type: 'info' | 'warning' | 'alert' | 'success'
  icon: React.ComponentType<any>
  color: string
  device?: string
  user?: string
  details?: string
}

const activityData: ActivityItem[] = [
  {
    id: '1',
    time: '2 hours ago',
    event: 'Netflix access from new device',
    type: 'info',
    icon: Tv,
    color: 'text-blue-600',
    device: 'Living Room TV',
    user: 'Emma',
    details: 'New Samsung TV detected and verified'
  },
  {
    id: '2',
    time: '4 hours ago',
    event: 'Screen time limit reached',
    type: 'warning',
    icon: Smartphone,
    color: 'text-yellow-600',
    device: 'iPhone 13',
    user: 'Emma',
    details: '4 hours of screen time reached for today'
  },
  {
    id: '3',
    time: '6 hours ago',
    event: 'Unknown login attempt blocked',
    type: 'alert',
    icon: Shield,
    color: 'text-red-600',
    device: 'Gmail Account',
    user: 'Sarah',
    details: 'Login attempt from suspicious IP address'
  },
  {
    id: '4',
    time: '8 hours ago',
    event: 'Password updated successfully',
    type: 'success',
    icon: Lock,
    color: 'text-green-600',
    device: 'PlayStation Network',
    user: 'Alex',
    details: 'Strong password created and saved'
  },
  {
    id: '5',
    time: '1 day ago',
    event: 'Smart TV security scan completed',
    type: 'success',
    icon: CheckCircle,
    color: 'text-green-600',
    device: 'Living Room TV',
    details: 'All security checks passed'
  },
  {
    id: '6',
    time: '1 day ago',
    event: 'New device connected to WiFi',
    type: 'info',
    icon: Wifi,
    color: 'text-blue-600',
    device: 'Echo Dot',
    details: 'Kitchen Alexa connected and configured'
  },
  {
    id: '7',
    time: '2 days ago',
    event: 'Privacy settings updated',
    type: 'success',
    icon: Eye,
    color: 'text-green-600',
    device: 'Instagram',
    user: 'Emma',
    details: 'Account set to private, location sharing disabled'
  }
]

export function ActivityTimeline() {
  const [filter, setFilter] = useState('all')
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const filteredActivity = activityData.filter(item => {
    if (filter === 'all') return true
    return item.type === filter
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'alert':
        return 'bg-red-100 text-red-800'
      case 'info':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'success':
        return 'Success'
      case 'warning':
        return 'Warning'
      case 'alert':
        return 'Alert'
      case 'info':
        return 'Info'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="alert">Alerts</SelectItem>
              <SelectItem value="warning">Warnings</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>Latest security events and notifications</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredActivity.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline line */}
              {index < filteredActivity.length - 1 && (
                <div className="absolute left-6 top-12 w-px h-8 bg-slate-200" />
              )}
              
              <div className="flex items-start gap-4 group">
                {/* Icon */}
                <div className={`p-2 rounded-full bg-white border-2 border-slate-200 ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">
                        {activity.event}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-slate-500">{activity.time}</p>
                        {activity.device && (
                          <>
                            <span className="text-xs text-slate-300">•</span>
                            <p className="text-xs text-slate-500">{activity.device}</p>
                          </>
                        )}
                        {activity.user && (
                          <>
                            <span className="text-xs text-slate-300">•</span>
                            <p className="text-xs text-slate-500">{activity.user}</p>
                          </>
                        )}
                      </div>
                      
                      {/* Expandable details */}
                      {showDetails === activity.id && activity.details && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-700">{activity.details}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(activity.type)}>
                        {getTypeLabel(activity.type)}
                      </Badge>
                      {activity.details && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setShowDetails(
                            showDetails === activity.id ? null : activity.id
                          )}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100">
          <Button variant="outline" className="w-full">
            View Complete Activity Log
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}