import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Router, 
  AlertTriangle, 
  DollarSign, 
  CheckCircle, 
  Eye,
  EyeOff,
  TrendingDown,
  Zap,
  Lock,
  Globe,
  Server
} from 'lucide-react';

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

interface OnboardingSecurityDiscoveryProps {
  onComplete: (discoveryData: any) => void;
}

const OnboardingSecurityDiscovery: React.FC<OnboardingSecurityDiscoveryProps> = ({ onComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [discoveredTools, setDiscoveredTools] = useState<SecurityTool[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Mock discovered tools - in real implementation, this would come from network scanning
  const mockDiscoveredTools: SecurityTool[] = [
    {
      id: 'norton-360',
      name: 'Norton 360 Deluxe',
      type: 'antivirus',
      brand: 'Norton',
      status: 'active',
      capabilities: ['Real-time Protection', 'VPN', 'Password Manager', 'Parental Controls'],
      cost: 99.99,
      billing: 'yearly',
      duplicatedBy: ['eero-pro'],
      consolidationSavings: 60,
      riskImpact: 25,
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/norton.svg',
      detected: 'device',
      monitoringEnabled: true
    },
    {
      id: 'eero-pro',
      name: 'Eero Pro 6E',
      type: 'router',
      brand: 'Eero',
      status: 'active',
      capabilities: ['Mesh Network', 'Threat Protection', 'Ad Blocking'],
      cost: 9.99,
      billing: 'monthly',
      riskImpact: 20,
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg',
      detected: 'network',
      monitoringEnabled: true
    },
    {
      id: 'isp-security',
      name: 'Xfinity xFi Advanced Security',
      type: 'isp',
      brand: 'Comcast',
      status: 'active',
      capabilities: ['Network Security', 'Device Protection', 'Threat Blocking'],
      cost: 25,
      billing: 'monthly',
      duplicatedBy: ['norton-360'],
      consolidationSavings: 15,
      riskImpact: 15,
      logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/comcast.svg',
      detected: 'network',
      monitoringEnabled: true
    }
  ];

  const startDiscovery = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate network discovery process
    const steps = [
      'Scanning network devices...',
      'Detecting installed security software...',
      'Checking ISP security services...',
      'Analyzing capabilities and duplications...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setScanProgress(((i + 1) / steps.length) * 100);
    }

    setDiscoveredTools(mockDiscoveredTools);
    setIsScanning(false);
    setShowResults(true);
  };

  const toggleToolMonitoring = (toolId: string) => {
    setDiscoveredTools(prev => 
      prev.map(tool => 
        tool.id === toolId 
          ? { ...tool, monitoringEnabled: !tool.monitoringEnabled }
          : tool
      )
    );
  };

  const handleComplete = () => {
    const discoveryData = {
      tools: discoveredTools,
      totalMonthlyCost: discoveredTools.reduce((sum, tool) => {
        const monthlyCost = tool.billing === 'yearly' ? tool.cost / 12 : tool.cost;
        return sum + monthlyCost;
      }, 0),
      potentialSavings: discoveredTools.reduce((sum, tool) => sum + (tool.consolidationSavings || 0), 0),
      monitoredTools: discoveredTools.filter(tool => tool.monitoringEnabled).length
    };
    
    onComplete(discoveryData);
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
        return <img src={logoMap[brand]} alt={brand} className="h-5 w-5 filter" />;
      }
    }
    
    // Fallback to generic icons
    switch (type) {
      case 'antivirus': return <Shield className="h-5 w-5" />;
      case 'firewall': return <Lock className="h-5 w-5" />;
      case 'router': return <Router className="h-5 w-5" />;
      case 'isp': return <Globe className="h-5 w-5" />;
      case 'smart_hub': return <Server className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const totalMonthlyCost = discoveredTools.reduce((sum, tool) => {
    const monthlyCost = tool.billing === 'yearly' ? tool.cost / 12 : tool.cost;
    return sum + monthlyCost;
  }, 0);

  const totalSavings = discoveredTools.reduce((sum, tool) => sum + (tool.consolidationSavings || 0), 0);

  if (!showResults && !isScanning) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Let's Find Your Security Tools</CardTitle>
            <CardDescription>
              I'll scan your network to discover existing security tools and help you optimize costs
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Router className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <div className="text-xs font-medium">Network</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <div className="text-xs font-medium">Software</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Globe className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <div className="text-xs font-medium">ISP Services</div>
              </div>
            </div>
            <Button onClick={startDiscovery} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Start Security Scan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Scanning Your Security Tools</CardTitle>
            <CardDescription>
              Discovering your existing security infrastructure...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={scanProgress} className="w-full" />
              <div className="text-center text-sm text-gray-600">
                {scanProgress < 25 && "Scanning network devices..."}
                {scanProgress >= 25 && scanProgress < 50 && "Detecting installed security software..."}
                {scanProgress >= 50 && scanProgress < 75 && "Checking ISP security services..."}
                {scanProgress >= 75 && "Analyzing capabilities and duplications..."}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{discoveredTools.length}</div>
            <div className="text-sm text-gray-600">Tools Found</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">${totalMonthlyCost.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Monthly Cost</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">${totalSavings}</div>
            <div className="text-sm text-gray-600">Potential Savings</div>
          </CardContent>
        </Card>
      </div>

      {/* Duplication Alert */}
      {totalSavings > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>Overlapping Services Found:</strong> You could save <strong>${totalSavings}/year</strong> by consolidating duplicate functionality.
          </AlertDescription>
        </Alert>
      )}

      {/* Discovered Tools */}
      <div className="space-y-4">
        <h3 className="font-semibold">Discovered Security Tools</h3>
        {discoveredTools.map((tool) => (
          <Card key={tool.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {tool.logo ? (
                    <img src={tool.logo} alt={tool.brand} className="h-6 w-6 filter" />
                  ) : (
                    getTypeIcon(tool.type, tool.brand)
                  )}
                  <div>
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-sm text-gray-600">{tool.brand}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(tool.status)}>
                    {tool.status}
                  </Badge>
                  {tool.cost > 0 && (
                    <Badge variant="outline">
                      ${tool.cost}/{tool.billing === 'yearly' ? 'yr' : 'mo'}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {tool.capabilities.slice(0, 3).map((capability, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                  {tool.capabilities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{tool.capabilities.length - 3} more
                    </Badge>
                  )}
                </div>

                {tool.duplicatedBy && tool.duplicatedBy.length > 0 && (
                  <Alert className="py-2">
                    <TrendingDown className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Duplication:</strong> Similar features in other tools
                      {tool.consolidationSavings && (
                        <span className="text-green-600 font-medium">
                          {' '}• Save ${tool.consolidationSavings}/year
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
        ))}
      </div>

      {/* Complete Button */}
      <div className="flex justify-center pt-4">
        <Button onClick={handleComplete} size="lg" className="px-8">
          <CheckCircle className="h-5 w-5 mr-2" />
          Complete Discovery Setup
        </Button>
      </div>
    </div>
  );
};

export default OnboardingSecurityDiscovery;