import React, { useState } from 'react'
import { 
  Bell, 
  X, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Settings,
  Check
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'alert' | 'success'
  time: string
  read: boolean
  actionable?: boolean
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'Security Alert',
    message: 'Unknown login attempt blocked on Sarah\'s Gmail account',
    type: 'alert',
    time: '2 minutes ago',
    read: false,
    actionable: true
  },
  {
    id: '2',
    title: 'Screen Time Limit',
    message: 'Emma has reached her daily screen time limit of 4 hours',
    type: 'warning',
    time: '1 hour ago',
    read: false,
    actionable: true
  },
  {
    id: '3',
    title: 'Security Scan Complete',
    message: 'Weekly security scan completed. 2 issues found and resolved',
    type: 'success',
    time: '3 hours ago',
    read: true
  },
  {
    id: '4',
    title: 'New Device Connected',
    message: 'Kitchen Echo Dot has been added to your network',
    type: 'info',
    time: '1 day ago',
    read: true
  },
  {
    id: '5',
    title: 'Password Update Required',
    message: 'PlayStation Network password hasn\'t been changed in 6 months',
    type: 'warning',
    time: '2 days ago',
    read: false,
    actionable: true
  }
]

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notificationList, setNotificationList] = useState(notifications)
  
  const unreadCount = notificationList.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <Shield className="w-4 h-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />
      default:
        return <Info className="w-4 h-4 text-slate-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'border-l-red-500 bg-red-50'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'success':
        return 'border-l-green-500 bg-green-50'
      case 'info':
        return 'border-l-blue-500 bg-blue-50'
      default:
        return 'border-l-slate-500 bg-slate-50'
    }
  }

  const markAsRead = (id: string) => {
    setNotificationList(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const dismissNotification = (id: string) => {
    setNotificationList(prev => prev.filter(n => n.id !== id))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-start justify-end p-4">
      <Card className="w-96 max-h-[80vh] shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 px-2 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
          {unreadCount > 0 && (
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs h-6"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all as read
              </Button>
            </div>
          )}
        </CardHeader>
        
        <ScrollArea className="max-h-96">
          <CardContent className="p-0">
            <div className="space-y-1">
              {notificationList.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={`p-4 border-l-4 transition-colors ${
                      getNotificationColor(notification.type)
                    } ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-slate-900' : 'text-slate-600'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className={`text-xs mt-1 ${
                              !notification.read ? 'text-slate-700' : 'text-slate-500'
                            }`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dismissNotification(notification.id)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 text-xs"
                            >
                              Mark as read
                            </Button>
                          )}
                          {notification.actionable && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 text-xs"
                            >
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < notificationList.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
        
        <div className="p-4 border-t border-slate-200">
          <Button variant="outline" className="w-full" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Notification Settings
          </Button>
        </div>
      </Card>
    </div>
  )
}