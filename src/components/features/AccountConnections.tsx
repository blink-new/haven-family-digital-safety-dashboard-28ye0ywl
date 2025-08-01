import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Progress } from '../ui/progress'
import { Alert, AlertDescription } from '../ui/alert'
import { CheckCircle, AlertCircle, DollarSign, Calendar, Shield, ExternalLink, Unlink, MapPin } from 'lucide-react'
import { useCurrency } from '../../hooks/useCurrency'

interface ServiceConnection {
  id: string
  name: string
  logo: string
  category: 'streaming' | 'music' | 'gaming' | 'productivity' | 'social' | 'cloud'
  connected: boolean
  monthlyFee?: number
  yearlyFee?: number
  contractEnd?: string
  features: string[]
  securityRisk: 'low' | 'medium' | 'high'
  familyMembers?: string[]
  lastSync?: string
  permissions: string[]
}

const AVAILABLE_SERVICES: ServiceConnection[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/netflix.svg',
    category: 'streaming',
    connected: true,
    monthlyFee: 15.49,
    contractEnd: '2024-12-15',
    features: ['4K Streaming', 'Multiple Profiles', 'Download Content'],
    securityRisk: 'low',
    familyMembers: ['Dad', 'Mom', 'Emma', 'Jake'],
    lastSync: '2024-01-20T10:30:00Z',
    permissions: ['View watch history', 'Manage profiles', 'Billing information']
  },
  {
    id: 'spotify',
    name: 'Spotify',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/spotify.svg',
    category: 'music',
    connected: true,
    monthlyFee: 16.99,
    contractEnd: '2024-11-30',
    features: ['Family Plan', 'Offline Downloads', 'No Ads'],
    securityRisk: 'low',
    familyMembers: ['Dad', 'Mom', 'Emma'],
    lastSync: '2024-01-20T09:15:00Z',
    permissions: ['View listening history', 'Manage playlists', 'Account details']
  },
  {
    id: 'disney',
    name: 'Disney+',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/disneyplus.svg',
    category: 'streaming',
    connected: false,
    monthlyFee: 13.99,
    features: ['4K Content', 'Multiple Profiles', 'Download Content'],
    securityRisk: 'low',
    permissions: ['View watch history', 'Manage profiles', 'Billing information']
  },
  {
    id: 'amazon-prime',
    name: 'Amazon Prime',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonprime.svg',
    category: 'streaming',
    connected: false,
    yearlyFee: 139,
    features: ['Prime Video', 'Free Shipping', 'Prime Music'],
    securityRisk: 'medium',
    permissions: ['Order history', 'Prime benefits', 'Payment methods']
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg',
    category: 'streaming',
    connected: false,
    monthlyFee: 22.99,
    features: ['Ad-free videos', 'YouTube Music', 'Background play'],
    securityRisk: 'medium',
    permissions: ['Watch history', 'Subscriptions', 'Personal data']
  },
  {
    id: 'playstation',
    name: 'PlayStation Plus',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/playstation.svg',
    category: 'gaming',
    connected: true,
    monthlyFee: 17.99,
    contractEnd: '2024-10-15',
    features: ['Online Gaming', 'Free Games', 'Cloud Saves'],
    securityRisk: 'medium',
    familyMembers: ['Jake', 'Dad'],
    lastSync: '2024-01-19T16:45:00Z',
    permissions: ['Gaming activity', 'Purchase history', 'Friends list']
  },
  {
    id: 'microsoft365',
    name: 'Microsoft 365',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoft.svg',
    category: 'productivity',
    connected: false,
    monthlyFee: 9.99,
    features: ['Office Apps', '1TB OneDrive', 'Premium Support'],
    securityRisk: 'low',
    permissions: ['Document access', 'Email data', 'Calendar information']
  },
  {
    id: 'icloud',
    name: 'iCloud+',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/icloud.svg',
    category: 'cloud',
    connected: true,
    monthlyFee: 2.99,
    contractEnd: '2024-09-20',
    features: ['50GB Storage', 'Private Relay', 'Hide My Email'],
    securityRisk: 'low',
    familyMembers: ['Mom', 'Emma'],
    lastSync: '2024-01-20T08:00:00Z',
    permissions: ['Photos access', 'Backup data', 'Device information']
  }
]

export default function AccountConnections() {
  const [services, setServices] = useState<ServiceConnection[]>(AVAILABLE_SERVICES)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [connectingService, setConnectingService] = useState<string | null>(null)
  const { currency, formatPrice, isLoading: currencyLoading, userLocation } = useCurrency()

  const connectedServices = services.filter(s => s.connected)
  const totalMonthlyCost = connectedServices.reduce((sum, service) => {
    return sum + (service.monthlyFee || (service.yearlyFee ? service.yearlyFee / 12 : 0))
  }, 0)

  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'streaming', name: 'Streaming', count: services.filter(s => s.category === 'streaming').length },
    { id: 'music', name: 'Music', count: services.filter(s => s.category === 'music').length },
    { id: 'gaming', name: 'Gaming', count: services.filter(s => s.category === 'gaming').length },
    { id: 'productivity', name: 'Productivity', count: services.filter(s => s.category === 'productivity').length },
    { id: 'cloud', name: 'Cloud Storage', count: services.filter(s => s.category === 'cloud').length }
  ]

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory)

  const handleConnect = async (serviceId: string) => {
    setConnectingService(serviceId)
    
    // Simulate OAuth connection process
    setTimeout(() => {
      setServices(prev => prev.map(service => 
        service.id === serviceId 
          ? { 
              ...service, 
              connected: true,
              lastSync: new Date().toISOString(),
              familyMembers: ['Dad', 'Mom'] // Simulated data
            }
          : service
      ))
      setConnectingService(null)
    }, 2000)
  }

  const handleDisconnect = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { 
            ...service, 
            connected: false,
            lastSync: undefined,
            familyMembers: undefined
          }
        : service
    ))
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Currency formatting is now handled by the useCurrency hook

  return (
    <div className="space-y-6">
      {/* Currency Location Indicator */}
      {!currencyLoading && userLocation && (
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            Pricing displayed in {currency.name} ({currency.code}) based on your location: {userLocation}
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards with staggered animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="animate-fade-in-up hover:shadow-lg transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 animate-bounce-gentle" />
              <div>
                <p className="text-2xl font-bold">{connectedServices.length}</p>
                <p className="text-sm text-gray-600">Connected Services</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up hover:shadow-lg transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600 animate-bounce-gentle" style={{ animationDelay: '0.5s' }} />
              <div>
                <p className="text-2xl font-bold">{formatPrice(totalMonthlyCost)}</p>
                <p className="text-sm text-gray-600">Monthly Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up hover:shadow-lg transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600 animate-bounce-gentle" style={{ animationDelay: '1s' }} />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((connectedServices.filter(s => s.securityRisk === 'low').length / connectedServices.length) * 100) || 0}%
                </p>
                <p className="text-sm text-gray-600">Low Risk Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Optimization Alert */}
      {totalMonthlyCost > 50 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You're spending {formatPrice(totalMonthlyCost)} monthly on digital services. 
            Consider reviewing subscriptions for potential savings.
          </AlertDescription>
        </Alert>
      )}

      {/* Service Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service, index) => (
              <Card key={service.id} className={`transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in-up ${service.connected ? 'ring-2 ring-green-200' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={service.logo} 
                        alt={service.name}
                        className="w-8 h-8"
                      />
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription className="capitalize">{service.category}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getRiskColor(service.securityRisk)}>
                      {service.securityRisk} risk
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Pricing Information */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cost:</span>
                    <span className="font-semibold">
                      {service.monthlyFee ? formatPrice(service.monthlyFee) + '/mo' : 
                       service.yearlyFee ? formatPrice(service.yearlyFee) + '/yr' : 'Free'}
                    </span>
                  </div>

                  {/* Connection Status */}
                  {service.connected ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Connected</span>
                      </div>

                      {service.contractEnd && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Renews:</span>
                          <span>{new Date(service.contractEnd).toLocaleDateString()}</span>
                        </div>
                      )}

                      {service.familyMembers && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Who uses this:</p>
                          <div className="flex flex-wrap gap-1">
                            {service.familyMembers.map(member => (
                              <Badge key={member} variant="outline" className="text-xs">
                                {member}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {service.lastSync && (
                        <p className="text-xs text-gray-500">
                          Last synced: {new Date(service.lastSync).toLocaleString()}
                        </p>
                      )}

                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleConnect(service.id)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Sync
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisconnect(service.id)}
                        >
                          <Unlink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">What you get:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {service.features.slice(0, 2).map(feature => (
                            <li key={feature} className="text-xs">{feature}</li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        onClick={() => handleConnect(service.id)}
                        disabled={connectingService === service.id}
                        className="w-full"
                      >
                        {connectingService === service.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Connecting...
                          </>
                        ) : (
                          'Connect This App'
                        )}
                      </Button>

                      <div className="text-xs text-gray-500">
                        <p className="mb-1">We'll be able to see:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {service.permissions.slice(0, 2).map(permission => (
                            <li key={permission}>{permission}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Connected Services Summary */}
      {connectedServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Connected Apps</CardTitle>
            <CardDescription>
              Here's what you're paying for and who's using what
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectedServices.map(service => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={service.logo} 
                      alt={service.name}
                      className="w-6 h-6"
                    />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">
                        {service.familyMembers?.length || 0} people use this
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {service.monthlyFee ? formatPrice(service.monthlyFee) + '/mo' : 
                       service.yearlyFee ? formatPrice(service.yearlyFee) + '/yr' : 'Free'}
                    </p>
                    {service.contractEnd && (
                      <p className="text-sm text-gray-600">
                        Until {new Date(service.contractEnd).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">What You Pay Each Month:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(totalMonthlyCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>What You Pay Each Year:</span>
                  <span>{formatPrice(totalMonthlyCost * 12)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}