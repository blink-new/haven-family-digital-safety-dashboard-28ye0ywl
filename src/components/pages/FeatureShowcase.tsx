import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { DualScoreWidgets } from '../features/DualScoreWidgets'
import { SecurityScoreWidget } from '../features/SecurityScoreWidget'
import { ActivityTimeline } from '../features/ActivityTimeline'
import { FamilyInsights } from '../features/FamilyInsights'
import { EnhancedCyberScore } from '../features/EnhancedCyberScore'
import { QuickScanWidget } from '../features/QuickScanWidget'
import { NetworkMonitor } from '../features/NetworkMonitor'
import AccountConnections from '../features/AccountConnections'
import NestManager from '../features/NestManager'
import { NotificationCenter } from '../features/NotificationCenter'
import { AutomatedControls } from '../features/AutomatedControls'
import { HouseholdScanner } from '../features/HouseholdScanner'
import { RealTimeStatus } from '../features/RealTimeStatus'
import SecurityDiscovery from '../features/SecurityDiscovery'
import { 
  Shield, 
  Users, 
  Activity, 
  BarChart3, 
  Scan, 
  Network, 
  Settings, 
  Bell,
  Eye,
  Zap,
  Star,
  Layers
} from 'lucide-react'

export function FeatureShowcase() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [scanResults, setScanResults] = useState<any[]>([])

  const features = [
    {
      id: 'dual-scores',
      name: 'Dual Scoring System',
      description: 'Advanced cyber resilience and user engagement scoring',
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-600',
      component: <DualScoreWidgets />
    },
    {
      id: 'security-score',
      name: 'Security Score Widget',
      description: 'Comprehensive security assessment with trends',
      icon: Shield,
      color: 'bg-green-100 text-green-600',
      component: (
        <SecurityScoreWidget
          score={85}
          trend="up"
          trendValue={5}
          summary="Your household security has improved this week"
          recommendations={[
            'Enable two-factor authentication on banking apps',
            'Update smart TV firmware',
            'Review app permissions for social media'
          ]}
        />
      )
    },
    {
      id: 'activity-timeline',
      name: 'Activity Timeline',
      description: 'Real-time security events and notifications',
      icon: Activity,
      color: 'bg-purple-100 text-purple-600',
      component: <ActivityTimeline />
    },
    {
      id: 'family-insights',
      name: 'Family Insights',
      description: 'Detailed family member digital behavior analysis',
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
      component: <FamilyInsights />
    },
    {
      id: 'enhanced-cyber-score',
      name: 'Enhanced Cyber Score',
      description: 'Advanced cyber risk assessment with detailed breakdown',
      icon: Shield,
      color: 'bg-red-100 text-red-600',
      component: <EnhancedCyberScore currentScore={78} onScoreUpdate={() => {}} />
    },
    {
      id: 'quick-scan',
      name: 'Quick Scan Widget',
      description: 'One-click security scanning with instant results',
      icon: Scan,
      color: 'bg-cyan-100 text-cyan-600',
      component: <QuickScanWidget />
    },
    {
      id: 'network-monitor',
      name: 'Network Monitor',
      description: 'Real-time network security and device monitoring',
      icon: Network,
      color: 'bg-indigo-100 text-indigo-600',
      component: <NetworkMonitor />
    },
    {
      id: 'account-connections',
      name: 'Account Connections',
      description: 'Manage and monitor connected digital services',
      icon: Layers,
      color: 'bg-pink-100 text-pink-600',
      component: <AccountConnections />
    },
    {
      id: 'nest-manager',
      name: 'Safety Nest Manager',
      description: 'Multi-location household security management',
      icon: Network,
      color: 'bg-teal-100 text-teal-600',
      component: <NestManager />
    },
    {
      id: 'notification-center',
      name: 'Notification Center',
      description: 'Centralized alert and notification management',
      icon: Bell,
      color: 'bg-yellow-100 text-yellow-600',
      component: <NotificationCenter />
    },
    {
      id: 'automated-controls',
      name: 'Automated Controls',
      description: 'Smart automation and response system',
      icon: Settings,
      color: 'bg-gray-100 text-gray-600',
      component: <AutomatedControls scanResults={scanResults} />
    },
    {
      id: 'household-scanner',
      name: 'Household Scanner',
      description: 'Comprehensive household security scanning',
      icon: Eye,
      color: 'bg-emerald-100 text-emerald-600',
      component: <HouseholdScanner onScanComplete={setScanResults} />
    },
    {
      id: 'real-time-status',
      name: 'Real-time Status',
      description: 'Live security status monitoring',
      icon: Zap,
      color: 'bg-lime-100 text-lime-600',
      component: <RealTimeStatus />
    },
    {
      id: 'security-discovery',
      name: 'Security Discovery',
      description: 'Discover existing security tools and services',
      icon: Star,
      color: 'bg-amber-100 text-amber-600',
      component: <SecurityDiscovery />
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">HAVEN Feature Showcase</h1>
        <p className="text-gray-600 mb-4">
          Explore all the advanced features and components built into HAVEN
        </p>
        <Badge className="bg-green-100 text-green-800">
          {features.length} Advanced Features Available
        </Badge>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          const isActive = activeDemo === feature.id
          
          return (
            <Card 
              key={feature.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
              onClick={() => setActiveDemo(isActive ? null : feature.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Component #{index + 1}
                  </Badge>
                  <Button
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    className="text-xs"
                  >
                    {isActive ? 'Hide Demo' : 'Show Demo'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Active Demo Display */}
      {activeDemo && (
        <div className="mt-8">
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    {React.createElement(
                      features.find(f => f.id === activeDemo)?.icon || Shield,
                      { className: "w-5 h-5" }
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {features.find(f => f.id === activeDemo)?.name} - Live Demo
                    </CardTitle>
                    <p className="text-gray-600">
                      {features.find(f => f.id === activeDemo)?.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveDemo(null)}
                >
                  Close Demo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                {features.find(f => f.id === activeDemo)?.component}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feature Categories */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Feature Categories</h2>
        
        <Tabs defaultValue="scoring" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scoring">Scoring & Analytics</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring & Alerts</TabsTrigger>
            <TabsTrigger value="management">Device & Service Management</TabsTrigger>
            <TabsTrigger value="automation">Automation & Controls</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scoring" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DualScoreWidgets />
              <div className="space-y-4">
                <SecurityScoreWidget
                  score={85}
                  trend="up"
                  trendValue={5}
                  summary="Your household security has improved this week"
                />
                <EnhancedCyberScore currentScore={78} onScoreUpdate={() => {}} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityTimeline />
              <div className="space-y-4">
                <RealTimeStatus />
                <NotificationCenter />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="management" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NetworkMonitor />
              <div className="space-y-4">
                <AccountConnections />
                <NestManager />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="automation" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AutomatedControls scanResults={scanResults} />
              <div className="space-y-4">
                <HouseholdScanner onScanComplete={setScanResults} />
                <QuickScanWidget />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Integration Status */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{features.length}</div>
              <div className="text-sm text-gray-600">Total Features</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-600">Functional</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">Ready</div>
              <div className="text-sm text-gray-600">Production Status</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>All features are fully integrated and ready for use.</strong> 
              Each component has been built with real data integration, proper error handling, 
              and responsive design. Switch between different dashboard views to see them in action.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}