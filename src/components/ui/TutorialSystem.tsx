import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Badge } from './badge'
import { X, ArrowRight, ArrowLeft, CheckCircle, Star, Shield, Users, Wifi, Play, Laptop, Bell, Brain, Network } from 'lucide-react'

interface TutorialStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  highlight?: string
  action?: string
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to HAVEN!',
    description: 'HAVEN helps keep your family safe online. Let\'s take a quick tour to show you how everything works.',
    icon: Shield,
    action: 'Get Started'
  },
  {
    id: 'cyber-score',
    title: 'Your Cyber Risk Score',
    description: 'This is your family\'s overall safety score. The higher the number, the safer you are! Click it anytime to see details.',
    icon: Star,
    highlight: 'center-score',
    action: 'Got it!'
  },
  {
    id: 'orbit-icons',
    title: 'Your Family\'s Digital Life',
    description: 'These icons show different parts of your digital life - family members, Wi-Fi, apps, devices, and more. Click any icon to explore!',
    icon: Users,
    highlight: 'orbit-icons',
    action: 'Show me more'
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    description: 'Hover over any icon to see quick actions you can take. These help improve your safety score instantly!',
    icon: CheckCircle,
    highlight: 'orbit-icons',
    action: 'Cool!'
  },
  {
    id: 'bottom-panel',
    title: 'Quick Access Panel',
    description: 'Use these buttons for quick checks, asking Haven questions, or accessing settings anytime.',
    icon: Brain,
    highlight: 'bottom-panel',
    action: 'Perfect!'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You\'re ready to keep your family safe online. Remember, HAVEN is here to help - just click around and explore!',
    icon: CheckCircle,
    action: 'Start Exploring'
  }
]

interface TutorialSystemProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function TutorialSystem({ isOpen, onClose, onComplete }: TutorialSystemProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentStepData = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1
  const isFirstStep = currentStep === 0

  const nextStep = () => {
    if (isLastStep) {
      handleComplete()
      return
    }
    
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(prev => prev + 1)
      setIsAnimating(false)
    }, 200)
  }

  const prevStep = () => {
    if (isFirstStep) return
    
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(prev => prev - 1)
      setIsAnimating(false)
    }, 200)
  }

  const handleComplete = () => {
    onComplete()
    onClose()
  }

  const handleSkip = () => {
    onClose()
  }

  // Add highlight effects to elements
  useEffect(() => {
    if (!isOpen || !currentStepData.highlight) return

    const highlightElement = (selector: string) => {
      const elements = document.querySelectorAll(`[data-tutorial="${selector}"]`)
      elements.forEach(el => {
        el.classList.add('tutorial-highlight')
      })
    }

    const removeHighlight = () => {
      const elements = document.querySelectorAll('.tutorial-highlight')
      elements.forEach(el => {
        el.classList.remove('tutorial-highlight')
      })
    }

    // Add highlight
    if (currentStepData.highlight) {
      setTimeout(() => highlightElement(currentStepData.highlight!), 300)
    }

    // Cleanup
    return () => {
      removeHighlight()
    }
  }, [currentStep, isOpen, currentStepData.highlight])

  if (!isOpen) return null

  const IconComponent = currentStepData.icon

  return (
    <>
      {/* Tutorial Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Tutorial Card */}
        <div className="relative">
          <Card className="w-full max-w-md bg-white shadow-2xl border-0 overflow-hidden">
            {/* Header with progress */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
                    <div className="text-sm opacity-90">
                      Step {currentStep + 1} of {tutorialSteps.length}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <CardContent className="p-6">
              <div className={`transition-all duration-200 ${isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  {currentStepData.description}
                </p>

                {/* Special content for specific steps */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { icon: Users, label: 'Family', color: 'text-blue-600' },
                      { icon: Wifi, label: 'Wi-Fi', color: 'text-green-600' },
                      { icon: Play, label: 'Apps', color: 'text-purple-600' },
                      { icon: Laptop, label: 'Devices', color: 'text-cyan-600' },
                      { icon: Network, label: 'Safety Nest', color: 'text-pink-600' },
                      { icon: Bell, label: 'Alerts', color: 'text-orange-600' }
                    ].map((item, index) => (
                      <div key={index} className="text-center p-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="text-xs text-gray-600">{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === tutorialSteps.length - 1 && (
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-800 px-4 py-2">
                      🎉 Tutorial Complete!
                    </Badge>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>

                <div className="flex space-x-2">
                  {!isLastStep && (
                    <Button
                      variant="ghost"
                      onClick={handleSkip}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Skip Tour
                    </Button>
                  )}
                  
                  <Button
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <span>{currentStepData.action || 'Next'}</span>
                    {!isLastStep && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Floating pointer for highlights */}
          {currentStepData.highlight && (
            <div className="absolute -top-4 -right-4 animate-bounce">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-yellow-600 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tutorial Styles */}
      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 60;
          animation: tutorial-pulse 2s infinite;
        }
        
        .tutorial-highlight::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #f59e0b);
          border-radius: inherit;
          z-index: -1;
          animation: tutorial-glow 2s infinite;
        }
        
        @keyframes tutorial-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes tutorial-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </>
  )
}

// Hook to manage tutorial state
export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)

  useEffect(() => {
    // Check if user has seen tutorial before
    const tutorialSeen = localStorage.getItem('haven-tutorial-completed')
    if (tutorialSeen) {
      setHasSeenTutorial(true)
    }
  }, [])

  const startTutorial = () => {
    setShowTutorial(true)
  }

  const completeTutorial = () => {
    localStorage.setItem('haven-tutorial-completed', 'true')
    setHasSeenTutorial(true)
    setShowTutorial(false)
  }

  const closeTutorial = () => {
    setShowTutorial(false)
  }

  const resetTutorial = () => {
    localStorage.removeItem('haven-tutorial-completed')
    setHasSeenTutorial(false)
  }

  return {
    showTutorial,
    hasSeenTutorial,
    startTutorial,
    completeTutorial,
    closeTutorial,
    resetTutorial
  }
}