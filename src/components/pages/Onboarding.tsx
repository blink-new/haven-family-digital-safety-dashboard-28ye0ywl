import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { 
  Users, 
  Shield, 
  Settings, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Home,
  Smartphone,
  Laptop,
  Tv,
  Speaker,
  Camera,
  Gamepad2,
  CreditCard,
  Mail,
  MessageSquare,
  Music,
  Video,
  Lock,
  AlertTriangle,
  Bell,
  BellOff,
  Zap
} from 'lucide-react'

interface OnboardingProps {
  onComplete: (data: any) => void
}

interface HouseholdMember {
  id: string
  name: string
  age: string
  role: 'adult' | 'teen' | 'child'
}

interface Device {
  id: string
  name: string
  icon: React.ReactNode
  selected: boolean
}

interface Service {
  id: string
  name: string
  category: string
  icon: React.ReactNode
  selected: boolean
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [householdName, setHouseholdName] = useState('')
  const [members, setMembers] = useState<HouseholdMember[]>([])
  const [devices, setDevices] = useState<Device[]>([
    { id: 'smartphones', name: 'Smartphones', icon: <Smartphone className="w-5 h-5" />, selected: false },
    { id: 'laptops', name: 'Laptops/Computers', icon: <Laptop className="w-5 h-5" />, selected: false },
    { id: 'tablets', name: 'Tablets', icon: <Smartphone className="w-5 h-5" />, selected: false },
    { id: 'smart-tv', name: 'Smart TV', icon: <Tv className="w-5 h-5" />, selected: false },
    { id: 'smart-speakers', name: 'Smart Speakers', icon: <Speaker className="w-5 h-5" />, selected: false },
    { id: 'security-cameras', name: 'Security Cameras', icon: <Camera className="w-5 h-5" />, selected: false },
    { id: 'gaming', name: 'Gaming Consoles', icon: <Gamepad2 className="w-5 h-5" />, selected: false },
    { id: 'smart-home', name: 'Smart Home Devices', icon: <Home className="w-5 h-5" />, selected: false }
  ])
  
  const [services, setServices] = useState<Service[]>([
    { id: 'email', name: 'Email (Gmail, Outlook)', category: 'Communication', icon: <Mail className="w-5 h-5" />, selected: false },
    { id: 'banking', name: 'Online Banking', category: 'Financial', icon: <CreditCard className="w-5 h-5" />, selected: false },
    { id: 'streaming', name: 'Streaming (Netflix, Disney+)', category: 'Entertainment', icon: <Video className="w-5 h-5" />, selected: false },
    { id: 'social', name: 'Social Media', category: 'Social', icon: <MessageSquare className="w-5 h-5" />, selected: false },
    { id: 'music', name: 'Music Streaming', category: 'Entertainment', icon: <Music className="w-5 h-5" />, selected: false },
    { id: 'gaming-services', name: 'Gaming Services', category: 'Entertainment', icon: <Gamepad2 className="w-5 h-5" />, selected: false },
    { id: 'cloud-storage', name: 'Cloud Storage', category: 'Productivity', icon: <Shield className="w-5 h-5" />, selected: false },
    { id: 'shopping', name: 'Online Shopping', category: 'Commerce', icon: <CreditCard className="w-5 h-5" />, selected: false }
  ])

  const [cyberHabits, setCyberHabits] = useState({
    passwordManager: '',
    deviceSharing: '',
    emailLinks: '',
    updates: '',
    publicWifi: '',
    socialSharing: ''
  })

  const [preferences, setPreferences] = useState({
    alertFrequency: '',
    automationLevel: '',
    communicationMethod: ''
  })

  const addMember = () => {
    const newMember: HouseholdMember = {
      id: Date.now().toString(),
      name: '',
      age: '',
      role: 'adult'
    }
    setMembers([...members, newMember])
  }

  const updateMember = (id: string, field: keyof HouseholdMember, value: string) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ))
  }

  const removeMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id))
  }

  const toggleDevice = (deviceId: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId ? { ...device, selected: !device.selected } : device
    ))
  }

  const toggleService = (serviceId: string) => {
    setServices(services.map(service => 
      service.id === serviceId ? { ...service, selected: !service.selected } : service
    ))
  }

  const calculateRiskScore = () => {
    let baseScore = 500 // Starting score
    
    // Device diversity bonus
    const selectedDevices = devices.filter(d => d.selected).length
    baseScore += Math.min(selectedDevices * 15, 100)
    
    // Service security impact
    const selectedServices = services.filter(s => s.selected)
    const financialServices = selectedServices.filter(s => s.category === 'Financial').length
    baseScore += financialServices * 20
    
    // Cyber habits impact
    if (cyberHabits.passwordManager === 'yes') baseScore += 50
    if (cyberHabits.deviceSharing === 'no') baseScore += 30
    if (cyberHabits.emailLinks === 'no') baseScore += 40
    if (cyberHabits.updates === 'always') baseScore += 35
    if (cyberHabits.publicWifi === 'never') baseScore += 25
    if (cyberHabits.socialSharing === 'minimal') baseScore += 20
    
    // Automation preference bonus
    if (preferences.automationLevel === 'full') baseScore += 30
    
    return Math.min(Math.max(baseScore, 300), 850)
  }

  const getNovaMessage = () => {
    switch (currentStep) {
      case 1:
        return "Hi, I'm Nova! Let's get to know your household so we can keep you safe online. Tell me about your family and the devices you use."
      case 2:
        return "Great! Now tell me which services and devices you use. The more we know, the better we can protect you."
      case 3:
        return "Let's talk about your digital habits. How do you usually handle passwords, updates, and online safety?"
      case 4:
        return "Almost done! How would you like HAVEN to communicate with you about security matters?"
      default:
        return "Welcome to HAVEN! I'm here to help protect your family's digital life."
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      const calculatedScore = calculateRiskScore()
      const onboardingData = {
        householdName,
        members,
        devices: devices.filter(d => d.selected),
        services: services.filter(s => s.selected),
        cyberHabits,
        preferences,
        calculatedScore
      }
      onComplete(onboardingData)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return householdName.trim() !== '' && members.length > 0
      case 2:
        return devices.some(d => d.selected) && services.some(s => s.selected)
      case 3:
        return Object.values(cyberHabits).every(value => value !== '')
      case 4:
        return Object.values(preferences).every(value => value !== '')
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">HAVEN Setup</h1>
          </div>
          
          <Progress value={(currentStep / 4) * 100} className="w-full mb-4" />
          
          <div className="flex justify-center space-x-8 text-sm">
            {[
              { step: 1, icon: Users, label: 'Household' },
              { step: 2, icon: Shield, label: 'Digital Footprint' },
              { step: 3, icon: Lock, label: 'Cyber Habits' },
              { step: 4, icon: Settings, label: 'Preferences' }
            ].map(({ step, icon: Icon, label }) => (
              <div key={step} className={`flex flex-col items-center space-y-1 ${
                currentStep >= step ? 'text-blue-600' : 'text-slate-400'
              }`}>
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Nova's Message */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Nova says:</p>
                  <p className="text-sm text-blue-800">{getNovaMessage()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Household Setup */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="household-name">What should we call your household?</Label>
                <Input
                  id="household-name"
                  placeholder="e.g., The Johnson Family"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Who lives in your household?</Label>
                  <Button onClick={addMember} variant="outline" size="sm">
                    Add Member
                  </Button>
                </div>

                <div className="space-y-3">
                  {members.map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                          <Label>Name</Label>
                          <Input
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Age</Label>
                          <Input
                            placeholder="Age"
                            value={member.age}
                            onChange={(e) => updateMember(member.id, 'age', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <RadioGroup
                            value={member.role}
                            onValueChange={(value) => updateMember(member.id, 'role', value)}
                          >
                            <div className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="adult" id={`adult-${member.id}`} />
                                <Label htmlFor={`adult-${member.id}`}>Adult</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="teen" id={`teen-${member.id}`} />
                                <Label htmlFor={`teen-${member.id}`}>Teen</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="child" id={`child-${member.id}`} />
                                <Label htmlFor={`child-${member.id}`}>Child</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                        <Button
                          onClick={() => removeMember(member.id)}
                          variant="outline"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Digital Footprint Assessment */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">What devices does your household use?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {devices.map((device) => (
                    <Card
                      key={device.id}
                      className={`p-4 cursor-pointer transition-all ${
                        device.selected 
                          ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' 
                          : 'hover:bg-slate-50'
                      }`}
                      onClick={() => toggleDevice(device.id)}
                    >
                      <div className="flex flex-col items-center space-y-2 text-center">
                        {device.icon}
                        <span className="text-sm font-medium">{device.name}</span>
                        {device.selected && <CheckCircle className="w-4 h-4 text-blue-600" />}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Which online services do you use?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={`p-4 cursor-pointer transition-all ${
                        service.selected 
                          ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' 
                          : 'hover:bg-slate-50'
                      }`}
                      onClick={() => toggleService(service.id)}
                    >
                      <div className="flex items-center space-x-3">
                        {service.icon}
                        <div className="flex-1">
                          <div className="font-medium">{service.name}</div>
                          <Badge variant="secondary" className="text-xs">
                            {service.category}
                          </Badge>
                        </div>
                        {service.selected && <CheckCircle className="w-5 h-5 text-blue-600" />}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Cyber Habits & Risk Behaviors */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Do you use a password manager?</Label>
                  <RadioGroup
                    value={cyberHabits.passwordManager}
                    onValueChange={(value) => setCyberHabits({...cyberHabits, passwordManager: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="pm-yes" />
                      <Label htmlFor="pm-yes">Yes, I use one regularly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sometimes" id="pm-sometimes" />
                      <Label htmlFor="pm-sometimes">Sometimes, but not for everything</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="pm-no" />
                      <Label htmlFor="pm-no">No, I remember my passwords</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">Do family members share devices?</Label>
                  <RadioGroup
                    value={cyberHabits.deviceSharing}
                    onValueChange={(value) => setCyberHabits({...cyberHabits, deviceSharing: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="share-no" />
                      <Label htmlFor="share-no">No, everyone has their own accounts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sometimes" id="share-sometimes" />
                      <Label htmlFor="share-sometimes">Sometimes, for specific apps</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="share-yes" />
                      <Label htmlFor="share-yes">Yes, we share most things</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">Do you click links in emails from unknown senders?</Label>
                  <RadioGroup
                    value={cyberHabits.emailLinks}
                    onValueChange={(value) => setCyberHabits({...cyberHabits, emailLinks: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="links-no" />
                      <Label htmlFor="links-no">Never, I'm very careful</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sometimes" id="links-sometimes" />
                      <Label htmlFor="links-sometimes">Sometimes, if they look legitimate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="links-yes" />
                      <Label htmlFor="links-yes">Yes, I usually click to see what it is</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">How often do you update your devices?</Label>
                  <RadioGroup
                    value={cyberHabits.updates}
                    onValueChange={(value) => setCyberHabits({...cyberHabits, updates: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="always" id="updates-always" />
                      <Label htmlFor="updates-always">Immediately when available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="updates-monthly" />
                      <Label htmlFor="updates-monthly">Once a month or so</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rarely" id="updates-rarely" />
                      <Label htmlFor="updates-rarely">Only when forced to</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">Do you use public Wi-Fi for sensitive activities?</Label>
                  <RadioGroup
                    value={cyberHabits.publicWifi}
                    onValueChange={(value) => setCyberHabits({...cyberHabits, publicWifi: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="wifi-never" />
                      <Label htmlFor="wifi-never">Never, I avoid it completely</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="careful" id="wifi-careful" />
                      <Label htmlFor="wifi-careful">Only for basic browsing, not banking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="wifi-yes" />
                      <Label htmlFor="wifi-yes">Yes, I use it for everything</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">How much personal information do you share on social media?</Label>
                  <RadioGroup
                    value={cyberHabits.socialSharing}
                    onValueChange={(value) => setCyberHabits({...cyberHabits, socialSharing: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minimal" id="social-minimal" />
                      <Label htmlFor="social-minimal">Very little, I keep things private</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="social-moderate" />
                      <Label htmlFor="social-moderate">Some photos and updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="open" id="social-open" />
                      <Label htmlFor="social-open">I share most things publicly</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Security Preferences */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">How often would you like security alerts?</Label>
                <RadioGroup
                  value={preferences.alertFrequency}
                  onValueChange={(value) => setPreferences({...preferences, alertFrequency: value})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediate" id="alert-immediate" />
                    <Label htmlFor="alert-immediate">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4" />
                        <span>Immediate - Tell me about everything</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="alert-daily" />
                    <Label htmlFor="alert-daily">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Daily summary - Important things only</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="alert-weekly" />
                    <Label htmlFor="alert-weekly">
                      <div className="flex items-center space-x-2">
                        <BellOff className="w-4 h-4" />
                        <span>Weekly digest - Keep it minimal</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">How much should HAVEN handle automatically?</Label>
                <RadioGroup
                  value={preferences.automationLevel}
                  onValueChange={(value) => setPreferences({...preferences, automationLevel: value})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="auto-full" />
                    <Label htmlFor="auto-full">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Full automation - Handle everything for me</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="guided" id="auto-guided" />
                    <Label htmlFor="auto-guided">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Guided - Ask me before taking action</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="auto-manual" />
                    <Label htmlFor="auto-manual">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span>Manual - Just monitor and report</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">How should we contact you?</Label>
                <RadioGroup
                  value={preferences.communicationMethod}
                  onValueChange={(value) => setPreferences({...preferences, communicationMethod: value})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="app" id="comm-app" />
                    <Label htmlFor="comm-app">In-app notifications only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="comm-email" />
                    <Label htmlFor="comm-email">Email notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="comm-both" />
                    <Label htmlFor="comm-both">Both app and email</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              onClick={prevStep}
              variant="outline"
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === 4 ? (
                <>
                  Complete Setup
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}