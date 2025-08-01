import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Users, Wifi, Play, Laptop, Bell, Brain, Shield, CheckCircle, Star } from 'lucide-react'
import { ModernIcon } from '../ui/ModernIcon'

export function BasicHomepage() {
  const [selectedModal, setSelectedModal] = useState<string | null>(null)

  const cyberScore = 85

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">HAVEN</h1>
            <p className="text-sm text-gray-600">Keeping your family safe online</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">Help</Button>
            <Button variant="ghost" size="sm">Settings</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Central Score */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <div className="w-40 h-40 bg-white rounded-full shadow-xl border-4 border-gray-100 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-blue-600">{cyberScore}</div>
              <div className="text-sm text-gray-600 font-medium">Grade A-</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500 mr-1">↗️</span>
                <span className="text-xs text-gray-500">Today</span>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-xl font-medium text-gray-800">Cyber Risk Score</div>
            <div className="text-gray-600">Your family's digital safety</div>
            <Badge className="mt-2 bg-green-100 text-green-800 flex items-center gap-2">
              <ModernIcon name="checkCircle" size="sm" />
              Looking Good!
            </Badge>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Family Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Family</h3>
                  <p className="text-sm text-gray-600">4 members</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">Emma: 3h screen time today</p>
              <Button size="sm" variant="outline" className="w-full">
                Review Limits
              </Button>
            </CardContent>
          </Card>

          {/* Wi-Fi Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Wi-Fi</h3>
                  <p className="text-sm text-gray-600">Secure</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">2 unknown devices detected</p>
              <Button size="sm" variant="outline" className="w-full">
                Secure Network
              </Button>
            </CardContent>
          </Card>

          {/* Apps Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Apps & Services</h3>
                  <p className="text-sm text-gray-600">8 connected</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">1 vulnerable account</p>
              <Button size="sm" variant="outline" className="w-full">
                Review Alert
              </Button>
            </CardContent>
          </Card>

          {/* Devices Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Laptop className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Devices</h3>
                  <p className="text-sm text-gray-600">12 gadgets</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                All devices updated
                <ModernIcon name="checkCircle" size="sm" className="text-green-600" />
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Run Check
              </Button>
            </CardContent>
          </Card>

          {/* Alerts Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Alerts</h3>
                  <p className="text-sm text-gray-600">2 active</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">Late-night activity detected</p>
              <Button size="sm" variant="outline" className="w-full">
                Review Activity
              </Button>
            </CardContent>
          </Card>

          {/* AI Assistant Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Ask Haven</h3>
                  <p className="text-sm text-gray-600">AI Assistant</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">Screen time improved +5 pts</p>
              <Button size="sm" variant="outline" className="w-full">
                Ask Question
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <ModernIcon name="tv" size="lg" className="text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">Smart TV Update Available</div>
                    <div className="text-sm text-gray-600">Your Samsung TV has a security update waiting</div>
                    <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Worth Checking</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <ModernIcon name="smartphone" size="lg" className="text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium">New App Installed</div>
                    <div className="text-sm text-gray-600">Emma installed Discord on her phone</div>
                    <div className="text-xs text-gray-500 mt-1">1 day ago</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Just FYI</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 px-8 py-4 inline-flex items-center space-x-6">
            <Button size="sm" variant="ghost" className="rounded-full hover:bg-blue-100">
              <ModernIcon name="search" size="sm" className="mr-2" />
              Quick Scan
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button size="sm" variant="ghost" className="rounded-full hover:bg-green-100">
              <ModernIcon name="chat" size="sm" className="mr-2" />
              Ask Haven
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button size="sm" variant="ghost" className="rounded-full hover:bg-purple-100">
              <ModernIcon name="settings" size="sm" className="mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}