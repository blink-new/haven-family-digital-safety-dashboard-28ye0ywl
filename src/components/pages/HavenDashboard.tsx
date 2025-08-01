import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  Shield, 
  AlertTriangle, 
  Mail, 
  Smartphone, 
  Wifi, 
  MessageCircle,
  Clock,
  Users,
  Settings,
  Home,
  Bell,
  User,
  ChevronRight,
  Monitor,
  Tablet,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react'

const HavenDashboard = () => {
  const [activeTab, setActiveTab] = useState('Home')

  // Mock data for the dashboard
  const householdRiskScore = 74
  const alerts = [
    {
      id: 1,
      icon: <Mail className="h-5 w-5" />,
      title: "Phishing email detected",
      time: "2 hours ago",
      severity: "high"
    },
    {
      id: 2,
      icon: <Smartphone className="h-5 w-5" />,
      title: "Risky app installed on Emma's phone",
      time: "5 hours ago",
      severity: "medium"
    },
    {
      id: 3,
      icon: <Wifi className="h-5 w-5" />,
      title: "Unsecured Wi-Fi connection",
      time: "1 day ago",
      severity: "low"
    }
  ]

  const familyMembers = [
    {
      id: 1,
      name: "Sarah",
      photo: "/api/placeholder/40/40",
      devices: 3,
      riskLevel: "Low"
    },
    {
      id: 2,
      name: "Mike",
      photo: "/api/placeholder/40/40",
      devices: 2,
      riskLevel: "Medium"
    },
    {
      id: 3,
      name: "Emma",
      photo: "/api/placeholder/40/40",
      devices: 4,
      riskLevel: "High"
    },
    {
      id: 4,
      name: "Jake",
      photo: "/api/placeholder/40/40",
      devices: 2,
      riskLevel: "Low"
    }
  ]

  const digitalServices = [
    { name: "Netflix", status: "Secure" },
    { name: "Alexa", status: "Risky" },
    { name: "TikTok", status: "Unknown" },
    { name: "Gmail", status: "Secure" },
    { name: "Instagram", status: "Risky" },
    { name: "Spotify", status: "Secure" }
  ]

  const quickSuggestions = [
    "Update antivirus software",
    "Set screen time limits",
    "Review app permissions",
    "Enable two-factor authentication"
  ]

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getServiceStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'secure': return 'bg-green-100 text-green-800'
      case 'risky': return 'bg-red-100 text-red-800'
      case 'unknown': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getServiceStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'secure': return <CheckCircle className="h-4 w-4" />
      case 'risky': return <XCircle className="h-4 w-4" />
      case 'unknown': return <HelpCircle className="h-4 w-4" />
      default: return <HelpCircle className="h-4 w-4" />
    }
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Haven</h1>
              <p className="text-sm text-gray-600">Your Family's Digital Safety Dashboard</p>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {['Home', 'Alerts', 'Profiles', 'Settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab === 'Home' && <Home className="h-4 w-4 mr-2" />}
                  {tab === 'Alerts' && <Bell className="h-4 w-4 mr-2" />}
                  {tab === 'Profiles' && <Users className="h-4 w-4 mr-2" />}
                  {tab === 'Settings' && <Settings className="h-4 w-4 mr-2" />}
                  {tab}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Dashboard Panel (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Household Risk Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Household Risk Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-4xl font-bold ${getRiskColor(householdRiskScore)}`}>
                      {householdRiskScore}/100
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {householdRiskScore >= 80 ? 'Excellent' : 
                       householdRiskScore >= 60 ? 'Good' : 'Needs Attention'}
                    </p>
                  </div>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getRiskColor(householdRiskScore)}`}>
                    <Shield className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Latest Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Latest Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border-l-4 bg-white rounded-lg shadow-sm ${getAlertSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-600">
                            {alert.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{alert.title}</h4>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {alert.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Ignore
                          </Button>
                          <Button size="sm">
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Panel (1/3 width) */}
          <div className="space-y-6">
            
            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Ask Haven
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    placeholder="Type your question here..."
                    className="w-full"
                  />
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Example prompts:</p>
                    <div className="space-y-1">
                      <button className="text-xs text-blue-600 hover:text-blue-800 block">
                        "Is this app safe?"
                      </button>
                      <button className="text-xs text-blue-600 hover:text-blue-800 block">
                        "How can I improve our score?"
                      </button>
                      <button className="text-xs text-blue-600 hover:text-blue-800 block">
                        "Set up parental controls"
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 cursor-pointer transition-colors"
                    >
                      <p className="text-sm text-blue-800">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Report Callout */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-purple-900">Weekly Digital Report Ready</h3>
                    <p className="text-sm text-purple-700 mt-1">See your family's progress</p>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    View Report
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lower Panel */}
        <div className="mt-8 space-y-6">
          
          {/* Family Profiles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Family Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.photo} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Monitor className="h-3 w-3 mr-1" />
                          {member.devices} devices
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge className={getRiskLevelColor(member.riskLevel)}>
                        {member.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Connected Digital Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Connected Digital Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {digitalServices.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer text-center"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{service.name.charAt(0)}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm">{service.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Badge className={`${getServiceStatusColor(service.status)} text-xs`}>
                          <span className="flex items-center space-x-1">
                            {getServiceStatusIcon(service.status)}
                            <span>{service.status}</span>
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HavenDashboard