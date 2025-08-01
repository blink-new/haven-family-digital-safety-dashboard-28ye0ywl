import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Switch } from '../ui/switch'
import { Progress } from '../ui/progress'
import { 
  Home, 
  Users, 
  Shield, 
  Plus, 
  Send, 
  Settings, 
  Crown, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Mail,
  Phone,
  Copy,
  Trash2
} from 'lucide-react'
import { useCurrency } from '../../hooks/useCurrency'

interface Household {
  id: string
  name: string
  adminName: string
  cyberScore: number
  members: number
  devices: number
  joinedDate: string
  status: 'active' | 'pending' | 'inactive'
  isAdmin: boolean
  privacySettings: {
    shareScore: boolean
    shareAlerts: boolean
    shareInsights: boolean
    allowNudges: boolean
  }
  lastActivity: string
  riskLevel: 'low' | 'medium' | 'high'
}

interface NestInvite {
  id: string
  email: string
  householdName: string
  status: 'pending' | 'accepted' | 'declined'
  sentDate: string
  expiresDate: string
}

interface SafetyNudge {
  id: string
  fromHousehold: string
  toHousehold: string
  message: string
  type: 'suggestion' | 'alert' | 'support'
  sentDate: string
  status: 'sent' | 'read' | 'acted'
}

export default function NestManager() {
  const { formatPrice } = useCurrency()
  const [activeTab, setActiveTab] = useState('overview')
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showNudgeDialog, setShowNudgeDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteHouseholdName, setInviteHouseholdName] = useState('')
  const [nudgeMessage, setNudgeMessage] = useState('')
  const [selectedNudgeType, setSelectedNudgeType] = useState<'suggestion' | 'alert' | 'support'>('suggestion')
  const [selectedHousehold, setSelectedHousehold] = useState<string>('')

  // Mock data - in real app this would come from API
  const [households, setHouseholds] = useState<Household[]>([
    {
      id: 'h1',
      name: 'The Johnson Family',
      adminName: 'Sarah Johnson',
      cyberScore: 78,
      members: 4,
      devices: 12,
      joinedDate: '2024-01-15',
      status: 'active',
      isAdmin: true,
      privacySettings: {
        shareScore: true,
        shareAlerts: true,
        shareInsights: true,
        allowNudges: true
      },
      lastActivity: '2 hours ago',
      riskLevel: 'low'
    },
    {
      id: 'h2',
      name: 'The Smith Household',
      adminName: 'Mike Smith',
      cyberScore: 65,
      members: 3,
      devices: 8,
      joinedDate: '2024-01-20',
      status: 'active',
      isAdmin: false,
      privacySettings: {
        shareScore: true,
        shareAlerts: false,
        shareInsights: true,
        allowNudges: true
      },
      lastActivity: '1 day ago',
      riskLevel: 'medium'
    },
    {
      id: 'h3',
      name: 'The Davis Family',
      adminName: 'Emma Davis',
      cyberScore: 82,
      members: 5,
      devices: 15,
      joinedDate: '2024-02-01',
      status: 'active',
      isAdmin: false,
      privacySettings: {
        shareScore: true,
        shareAlerts: true,
        shareInsights: false,
        allowNudges: false
      },
      lastActivity: '3 hours ago',
      riskLevel: 'low'
    }
  ])

  const [pendingInvites, setPendingInvites] = useState<NestInvite[]>([
    {
      id: 'inv1',
      email: 'wilson@example.com',
      householdName: 'The Wilson Family',
      status: 'pending',
      sentDate: '2024-01-25',
      expiresDate: '2024-02-08'
    }
  ])

  const [recentNudges, setRecentNudges] = useState<SafetyNudge[]>([
    {
      id: 'n1',
      fromHousehold: 'The Johnson Family',
      toHousehold: 'The Smith Household',
      message: 'Hey Mike! I noticed you might want to update your router firmware. Happy to help if you need it! 😊',
      type: 'suggestion',
      sentDate: '2024-01-28',
      status: 'read'
    }
  ])

  // Calculate Nest Resilience Score
  const calculateNestScore = () => {
    const activeHouseholds = households.filter(h => h.status === 'active')
    if (activeHouseholds.length === 0) return 0
    
    const totalScore = activeHouseholds.reduce((sum, h) => sum + h.cyberScore, 0)
    const averageScore = totalScore / activeHouseholds.length
    
    // Bonus for collaboration and shared insights
    const collaborationBonus = activeHouseholds.filter(h => 
      h.privacySettings.shareScore && h.privacySettings.shareInsights
    ).length * 2
    
    return Math.min(100, Math.round(averageScore + collaborationBonus))
  }

  // Pricing logic
  const getPricingTier = () => {
    const activeCount = households.filter(h => h.status === 'active').length
    if (activeCount <= 1) return { price: 15, tier: 'Single Home' }
    if (activeCount <= 3) return { price: 25, tier: 'Small Nest (up to 3 homes)' }
    return { price: 35, tier: 'Large Nest (up to 5 homes)' }
  }

  const handleSendInvite = () => {
    if (!inviteEmail || !inviteHouseholdName) return
    
    const newInvite: NestInvite = {
      id: `inv${Date.now()}`,
      email: inviteEmail,
      householdName: inviteHouseholdName,
      status: 'pending',
      sentDate: new Date().toISOString().split('T')[0],
      expiresDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    
    setPendingInvites([...pendingInvites, newInvite])
    setInviteEmail('')
    setInviteHouseholdName('')
    setShowInviteDialog(false)
  }

  const handleSendNudge = () => {
    if (!nudgeMessage || !selectedHousehold) return
    
    const newNudge: SafetyNudge = {
      id: `n${Date.now()}`,
      fromHousehold: 'The Johnson Family',
      toHousehold: selectedHousehold,
      message: nudgeMessage,
      type: selectedNudgeType,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'sent'
    }
    
    setRecentNudges([newNudge, ...recentNudges])
    setNudgeMessage('')
    setSelectedHousehold('')
    setShowNudgeDialog(false)
  }

  const nestScore = calculateNestScore()
  const pricingTier = getPricingTier()
  const activeHouseholds = households.filter(h => h.status === 'active')

  return (
    <div className="space-y-6">
      {/* Nest Overview Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <Home className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Your Safety Nest</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with family and friends to create a stronger safety network. Share insights, support each other, and build collective digital resilience.
        </p>
      </div>

      {/* Nest Resilience Score */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-3xl font-bold text-blue-900">{nestScore}/100</h2>
                <p className="text-blue-700 font-medium">Nest Resilience Score</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span>{activeHouseholds.length} Connected Homes</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{activeHouseholds.reduce((sum, h) => sum + h.members, 0)} Protected People</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>{activeHouseholds.reduce((sum, h) => sum + h.devices, 0)} Secured Devices</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Info */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-orange-900">{pricingTier.tier}</h3>
              <p className="text-sm text-orange-700">Current plan</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-900">{formatPrice(pricingTier.price)}</div>
              <p className="text-sm text-orange-700">per month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="households">Homes</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed border-2 border-blue-300">
                  <CardContent className="p-6 text-center">
                    <Plus className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-900">Invite Another Home</h3>
                    <p className="text-sm text-blue-700">Connect with family or friends</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite a Household to Your Nest</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="friend@example.com"
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Household Name</label>
                    <Input
                      value={inviteHouseholdName}
                      onChange={(e) => setInviteHouseholdName(e.target.value)}
                      placeholder="The Wilson Family"
                    />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      They'll receive an invitation to join your safety nest. They can choose what information to share and can leave at any time.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSendInvite} className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </Button>
                    <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showNudgeDialog} onOpenChange={setShowNudgeDialog}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Send className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-900">Send Safety Nudge</h3>
                    <p className="text-sm text-green-700">Share a helpful suggestion</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send a Safety Nudge</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">To Household</label>
                    <select
                      value={selectedHousehold}
                      onChange={(e) => setSelectedHousehold(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select a household...</option>
                      {households.filter(h => !h.isAdmin && h.status === 'active' && h.privacySettings.allowNudges).map(h => (
                        <option key={h.id} value={h.name}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <div className="flex gap-2 mt-1">
                      {[
                        { value: 'suggestion', label: 'Suggestion', color: 'blue' },
                        { value: 'alert', label: 'Alert', color: 'orange' },
                        { value: 'support', label: 'Support', color: 'green' }
                      ].map(type => (
                        <Button
                          key={type.value}
                          variant={selectedNudgeType === type.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedNudgeType(type.value as any)}
                        >
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      value={nudgeMessage}
                      onChange={(e) => setNudgeMessage(e.target.value)}
                      placeholder="Hey! I noticed you might want to check..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSendNudge} className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Send Nudge
                    </Button>
                    <Button variant="outline" onClick={() => setShowNudgeDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Nest Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNudges.slice(0, 3).map(nudge => (
                  <div key={nudge.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-1 rounded-full ${
                      nudge.type === 'suggestion' ? 'bg-blue-100' :
                      nudge.type === 'alert' ? 'bg-orange-100' : 'bg-green-100'
                    }`}>
                      <Send className={`w-3 h-3 ${
                        nudge.type === 'suggestion' ? 'text-blue-600' :
                        nudge.type === 'alert' ? 'text-orange-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {nudge.fromHousehold} → {nudge.toHousehold}
                      </p>
                      <p className="text-sm text-gray-600">{nudge.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{nudge.sentDate}</p>
                    </div>
                    <Badge variant={nudge.status === 'read' ? 'default' : 'secondary'}>
                      {nudge.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Households Tab */}
        <TabsContent value="households" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {households.map(household => (
              <Card key={household.id} className={`${
                household.isAdmin ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${
                        household.riskLevel === 'low' ? 'bg-green-100' :
                        household.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <Home className={`w-4 h-4 ${
                          household.riskLevel === 'low' ? 'text-green-600' :
                          household.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                      </div>
                      {household.isAdmin && (
                        <Crown className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <Badge variant={household.status === 'active' ? 'default' : 'secondary'}>
                      {household.status}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{household.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{household.adminName}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Safety Score</span>
                      <span className="font-semibold">{household.cyberScore}/100</span>
                    </div>
                    <Progress value={household.cyberScore} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">People</p>
                      <p className="font-medium">{household.members}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Devices</p>
                      <p className="font-medium">{household.devices}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Last active: {household.lastActivity}</p>
                  </div>
                  
                  {/* Privacy indicators */}
                  <div className="flex gap-1 mt-2">
                    {household.privacySettings.shareScore && (
                      <Badge variant="outline" className="text-xs">Score</Badge>
                    )}
                    {household.privacySettings.shareAlerts && (
                      <Badge variant="outline" className="text-xs">Alerts</Badge>
                    )}
                    {household.privacySettings.shareInsights && (
                      <Badge variant="outline" className="text-xs">Insights</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pending Invites */}
          {pendingInvites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingInvites.map(invite => (
                    <div key={invite.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">{invite.householdName}</p>
                        <p className="text-sm text-gray-600">{invite.email}</p>
                        <p className="text-xs text-gray-500">Sent: {invite.sentDate} • Expires: {invite.expiresDate}</p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shared Risks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Shared Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="font-medium text-orange-900">Outdated Router Firmware</p>
                    <p className="text-sm text-orange-700">2 households affected</p>
                    <p className="text-xs text-orange-600 mt-1">The Smith Household, The Wilson Family</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-yellow-900">Weak Password Patterns</p>
                    <p className="text-sm text-yellow-700">1 household affected</p>
                    <p className="text-xs text-yellow-600 mt-1">The Smith Household</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">Family Screen Time Success</p>
                    <p className="text-sm text-green-700">The Davis Family improved by 15%</p>
                    <p className="text-xs text-green-600 mt-1">Share their approach with others?</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Security Tool Optimization</p>
                    <p className="text-sm text-blue-700">Potential £8/month savings across nest</p>
                    <p className="text-xs text-blue-600 mt-1">Consolidate duplicate services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nest Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Nest Safety Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">+12%</div>
                  <p className="text-sm text-green-700">Average Score Improvement</p>
                  <p className="text-xs text-green-600 mt-1">Last 30 days</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">8</div>
                  <p className="text-sm text-blue-700">Safety Nudges Sent</p>
                  <p className="text-xs text-blue-600 mt-1">This month</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">94%</div>
                  <p className="text-sm text-purple-700">Collaboration Rate</p>
                  <p className="text-xs text-purple-600 mt-1">Households sharing insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Sharing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Share My Safety Score</p>
                    <p className="text-sm text-gray-600">Let other households see your cyber risk score</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Share Security Alerts</p>
                    <p className="text-sm text-gray-600">Allow others to see your security alerts for collaborative help</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Share Insights & Tips</p>
                    <p className="text-sm text-gray-600">Share successful security practices with the nest</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Safety Nudges</p>
                    <p className="text-sm text-gray-600">Let other households send you helpful suggestions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nest Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Leave Safety Nest</h3>
                <p className="text-sm text-red-700 mb-3">
                  You can leave this safety nest at any time. Your data will remain private and you'll stop sharing information with other households.
                </p>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Leave Nest
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}