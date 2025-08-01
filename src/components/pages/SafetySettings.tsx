import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { Settings, Shield, Clock, Lock, Eye, Smartphone, Wifi, Users } from 'lucide-react'

export function SafetySettings({ guardian }) {
  const [settings, setSettings] = useState({
    lateNightLimits: true,
    bankingExtraChecks: true,
    appPermissionHelp: true,
    autoUpdates: true,
    socialMediaMonitoring: false,
    guestNetworkIsolation: true,
    passwordStrengthChecks: true,
    privacyScanning: true
  })

  const [appliedActions] = useState([
    {
      id: 1,
      title: 'Enabled two-factor auth on Gmail',
      description: 'Added extra security to your main email account',
      category: 'Security',
      date: 'Yesterday',
      status: 'active',
      emoji: '🔐'
    },
    {
      id: 2,
      title: 'Set screen time limits for Emma',
      description: 'TikTok limited to 1 hour on school nights',
      category: 'Parental Controls',
      date: '2 days ago',
      status: 'active',
      emoji: '⏰'
    },
    {
      id: 3,
      title: 'Updated smart TV security',
      description: 'Installed latest firmware and disabled unnecessary features',
      category: 'Device Security',
      date: '1 week ago',
      status: 'active',
      emoji: '📺'
    },
    {
      id: 4,
      title: 'Blocked suspicious website',
      description: 'Prevented access to a potentially harmful site',
      category: 'Web Protection',
      date: '1 week ago',
      status: 'active',
      emoji: '🚫'
    }
  ])

  const [pendingActions] = useState([
    {
      id: 1,
      title: 'Update router password',
      description: 'Your WiFi password could be stronger',
      category: 'Network Security',
      priority: 'medium',
      emoji: '📶'
    },
    {
      id: 2,
      title: 'Review app permissions',
      description: 'Some apps have access to more data than needed',
      category: 'Privacy',
      priority: 'low',
      emoji: '🔍'
    }
  ])

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const getGuardianMessage = () => {
    return "Here's what I've been up to and what I can help you with. You're in control of everything! 🎛️"
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Guardian Message */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">{guardian.emoji}</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 mb-2">{guardian.name} says:</div>
              <div className="text-gray-700">{getGuardianMessage()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>My Safety Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Time & Usage</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Limit late-night usage</div>
                      <div className="text-xs text-gray-500">Reduce screen time after 9 PM</div>
                    </div>
                    <Switch
                      checked={settings.lateNightLimits}
                      onCheckedChange={() => handleSettingChange('lateNightLimits')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Social media monitoring</div>
                      <div className="text-xs text-gray-500">Watch for concerning content</div>
                    </div>
                    <Switch
                      checked={settings.socialMediaMonitoring}
                      onCheckedChange={() => handleSettingChange('socialMediaMonitoring')}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Security</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Extra login checks for banking</div>
                      <div className="text-xs text-gray-500">Add security for financial apps</div>
                    </div>
                    <Switch
                      checked={settings.bankingExtraChecks}
                      onCheckedChange={() => handleSettingChange('bankingExtraChecks')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Password strength checks</div>
                      <div className="text-xs text-gray-500">Alert me about weak passwords</div>
                    </div>
                    <Switch
                      checked={settings.passwordStrengthChecks}
                      onCheckedChange={() => handleSettingChange('passwordStrengthChecks')}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Apps & Permissions</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Help me with new app permissions</div>
                      <div className="text-xs text-gray-500">Review what apps can access</div>
                    </div>
                    <Switch
                      checked={settings.appPermissionHelp}
                      onCheckedChange={() => handleSettingChange('appPermissionHelp')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Auto-update apps and devices</div>
                      <div className="text-xs text-gray-500">Keep everything current</div>
                    </div>
                    <Switch
                      checked={settings.autoUpdates}
                      onCheckedChange={() => handleSettingChange('autoUpdates')}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Privacy</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Privacy scanning</div>
                      <div className="text-xs text-gray-500">Check what data is being shared</div>
                    </div>
                    <Switch
                      checked={settings.privacyScanning}
                      onCheckedChange={() => handleSettingChange('privacyScanning')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Guest network isolation</div>
                      <div className="text-xs text-gray-500">Keep visitors separate</div>
                    </div>
                    <Switch
                      checked={settings.guestNetworkIsolation}
                      onCheckedChange={() => handleSettingChange('guestNetworkIsolation')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions I've Taken */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Actions I've Taken</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appliedActions.map((action) => (
                <div key={action.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{action.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-gray-600 text-xs mt-1">{action.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {action.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{action.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Waiting for Your OK</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingActions.map((action) => (
                <div key={action.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{action.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-gray-600 text-xs mt-1">{action.description}</div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge className={`text-xs ${getPriorityColor(action.priority)}`}>
                          {action.priority} priority
                        </Badge>
                        <div className="space-x-2">
                          <Button size="sm" className="text-xs">
                            Do It
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Skip
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}