import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Clock,
  Download,
  Upload,
  Zap,
  BarChart3
} from 'lucide-react';

interface SpeedTestResult {
  id: string;
  timestamp: number;
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  ping: number; // ms
  jitter: number; // ms
  packetLoss: number; // percentage
  status: 'completed' | 'failed' | 'running';
}

interface OutageEvent {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number; // seconds
  severity: 'minor' | 'major' | 'critical';
  affectedDevices: string[];
  cause?: string;
}

interface NetworkStats {
  averageDownload: number;
  averageUpload: number;
  averagePing: number;
  uptime: number; // percentage
  totalOutages: number;
  longestOutage: number; // seconds
  riskScore: number; // 0-100
}

export const NetworkMonitor: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [currentTest, setCurrentTest] = useState<SpeedTestResult | null>(null);
  const [speedHistory, setSpeedHistory] = useState<SpeedTestResult[]>([]);
  const [outageHistory, setOutageHistory] = useState<OutageEvent[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    averageDownload: 0,
    averageUpload: 0,
    averagePing: 0,
    uptime: 0,
    totalOutages: 0,
    longestOutage: 0,
    riskScore: 0
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOutageStart, setLastOutageStart] = useState<number | null>(null);
  
  const monitoringInterval = useRef<NodeJS.Timeout | null>(null);
  const speedTestInterval = useRef<NodeJS.Timeout | null>(null);

  // Simulate speed test (in real implementation, this would use actual speed test APIs)
  const runSpeedTest = async (): Promise<SpeedTestResult> => {
    const testId = `test_${Date.now()}`;
    const timestamp = Date.now();
    
    setCurrentTest({
      id: testId,
      timestamp,
      downloadSpeed: 0,
      uploadSpeed: 0,
      ping: 0,
      jitter: 0,
      packetLoss: 0,
      status: 'running'
    });

    // Simulate test duration
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate realistic speed test results with some variance
    const baseDownload = 50 + Math.random() * 100; // 50-150 Mbps
    const baseUpload = 10 + Math.random() * 40; // 10-50 Mbps
    const basePing = 10 + Math.random() * 30; // 10-40 ms
    
    const result: SpeedTestResult = {
      id: testId,
      timestamp,
      downloadSpeed: Math.round(baseDownload * 10) / 10,
      uploadSpeed: Math.round(baseUpload * 10) / 10,
      ping: Math.round(basePing),
      jitter: Math.round(Math.random() * 5 * 10) / 10,
      packetLoss: Math.round(Math.random() * 2 * 10) / 10,
      status: 'completed'
    };

    setCurrentTest(result);
    return result;
  };

  // Calculate network statistics
  const calculateNetworkStats = (tests: SpeedTestResult[], outages: OutageEvent[]): NetworkStats => {
    if (tests.length === 0) {
      return {
        averageDownload: 0,
        averageUpload: 0,
        averagePing: 0,
        uptime: 100,
        totalOutages: 0,
        longestOutage: 0,
        riskScore: 0
      };
    }

    const completedTests = tests.filter(test => test.status === 'completed');
    const avgDownload = completedTests.reduce((sum, test) => sum + test.downloadSpeed, 0) / completedTests.length;
    const avgUpload = completedTests.reduce((sum, test) => sum + test.uploadSpeed, 0) / completedTests.length;
    const avgPing = completedTests.reduce((sum, test) => sum + test.ping, 0) / completedTests.length;
    
    const totalOutageTime = outages.reduce((sum, outage) => sum + (outage.duration || 0), 0);
    const longestOutage = Math.max(...outages.map(outage => outage.duration || 0), 0);
    const uptime = Math.max(0, 100 - (totalOutageTime / (24 * 3600)) * 100); // Assuming 24h period
    
    // Calculate risk score based on various factors
    let riskScore = 0;
    if (avgDownload < 25) riskScore += 20; // Slow download
    if (avgUpload < 5) riskScore += 15; // Slow upload
    if (avgPing > 50) riskScore += 15; // High latency
    if (uptime < 99) riskScore += 25; // Poor uptime
    if (outages.length > 3) riskScore += 25; // Frequent outages
    
    return {
      averageDownload: Math.round(avgDownload * 10) / 10,
      averageUpload: Math.round(avgUpload * 10) / 10,
      averagePing: Math.round(avgPing),
      uptime: Math.round(uptime * 10) / 10,
      totalOutages: outages.length,
      longestOutage,
      riskScore: Math.min(100, riskScore)
    };
  };

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (lastOutageStart) {
        const outage: OutageEvent = {
          id: `outage_${lastOutageStart}`,
          startTime: lastOutageStart,
          endTime: Date.now(),
          duration: Math.round((Date.now() - lastOutageStart) / 1000),
          severity: 'major',
          affectedDevices: ['All devices'],
          cause: 'Network connectivity lost'
        };
        setOutageHistory(prev => [...prev, outage]);
        setLastOutageStart(null);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOutageStart(Date.now());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lastOutageStart]);

  // Start monitoring
  useEffect(() => {
    if (isMonitoring) {
      // Run speed test every 15 minutes
      speedTestInterval.current = setInterval(async () => {
        if (isOnline) {
          const result = await runSpeedTest();
          setSpeedHistory(prev => [...prev.slice(-23), result]); // Keep last 24 tests
        }
      }, 15 * 60 * 1000);

      // Initial speed test
      if (isOnline) {
        runSpeedTest().then(result => {
          setSpeedHistory(prev => [...prev, result]);
        });
      }
    } else {
      if (speedTestInterval.current) {
        clearInterval(speedTestInterval.current);
      }
    }

    return () => {
      if (speedTestInterval.current) {
        clearInterval(speedTestInterval.current);
      }
    };
  }, [isMonitoring, isOnline]);

  // Update network stats when data changes
  useEffect(() => {
    const stats = calculateNetworkStats(speedHistory, outageHistory);
    setNetworkStats(stats);
  }, [speedHistory, outageHistory]);

  const getSpeedStatus = (speed: number, type: 'download' | 'upload') => {
    const threshold = type === 'download' ? 25 : 5;
    if (speed >= threshold * 2) return { status: 'excellent', color: 'bg-green-500' };
    if (speed >= threshold) return { status: 'good', color: 'bg-blue-500' };
    if (speed >= threshold * 0.5) return { status: 'fair', color: 'bg-yellow-500' };
    return { status: 'poor', color: 'bg-red-500' };
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Network Status Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              Network Monitor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? "Stop" : "Start"} Monitoring
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {networkStats.averageDownload}
              </div>
              <div className="text-sm text-gray-600">Avg Download (Mbps)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {networkStats.averageUpload}
              </div>
              <div className="text-sm text-gray-600">Avg Upload (Mbps)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {networkStats.uptime}%
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                networkStats.riskScore < 25 ? 'text-green-600' :
                networkStats.riskScore < 50 ? 'text-yellow-600' :
                networkStats.riskScore < 75 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {networkStats.riskScore}
              </div>
              <div className="text-sm text-gray-600">Risk Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Speed Test */}
      {currentTest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {currentTest.status === 'running' ? 'Running Speed Test...' : 'Latest Speed Test'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentTest.status === 'running' ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Testing network speed...</p>
                </div>
                <Progress value={66} className="w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Download className="h-4 w-4 text-blue-500" />
                    <span className="text-lg font-semibold">{currentTest.downloadSpeed}</span>
                  </div>
                  <div className="text-xs text-gray-600">Download (Mbps)</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Upload className="h-4 w-4 text-green-500" />
                    <span className="text-lg font-semibold">{currentTest.uploadSpeed}</span>
                  </div>
                  <div className="text-xs text-gray-600">Upload (Mbps)</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-lg font-semibold">{currentTest.ping}</span>
                  </div>
                  <div className="text-xs text-gray-600">Ping (ms)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{currentTest.jitter}</div>
                  <div className="text-xs text-gray-600">Jitter (ms)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{currentTest.packetLoss}%</div>
                  <div className="text-xs text-gray-600">Packet Loss</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detailed Tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Speed History</TabsTrigger>
          <TabsTrigger value="outages">Outage Log</TabsTrigger>
          <TabsTrigger value="analysis">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Speed Test History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {speedHistory.slice(-10).reverse().map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        {formatTimestamp(test.timestamp)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{test.downloadSpeed} Mbps</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{test.uploadSpeed} Mbps</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{test.ping} ms</span>
                      </div>
                    </div>
                    <Badge variant={test.status === 'completed' ? 'default' : 'destructive'}>
                      {test.status}
                    </Badge>
                  </div>
                ))}
                {speedHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No speed test data available. Start monitoring to begin collecting data.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Network Outage Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {outageHistory.slice(-10).reverse().map((outage) => (
                  <div key={outage.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-600">
                          {formatTimestamp(outage.startTime)}
                        </span>
                      </div>
                      <div className="font-medium">
                        Duration: {formatDuration(outage.duration || 0)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Affected: {outage.affectedDevices.join(', ')}
                      </div>
                    </div>
                    <Badge variant={
                      outage.severity === 'critical' ? 'destructive' :
                      outage.severity === 'major' ? 'secondary' : 'outline'
                    }>
                      {outage.severity}
                    </Badge>
                  </div>
                ))}
                {outageHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No outages detected. Your network has been stable!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Network Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Trends</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Download Speed Trend</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Stable</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Upload Speed Trend</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Improving</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Latency Trend</span>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Increasing</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Risk Factors</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Peak Usage Impact</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Outage Frequency</span>
                      <Badge variant="outline">Low</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Speed Consistency</span>
                      <Badge variant="default">Good</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Consider upgrading to a higher speed plan for better family coverage</li>
                  <li>• Monitor usage during peak hours (7-9 PM) for potential slowdowns</li>
                  <li>• Set up automatic router restarts weekly to maintain optimal performance</li>
                  <li>• Consider mesh network setup for better coverage in larger homes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};