import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { 
  Bell, 
  HelpCircle, 
  User, 
  ChevronDown, 
  ChevronRight,
  Search,
  Shield,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react'

const SimplifiedDashboard = () => {
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [familyOpen, setFamilyOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)

  // Mock data
  const confidenceScore = 82
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-amber-50 border-amber-200'
    return 'bg-red-50 border-red-200'
  }

  const alerts = [
    {
      id: 1,
      title: "Unsecured Wi-Fi detected",
      description: "Your home network doesn't have WPA3 security",
      severity: "medium",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Unused risky app found",
      description: "TikTok hasn't been used in 30 days but has access to camera",
      severity: "low",
      time: "1 day ago"
    },
    {
      id: 3,
      title: "Password reuse detected",
      description: "Same password used for Netflix and Gmail",
      severity: "high",
      time: "3 days ago"
    }
  ]

  const familyMembers = [
    {
      id: 1,
      name: "Sarah",
      avatar: "👩",
      risk: "low",
      devices: 3,
      apps: ["Instagram", "Spotify", "Gmail"],
      screenTime: "2h 15m today",
      lastActivity: "Browsing news articles"
    },
    {
      id: 2,
      name: "Mike",
      avatar: "👨",
      risk: "medium",
      devices: 4,
      apps: ["LinkedIn", "Slack", "Banking"],
      screenTime: "4h 30m today",
      lastActivity: "Video conference"
    },
    {
      id: 3,
      name: "Emma",
      avatar: "👧",
      risk: "low",
      devices: 2,
      apps: ["YouTube Kids", "Duolingo", "Minecraft"],
      screenTime: "1h 45m today",
      lastActivity: "Educational videos"
    },
    {
      id: 4,
      name: "Alex",
      avatar: "👦",
      risk: "high",
      devices: 3,
      apps: ["TikTok", "Discord", "Roblox"],
      screenTime: "3h 20m today",
      lastActivity: "Gaming with friends"
    }
  ]

  const services = [
    { name: "Netflix", logo: "🎬", status: "good" },
    { name: "Gmail", logo: "📧", status: "medium" },
    { name: "TikTok", logo: "🎵", status: "risk" },
    { name: "Spotify", logo: "🎶", status: "good" },
    { name: "Instagram", logo: "📷", status: "medium" },
    { name: "YouTube", logo: "📺", status: "good" },
    { name: "Discord", logo: "💬", status: "risk" },
    { name: "Roblox", logo: "🎮", status: "medium" },
    { name: "Banking", logo: "🏦", status: "good" },
    { name: "Amazon", logo: "📦", status: "good" },
    { name: "WhatsApp", logo: "💬", status: "good" },
    { name: "Zoom", logo: "📹", status: "good" }
  ]

  const aiPrompts = [
    "Is TikTok safe for my child?",
    "How can I improve our family's digital safety?",
    "What apps should I be worried about?"
  ]

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <span className="text-xs">🟢</span>
      case 'medium':
        return <span className="text-xs">🟠</span>
      case 'high':
        return <span className="text-xs">🔴</span>
      default:
        return <span className="text-xs">⚪</span>
    }
  }

  const getServiceStatus = (status: string) => {
    switch (status) {
      case 'good':
        return <span className="text-xs">🟢</span>
      case 'medium':
        return <span className="text-xs">🟠</span>
      case 'risk':
        return <span className="text-xs">🔴</span>
      default:
        return <span className="text-xs">⚪</span>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">HAVEN</h1>
            <p className="text-sm text-slate-600">Peace of mind for your digital household</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Panel - Digital Confidence Score */}
        <Card className={`${getScoreBg(confidenceScore)} border-2`}>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className={`h-8 w-8 ${getScoreColor(confidenceScore)}`} />
              <h2 className="text-2xl font-semibold text-slate-900">Today's Digital Confidence</h2>
            </div>
            <div className={`text-6xl font-bold ${getScoreColor(confidenceScore)} mb-2`}>
              {confidenceScore}/100
            </div>
            <p className="text-slate-700 mb-6">
              Everything looks good. 1 small thing to check.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
              🔍 View suggestion
            </Button>
          </CardContent>
        </Card>

        {/* Modular Dashboard Sections */}
        <div className="space-y-4">
          {/* Alerts Section */}
          <Card>
            <Collapsible open={alertsOpen} onOpenChange={setAlertsOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔔</span>
                      <CardTitle className="text-lg">Alerts</CardTitle>
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        {alerts.length}
                      </Badge>
                    </div>
                    {alertsOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {alert.severity === 'high' && <span>🔴</span>}
                            {alert.severity === 'medium' && <span>🟠</span>}
                            {alert.severity === 'low' && <span>🟡</span>}
                            <h4 className="font-medium text-slate-900">{alert.title}</h4>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{alert.description}</p>
                          <p className="text-xs text-slate-500">{alert.time}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Resolve
                          </Button>
                          <Button size="sm" variant="outline">
                            Ignore
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Family Overview Section */}
          <Card>
            <Collapsible open={familyOpen} onOpenChange={setFamilyOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👪</span>
                      <CardTitle className="text-lg">Family Overview</CardTitle>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {familyMembers.length} members
                      </Badge>
                    </div>
                    {familyOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedProfile === member.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                        onClick={() => setSelectedProfile(selectedProfile === member.name ? null : member.name)}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{member.avatar}</div>
                          <h4 className="font-medium text-slate-900 mb-1">{member.name}</h4>
                          <div className="flex items-center justify-center gap-1">
                            {getRiskBadge(member.risk)}
                            <span className="text-xs text-slate-600">{member.devices} devices</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Expanded Profile Details */}
                  {selectedProfile && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      {(() => {
                        const member = familyMembers.find(m => m.name === selectedProfile)
                        if (!member) return null
                        return (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-slate-900">{member.name}'s Dashboard</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedProfile(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h5 className="font-medium text-slate-700 mb-2">📱 Apps</h5>
                                <div className="space-y-1">
                                  {member.apps.map((app, idx) => (
                                    <div key={idx} className="text-sm text-slate-600">{app}</div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-slate-700 mb-2">⏰ Screen Time</h5>
                                <p className="text-sm text-slate-600">{member.screenTime}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-slate-700 mb-2">🔍 Last Activity</h5>
                                <p className="text-sm text-slate-600">{member.lastActivity}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Connected Digital Services Section */}
          <Card>
            <Collapsible open={servicesOpen} onOpenChange={setServicesOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📡</span>
                      <CardTitle className="text-lg">Connected Digital Services</CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {services.length} services monitored
                      </Badge>
                    </div>
                    {servicesOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {services.map((service, idx) => (
                      <div key={idx} className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl mb-1">{service.logo}</div>
                        <div className="text-xs font-medium text-slate-700 mb-1">{service.name}</div>
                        <div className="flex justify-center">
                          {getServiceStatus(service.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Ask Haven AI Assistant Section */}
          <Card>
            <Collapsible open={aiOpen} onOpenChange={setAiOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧠</span>
                      <CardTitle className="text-lg">Ask Haven</CardTitle>
                    </div>
                    {aiOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="e.g. Is TikTok safe for my child?"
                        className="pl-10 py-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600 mb-2">Quick questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {aiPrompts.map((prompt, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="text-left h-auto py-2 px-3 whitespace-normal"
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default SimplifiedDashboard