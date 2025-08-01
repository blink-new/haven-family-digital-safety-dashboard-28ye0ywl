import React, { useState } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Smartphone,
  Tv,
  Laptop,
  Speaker,
  Camera,
  Gamepad2,
  RefreshCw,
  Search
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const services = [
  {
    name: 'Netflix',
    type: 'Streaming',
    status: 'safe',
    lastScan: '2 hours ago',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netflix.svg',
    color: '#E50914',
    issues: 0
  },
  {
    name: 'Gmail',
    type: 'Email',
    status: 'warning',
    lastScan: '1 day ago',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg',
    color: '#EA4335',
    issues: 1
  },
  {
    name: 'PlayStation Network',
    type: 'Gaming',
    status: 'safe',
    lastScan: '3 hours ago',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/playstation.svg',
    color: '#003791',
    issues: 0
  },
  {
    name: 'Ring Doorbell',
    type: 'Security',
    status: 'warning',
    lastScan: '5 hours ago',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/ring.svg',
    color: '#0066CC',
    issues: 2
  },
  {
    name: 'Spotify',
    type: 'Music',
    status: 'safe',
    lastScan: '1 hour ago',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spotify.svg',
    color: '#1DB954',
    issues: 0
  },
  {
    name: 'Amazon Prime',
    type: 'Shopping',
    status: 'unknown',
    lastScan: 'Never',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg',
    color: '#FF9900',
    issues: 0
  }
]

const devices = [
  {
    name: 'Living Room TV',
    type: 'Smart TV',
    status: 'safe',
    lastScan: '1 hour ago',
    icon: Tv,
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/samsung.svg',
    color: '#1428A0',
    model: 'Samsung QN65Q80A',
    issues: 0
  },
  {
    name: 'Emma\'s iPhone',
    type: 'Mobile',
    status: 'warning',
    lastScan: '30 minutes ago',
    icon: Smartphone,
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg',
    color: '#000000',
    model: 'iPhone 13',
    issues: 1
  },
  {
    name: 'Home Office Laptop',
    type: 'Computer',
    status: 'safe',
    lastScan: '2 hours ago',
    icon: Laptop,
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg',
    color: '#000000',
    model: 'MacBook Pro',
    issues: 0
  },
  {
    name: 'Kitchen Alexa',
    type: 'Smart Speaker',
    status: 'warning',
    lastScan: '4 hours ago',
    icon: Speaker,
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazonalexa.svg',
    color: '#00CAFF',
    model: 'Echo Dot 4th Gen',
    issues: 2
  },
  {
    name: 'Security Camera',
    type: 'IoT Device',
    status: 'safe',
    lastScan: '1 hour ago',
    icon: Camera,
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlenest.svg',
    color: '#4285F4',
    model: 'Nest Cam',
    issues: 0
  },
  {
    name: 'Xbox Series X',
    type: 'Gaming Console',
    status: 'unknown',
    lastScan: 'Never',
    icon: Gamepad2,
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/xbox.svg',
    color: '#107C10',
    model: 'Xbox Series X',
    issues: 0
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'safe':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'unknown':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'safe':
      return 'All Good'
    case 'warning':
      return 'Needs a Look'
    case 'unknown':
      return 'Not Sure Yet'
    default:
      return 'Unknown'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'safe':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    case 'unknown':
      return <Shield className="w-4 h-4 text-gray-600" />
    default:
      return <Shield className="w-4 h-4 text-gray-600" />
  }
}

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  const handleScanAll = () => {
    setIsScanning(true)
    setTimeout(() => setIsScanning(false), 3000)
  }

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Family's Gadgets & Apps</h1>
          <p className="text-slate-600 mt-1">Keep track of all the tech and apps your family uses</p>
        </div>
        <Button 
          onClick={handleScanAll}
          disabled={isScanning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Scan All
            </>
          )}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search for gadgets and apps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Things We're Watching</p>
                <p className="text-2xl font-bold text-slate-900">{services.length + devices.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Looking Good</p>
                <p className="text-2xl font-bold text-green-600">
                  {[...services, ...devices].filter(item => item.status === 'safe').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Need a Look</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {[...services, ...devices].filter(item => item.status === 'warning' || item.status === 'unknown').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">Apps & Services ({services.length})</TabsTrigger>
          <TabsTrigger value="devices">Gadgets & Devices ({devices.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <img 
                          src={service.logo} 
                          alt={`${service.name} logo`}
                          className="w-6 h-6"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>{service.type}</CardDescription>
                      </div>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge className={getStatusColor(service.status)}>
                      {getStatusLabel(service.status)}
                    </Badge>
                    
                    <div className="text-sm text-slate-600">
                      <p>Last scan: {service.lastScan}</p>
                      {service.issues > 0 && (
                        <p className="text-yellow-600 font-medium">
                          {service.issues} issue{service.issues > 1 ? 's' : ''} found
                        </p>
                      )}
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDevices.map((device, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {device.logo ? (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <img 
                            src={device.logo} 
                            alt={`${device.name} logo`}
                            className="w-6 h-6"
                          />
                        </div>
                      ) : (
                        <device.icon className="w-8 h-8 text-slate-600" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <CardDescription>{device.model}</CardDescription>
                      </div>
                    </div>
                    {getStatusIcon(device.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge className={getStatusColor(device.status)}>
                      {getStatusLabel(device.status)}
                    </Badge>
                    
                    <div className="text-sm text-slate-600">
                      <p>Type: {device.type}</p>
                      <p>Last scan: {device.lastScan}</p>
                      {device.issues > 0 && (
                        <p className="text-yellow-600 font-medium">
                          {device.issues} issue{device.issues > 1 ? 's' : ''} found
                        </p>
                      )}
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}