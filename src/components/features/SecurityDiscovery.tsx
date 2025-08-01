import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Wifi, 
  Router, 
  Smartphone, 
  Monitor, 
  AlertTriangle, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff,
  TrendingDown,
  Zap,
  Lock,
  Users,
  Globe,
  Server,
  MapPin
} from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';

interface SecurityTool {
  id: string;
  name: string;
  type: 'antivirus' | 'firewall' | 'router' | 'isp' | 'smart_hub' | 'parental' | 'vpn' | 'backup';
  brand: string;
  status: 'active' | 'inactive' | 'expired' | 'trial';
  capabilities: string[];
  cost: number;
  billing: 'monthly' | 'yearly' | 'one-time' | 'free';
  duplicatedBy?: string[];
  consolidationSavings?: number;
  riskImpact: number;
  logo?: string;
  detected: 'network' | 'device' | 'user_reported';
  monitoringEnabled: boolean;
}

interface DiscoveryResults {
  networkDevices: SecurityTool[];
  installedSoftware: SecurityTool[];
  ispServices: SecurityTool[];
  duplications: {
    functionality: string;
    tools: string[];
    potentialSavings: number;
  }[];
  totalMonthlyCost: number;
  potentialSavings: number;
  riskScore: number;
}

const SecurityDiscovery: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<DiscoveryResults | null>(null);
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const { currency, formatPrice, isLoading: currencyLoading, userLocation } = useCurrency();

  // Mock security tools data - in real implementation, this would come from network scanning
  const mockResults: DiscoveryResults = {
    networkDevices: [
      {
        id: 'netgear-r7000',
        name: 'Netgear Nighthawk R7000',
        type: 'router',
        brand: 'Netgear',
        status: 'active',
        capabilities: ['Firewall', 'Guest Network', 'Access Control', 'VPN Server'],
        cost: 0,
        billing: 'one-time',
        riskImpact: 15,
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netgear.svg',
        detected: 'network',
        monitoringEnabled: true
      },
      {
        id: 'eero-pro',
        name: 'Eero Pro 6E',
        type: 'router',
        brand: 'Eero',
        status: 'active',
        capabilities: ['Mesh Network', 'Threat Protection', 'Ad Blocking', 'Safe Search'],
        cost: 9.99,
        billing: 'monthly',
        riskImpact: 20,
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg',
        detected: 'network',
        monitoringEnabled: true
      },
      {
        id: 'ring-alarm',
        name: 'Ring Alarm Pro',
        type: 'smart_hub',
        brand: 'Ring',
        status: 'active',
        capabilities: ['Home Security', 'Professional Monitoring', 'Cellular Backup'],
        cost: 20,
        billing: 'monthly',
        riskImpact: 10,
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/ring.svg',
        detected: 'network',
        monitoringEnabled: false
      }
    ],
    installedSoftware: [
      {
        id: 'norton-360',
        name: 'Norton 360 Deluxe',
        type: 'antivirus',
        brand: 'Norton',
        status: 'active',
        capabilities: ['Real-time Protection', 'VPN', 'Password Manager', 'Parental Controls', 'Cloud Backup'],
        cost: 99.99,
        billing: 'yearly',
        duplicatedBy: ['eero-pro', 'isp-security'],
        consolidationSavings: 60,
        riskImpact: 25,
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/norton.svg',
        detected: 'device',
        monitoringEnabled: true
      },
      {
        id: 'bitdefender',
        name: 'Bitdefender Total Security',
        type: 'antivirus',
        brand: 'Bitdefender',
        status: 'trial',
        capabilities: ['Anti-malware', 'Web Protection', 'Anti-phishing', 'Firewall'],
        cost: 89.99,
        billing: 'yearly',
        duplicatedBy: ['norton-360'],
        consolidationSavings: 89.99,
        riskImpact: 20,
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/bitdefender.svg',
        detected: 'device',
        monitoringEnabled: false
      }
    ],
    ispServices: [
      {
        id: 'isp-security',
        name: 'Xfinity xFi Advanced Security',
        type: 'isp',
        brand: 'Comcast',
        status: 'active',
        capabilities: ['Network Security', 'Device Protection', 'Threat Blocking'],
        cost: 25,
        billing: 'monthly',
        duplicatedBy: ['norton-360', 'eero-pro'],
        consolidationSavings: 15,
        riskImpact: 15,
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/comcast.svg',
        detected: 'network',
        monitoringEnabled: true
      }
    ],
    duplications: [
      {
        functionality: 'VPN Protection',
        tools: ['Norton 360', 'Eero Pro'],
        potentialSavings: 60
      },
      {
        functionality: 'Threat Protection',
        tools: ['Norton 360', 'Bitdefender', 'Xfinity Security'],
        potentialSavings: 89.99
      },
      {
        functionality: 'Parental Controls',
        tools: ['Norton 360', 'Eero Pro'],
        potentialSavings: 30
      }
    ],
    totalMonthlyCost: 154.98,
    potentialSavings: 179.99,
    riskScore: 78
  };

  const startDiscovery = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate network discovery process
    const steps = [
      'Scanning network devices...',
      'Detecting installed security software...',
      'Checking ISP security services...',
      'Analyzing capabilities and duplications...',
      'Calculating cost optimization...',
      'Generating recommendations...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setScanProgress(((i + 1) / steps.length) * 100);
    }

    setResults(mockResults);
    setIsScanning(false);
  };

  const toggleToolMonitoring = (toolId: string) => {
    if (!results) return;
    
    const updateTool = (tool: SecurityTool) => 
      tool.id === toolId ? { ...tool, monitoringEnabled: !tool.monitoringEnabled } : tool;

    setResults({
      ...results,
      networkDevices: results.networkDevices.map(updateTool),
      installedSoftware: results.installedSoftware.map(updateTool),
      ispServices: results.ispServices.map(updateTool)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'trial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string, brand?: string) => {
    // Use company logos when available
    if (brand) {
      const logoMap: { [key: string]: string } = {
        'Norton': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/norton.svg',
        'Bitdefender': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/bitdefender.svg',
        'McAfee': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mcafee.svg',
        'Kaspersky': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/kaspersky.svg',
        'Avast': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/avast.svg',
        'Netgear': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netgear.svg',
        'Eero': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg',
        'Linksys': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linksys.svg',
        'ASUS': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/asus.svg',
        'TP-Link': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tplink.svg',
        'Ring': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/ring.svg',
        'Nest': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlenest.svg',
        'Comcast': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/comcast.svg',
        'Verizon': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/verizon.svg',
        'AT&T': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/att.svg',
        'Spectrum': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spectrum.svg',
        'ExpressVPN': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/expressvpn.svg',
        'NordVPN': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nordvpn.svg',
        'Surfshark': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/surfshark.svg'
      };
      
      if (logoMap[brand]) {
        return <img src={logoMap[brand]} alt={brand} className="h-5 w-5" />;
      }
    }
    
    // Fallback to generic icons
    switch (type) {
      case 'antivirus': return <Shield className="h-5 w-5" />;
      case 'firewall': return <Lock className="h-5 w-5" />;
      case 'router': return <Router className="h-5 w-5" />;
      case 'isp': return <Globe className="h-5 w-5" />;
      case 'smart_hub': return <Server className="h-5 w-5" />;
      case 'parental': return <Users className="h-5 w-5" />;
      case 'vpn': return <Shield className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  const SecurityToolCard: React.FC<{ tool: SecurityTool }> = ({ tool }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {tool.logo ? (
              <img src={tool.logo} alt={tool.brand} className="h-8 w-8" />
            ) : (
              getTypeIcon(tool.type, tool.brand)
            )}
            <div>
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {tool.brand} • Detected via {tool.detected}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(tool.status)}>
              {tool.status}
            </Badge>
            {tool.cost > 0 && (
              <Badge variant="outline">
                {formatPrice(tool.cost)}/{tool.billing === 'yearly' ? 'year' : tool.billing}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-2">Capabilities</h4>
            <div className="flex flex-wrap gap-1">
              {tool.capabilities.map((capability, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {capability}
                </Badge>
              ))}
            </div>
          </div>

          {tool.duplicatedBy && tool.duplicatedBy.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Duplication detected:</strong> Similar features found in {tool.duplicatedBy.join(', ')}
                {tool.consolidationSavings && (
                  <span className="text-green-600 font-medium">
                    {' '}• Potential savings: {formatPrice(tool.consolidationSavings)}/year
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Monitor with HAVEN:</span>
              <Switch
                checked={tool.monitoringEnabled}
                onCheckedChange={() => toggleToolMonitoring(tool.id)}
              />
              {tool.monitoringEnabled ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Risk Impact</div>
              <div className="font-medium text-blue-600">+{tool.riskImpact} points</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!results && !isScanning) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">What Security Stuff Do You Already Have?</CardTitle>
            <CardDescription className="text-lg">
              Let's take a look around your home to see what's already protecting your family,
              and help you save money by avoiding duplicate services.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Router className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Your Wi-Fi & Network</div>
                <div className="text-xs text-gray-600">Router, smart hubs</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Protection Apps</div>
                <div className="text-xs text-gray-600">Antivirus, VPN, backup</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Internet Provider</div>
                <div className="text-xs text-gray-600">Built-in protections</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Save Money</div>
                <div className="text-xs text-gray-600">Find ways to save</div>
              </div>
            </div>
            <Button onClick={startDiscovery} size="lg" className="px-8">
              <Zap className="h-5 w-5 mr-2" />
              Let's Take a Look!
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Looking Around Your Home</CardTitle>
            <CardDescription>
              Checking what's already protecting your family...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={scanProgress} className="w-full" />
              <div className="text-center text-sm text-gray-600">
                {scanProgress < 20 && "Checking your Wi-Fi and smart devices..."}
                {scanProgress >= 20 && scanProgress < 40 && "Looking for protection apps on your devices..."}
                {scanProgress >= 40 && scanProgress < 60 && "Seeing what your internet provider includes..."}
                {scanProgress >= 60 && scanProgress < 80 && "Finding where you might be paying twice..."}
                {scanProgress >= 80 && scanProgress < 95 && "Figuring out how you can save money..."}
                {scanProgress >= 95 && "Getting your recommendations ready..."}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Currency Location Indicator */}
      {!currencyLoading && userLocation && (
        <Alert className="mb-6">
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            Cost analysis displayed in {currency.name} ({currency.code}) based on your location: {userLocation}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{results.networkDevices.length + results.installedSoftware.length + results.ispServices.length}</div>
                <div className="text-sm text-gray-600">Protection Things Found</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{formatPrice(results.totalMonthlyCost)}</div>
                <div className="text-sm text-gray-600">What You Pay Each Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{formatPrice(results.potentialSavings)}</div>
                <div className="text-sm text-gray-600">How Much You Could Save</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{results.riskScore}</div>
                <div className="text-sm text-gray-600">Your Safety Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duplication Alerts */}
      {results.duplications.length > 0 && (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>You're Paying for the Same Thing Twice:</strong> We found {results.duplications.length} places where you're paying for the same protection. 
            You could save up to <strong>{formatPrice(results.potentialSavings)} each year</strong> by canceling duplicates!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="discovered" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discovered">What We Found</TabsTrigger>
          <TabsTrigger value="duplications">Paying Twice</TabsTrigger>
          <TabsTrigger value="recommendations">How to Save</TabsTrigger>
          <TabsTrigger value="monitoring">Keep an Eye On</TabsTrigger>
        </TabsList>

        <TabsContent value="discovered" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Wi-Fi & Network Stuff</h3>
            {results.networkDevices.map(tool => (
              <SecurityToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Protection Apps on Your Devices</h3>
            {results.installedSoftware.map(tool => (
              <SecurityToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">What Your Internet Provider Includes</h3>
            {results.ispServices.map(tool => (
              <SecurityToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="duplications" className="space-y-4">
          {results.duplications.map((duplication, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>{duplication.functionality}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong>Overlapping tools:</strong> {duplication.tools.join(', ')}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Potential annual savings:</span>
                    <Badge className="bg-green-100 text-green-800">
                      {formatPrice(duplication.potentialSavings)}/year
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Primary Recommendation:</strong> Consolidate to Norton 360 + HAVEN monitoring. 
                  Cancel Bitdefender trial and consider downgrading Eero Pro subscription.
                  <div className="mt-2 font-medium text-green-600">Estimated savings: {formatPrice(179.99)}/year</div>
                </AlertDescription>
              </Alert>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Network Optimization:</strong> Your Netgear router provides adequate firewall protection. 
                  Consider using its built-in VPN instead of paid services.
                  <div className="mt-2 font-medium text-green-600">Additional savings: {formatPrice(60)}/year</div>
                </AlertDescription>
              </Alert>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Monitoring Integration:</strong> Enable HAVEN monitoring for all active tools 
                  to get unified security insights and eliminate blind spots.
                  <div className="mt-2 font-medium text-blue-600">Risk score improvement: +15 points</div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HAVEN Monitoring Integration</CardTitle>
              <CardDescription>
                Choose which security tools you'd like HAVEN to monitor and integrate into your unified risk score.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...results.networkDevices, ...results.installedSoftware, ...results.ispServices].map(tool => (
                  <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {tool.logo ? (
                        <img src={tool.logo} alt={tool.brand} className="h-6 w-6" />
                      ) : (
                        getTypeIcon(tool.type, tool.brand)
                      )}
                      <div>
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-gray-600">Risk Impact: +{tool.riskImpact} points</div>
                      </div>
                    </div>
                    <Switch
                      checked={tool.monitoringEnabled}
                      onCheckedChange={() => toggleToolMonitoring(tool.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDiscovery;