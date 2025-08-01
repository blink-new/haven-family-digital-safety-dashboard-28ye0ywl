import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import OnboardingSecurityDiscovery from '../features/OnboardingSecurityDiscovery'

const householdMembers = [
  { id: 'adults', label: 'Adults', emoji: '👨‍👩‍👧‍👦', description: 'Parents, guardians, grown-ups' },
  { id: 'teens', label: 'Teenagers', emoji: '🧑‍🎓', description: '13-17 years old' },
  { id: 'kids', label: 'Kids', emoji: '👶', description: '12 and under' },
  { id: 'elderly', label: 'Grandparents', emoji: '👴👵', description: 'Older family members' },
  { id: 'guests', label: 'Visitors', emoji: '👥', description: 'Friends who use our devices' }
]

const protectionAreas = [
  { id: 'media', label: 'Family Photos & Videos', emoji: '📸', description: 'Keep memories private' },
  { id: 'money', label: 'Banking & Shopping', emoji: '💳', description: 'Protect financial info' },
  { id: 'kids', label: 'Kids\' Online Time', emoji: '🛡️', description: 'Safe browsing for children' },
  { id: 'privacy', label: 'Personal Information', emoji: '🔒', description: 'Names, addresses, phone numbers' },
  { id: 'devices', label: 'Smart Home Devices', emoji: '🏠', description: 'TVs, speakers, cameras' },
  { id: 'social', label: 'Social Media', emoji: '📱', description: 'Facebook, Instagram, TikTok' }
]

const guardianModes = [
  {
    id: 'quiet',
    title: 'Quiet Mode',
    emoji: '🤫',
    description: 'Just fix things quietly',
    details: 'I\'ll handle most things behind the scenes and only tell you about big issues.'
  },
  {
    id: 'balanced',
    title: 'Show Me Everything',
    emoji: '👀',
    description: 'Keep me in the loop',
    details: 'I\'ll ask before making changes and keep you updated on what\'s happening.'
  },
  {
    id: 'handsfree',
    title: 'Just Fix Things',
    emoji: '🔧',
    description: 'Full auto-pilot',
    details: 'I\'ll take care of everything automatically and send you a weekly summary.'
  }
]

export function FriendlyOnboarding({ guardian, onComplete }) {
  const [step, setStep] = useState(1)
  const [selectedMembers, setSelectedMembers] = useState([])
  const [selectedProtection, setSelectedProtection] = useState([])
  const [discoveryCompleted, setDiscoveryCompleted] = useState(false)
  const [discoveryData, setDiscoveryData] = useState(null)
  const [selectedMode, setSelectedMode] = useState(null)

  const getGuardianMessage = () => {
    switch (step) {
      case 1:
        return "Let's start with the basics - who's part of your household? This helps me understand who I'm protecting! 🏠"
      case 2:
        return "Great! Now, what matters most to your family? I can focus on the areas you care about most. ✨"
      case 3:
        return "Let me scan your network to find what security tools you already have. I'll help you save money and avoid duplicates! 🔍"
      case 4:
        return "Perfect! Last question - how would you like me to work? I can be hands-on or stay in the background. 🤔"
      default:
        return "Hi there! Ready to get started? 😊"
    }
  }

  const handleMemberToggle = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleProtectionToggle = (protectionId) => {
    setSelectedProtection(prev => 
      prev.includes(protectionId) 
        ? prev.filter(id => id !== protectionId)
        : [...prev, protectionId]
    )
  }

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Save onboarding data and complete
      const onboardingData = {
        household: selectedMembers,
        protection: selectedProtection,
        discoveryCompleted: discoveryCompleted,
        discoveryData: discoveryData,
        mode: selectedMode,
        guardian: guardian
      }
      localStorage.setItem('havenOnboarding', JSON.stringify(onboardingData))
      onComplete()
    }
  }

  const canContinue = () => {
    switch (step) {
      case 1: return selectedMembers.length > 0
      case 2: return selectedProtection.length > 0
      case 3: return discoveryCompleted
      case 4: return selectedMode !== null
      default: return false
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Guardian Avatar & Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <span className="text-4xl">{guardian.emoji}</span>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{guardian.emoji}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">{guardian.name}</div>
                <div className="text-gray-700">{getGuardianMessage()}</div>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {step === 1 && "Who lives in your household?"}
                {step === 2 && "What do you want to protect?"}
                {step === 3 && "Discover your existing security tools"}
                {step === 4 && "How should I help you?"}
              </CardTitle>
              <div className="text-sm text-gray-500">
                Step {step} of 4
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {householdMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => handleMemberToggle(member.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                      selectedMembers.includes(member.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={selectedMembers.includes(member.id)}
                        readOnly
                      />
                      <div className="text-3xl">{member.emoji}</div>
                      <div className="flex-1">
                        <div className="font-medium">{member.label}</div>
                        <div className="text-sm text-gray-500">{member.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {protectionAreas.map((area) => (
                  <div
                    key={area.id}
                    onClick={() => handleProtectionToggle(area.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                      selectedProtection.includes(area.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={selectedProtection.includes(area.id)}
                        readOnly
                      />
                      <div className="text-3xl">{area.emoji}</div>
                      <div className="flex-1">
                        <div className="font-medium">{area.label}</div>
                        <div className="text-sm text-gray-500">{area.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="w-full">
                <OnboardingSecurityDiscovery 
                  onComplete={(data) => {
                    setDiscoveryData(data);
                    setDiscoveryCompleted(true);
                  }} 
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                {guardianModes.map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setSelectedMode(mode)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMode?.id === mode.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{mode.emoji}</div>
                      <div className="flex-1">
                        <div className="font-medium text-lg">{mode.title}</div>
                        <div className="text-gray-600 mb-2">{mode.description}</div>
                        <div className="text-sm text-gray-500">{mode.details}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleContinue}
                disabled={!canContinue()}
                className="ml-auto"
              >
                {step === 4 ? "All Set!" : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}