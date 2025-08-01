import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, 
  Shield, 
  CheckCircle, 
  Clock, 
  X, 
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Smartphone,
  Monitor,
  Wifi,
  Lock,
  Eye,
  Timer,
  Users
} from 'lucide-react'

interface Control {
  id: string
  title: string
  description: string
  category: 'security' | 'privacy' | 'parental' | 'device'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'applied' | 'dismissed'
  autoApply: boolean
  device?: string
  impact: string
  scoreImprovement: number
}

interface AutomatedControlsProps {
  scanResults?: any[]
}

export function AutomatedControls({ scanResults = [] }: AutomatedControlsProps) {
  const [controls, setControls] = useState<Control[]>([
    {
      id: '1',
      title: 'Enable MFA on Gmail',
      description: 'Add two-factor authentication to protect family email accounts',
      category: 'security',
      priority: 'high',
      status: 'pending',
      autoApply: false,
      device: 'All devices',
      impact: 'Prevents unauthorized access to email accounts',
      scoreImprovement: 25
    },
    {
      id: '2',
      title: 'Limit YouTube screen time to 2 hrs/day',
      description: 'Set daily viewing limits for children\'s YouTube access',
      category: 'parental',
      priority: 'medium',
      status: 'pending',
      autoApply: true,
      device: 'Kids\' iPads',
      impact: 'Promotes healthy digital habits for children',
      scoreImprovement: 15
    },
    {
      id: '3',
      title: 'Block access to specific apps on children\'s devices',
      description: 'Restrict access to age-inappropriate applications',
      category: 'parental',
      priority: 'high',
      status: 'pending',
      autoApply: false,
      device: 'Kids\' devices',
      impact: 'Ensures age-appropriate content access',
      scoreImprovement: 20
    },
    {
      id: '4',
      title: 'Auto-update smart devices overnight',
      description: 'Enable automatic security updates for all smart home devices',
      category: 'device',
      priority: 'medium',
      status: 'applied',
      autoApply: true,
      device: 'Smart home devices',
      impact: 'Keeps devices protected with latest security patches',
      scoreImprovement: 18
    },
    {
      id: '5',
      title: 'Require Face ID to open financial apps',
      description: 'Add biometric authentication to banking and payment apps',
      category: 'security',
      priority: 'high',
      status: 'pending',
      autoApply: false,
      device: 'iPhones & iPads',
      impact: 'Protects financial information from unauthorized access',
      scoreImprovement: 30
    },
    {
      id: '6',
      title: 'Enable private browsing by default',
      description: 'Set browsers to use private mode to reduce tracking',
      category: 'privacy',
      priority: 'low',
      status: 'dismissed',
      autoApply: true,
      device: 'All browsers',
      impact: 'Reduces online tracking and improves privacy',
      scoreImprovement: 10
    }
  ])

  const [activeTab, setActiveTab] = useState('recommended')

  const applyControl = (controlId: string) => {
    setControls(prev => prev.map(control => 
      control.id === controlId 
        ? { ...control, status: 'applied' }
        : control
    ))
  }

  const dismissControl = (controlId: string) => {
    setControls(prev => prev.map(control => 
      control.id === controlId 
        ? { ...control, status: 'dismissed' }
        : control
    ))
  }

  const toggleAutoApply = (controlId: string) => {
    setControls(prev => prev.map(control => 
      control.id === controlId 
        ? { ...control, autoApply: !control.autoApply }
        : control
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'dismissed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-4 w-4" />
      case 'privacy': return <Eye className="h-4 w-4" />
      case 'parental': return <Users className="h-4 w-4" />
      case 'device': return <Monitor className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const pendingControls = controls.filter(c => c.status === 'pending')
  const appliedControls = controls.filter(c => c.status === 'applied')
  const dismissedControls = controls.filter(c => c.status === 'dismissed')

  const totalScoreImprovement = pendingControls.reduce((sum, control) => sum + control.scoreImprovement, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Automated Controls Engine
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Based on your risk profile and usage, I've prepared actions to help keep your family safer.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommended">
                Recommended ({pendingControls.length})
              </TabsTrigger>
              <TabsTrigger value="applied">
                Applied ({appliedControls.length})
              </TabsTrigger>
              <TabsTrigger value="centre">
                Control Centre
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="space-y-4">
              {pendingControls.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-900">Potential Score Improvement</h4>
                        <p className="text-sm text-blue-700">
                          Applying all recommended controls could improve your score by up to {totalScoreImprovement} points
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        +{totalScoreImprovement}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {pendingControls.map((control) => (
                  <Card key={control.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getCategoryIcon(control.category)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{control.title}</h4>
                                <Badge variant={getPriorityColor(control.priority) as any}>
                                  {control.priority} priority
                                </Badge>
                                <Badge variant="outline" className="text-green-600">
                                  +{control.scoreImprovement} points
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {control.description}
                              </p>
                              {control.device && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  Applies to: {control.device}
                                </p>
                              )}
                              <p className="text-sm font-medium text-blue-600">
                                💡 {control.impact}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={control.autoApply}
                              onCheckedChange={() => toggleAutoApply(control.id)}
                            />
                            <span className="text-sm">Auto-apply</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => dismissControl(control.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Dismiss
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => applyControl(control.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {pendingControls.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    No new control recommendations at this time. Run another scan to check for new issues.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="applied" className="space-y-4">
              <div className="space-y-4">
                {appliedControls.map((control) => (
                  <Card key={control.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getCategoryIcon(control.category)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{control.title}</h4>
                              <Badge className={getStatusColor(control.status)}>
                                Applied
                              </Badge>
                              <Badge variant="outline" className="text-green-600">
                                +{control.scoreImprovement} points
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {control.description}
                            </p>
                            {control.device && (
                              <p className="text-xs text-muted-foreground">
                                Applied to: {control.device}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {appliedControls.length === 0 && (
                <div className="text-center py-8">
                  <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No Applied Controls</h3>
                  <p className="text-muted-foreground">
                    Controls you apply will appear here for monitoring and management.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="centre" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Automation Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-apply security controls</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically apply high-priority security fixes
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Parental control automation</p>
                        <p className="text-sm text-muted-foreground">
                          Auto-apply age-appropriate restrictions
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Device update automation</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically update device firmware
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Control Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Controls</span>
                      <span className="font-semibold">{controls.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Applied</span>
                      <span className="font-semibold text-green-600">{appliedControls.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pending</span>
                      <span className="font-semibold text-yellow-600">{pendingControls.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Dismissed</span>
                      <span className="font-semibold text-gray-600">{dismissedControls.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Control Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Auto-update enabled for smart devices</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">MFA setup pending for Gmail accounts</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <X className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Private browsing control dismissed</p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Control
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}