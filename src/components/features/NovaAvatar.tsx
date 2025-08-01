import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { X, MessageCircle, Shield, Lightbulb, HelpCircle } from 'lucide-react'

interface NovaAvatarProps {
  message: string
  isVisible: boolean
  onToggle?: () => void
  context?: 'onboarding' | 'dashboard' | 'scanning' | 'controls'
}

export function NovaAvatar({ message, isVisible, onToggle, context = 'dashboard' }: NovaAvatarProps) {
  const [showMessage, setShowMessage] = useState(false)
  const [currentTip, setCurrentTip] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)

  const getContextualTips = () => {
    switch (context) {
      case 'scanning':
        return [
          "I'm scanning all your connected devices for security risks. This won't access any personal content.",
          "Found some areas we can improve! Don't worry, I'll help you fix them step by step.",
          "Your household scan is complete. Let me show you what I discovered.",
          "Great news! Your security posture is stronger than most families."
        ]
      case 'controls':
        return [
          "Based on your risk profile and usage, I've prepared actions to help keep your family safer.",
          "We noticed a few devices could use stronger protection. Want me to take care of it?",
          "These automated controls will run quietly in the background to protect your family.",
          "You can always review or modify any controls I've applied. You're in complete control."
        ]
      case 'onboarding':
        return [
          "Hi, I'm Nova. I'll help you get your digital household protected in just a few steps.",
          "Let's talk about what you want to protect. Pick the areas that matter most to your family.",
          "Would you like HAVEN to be hands-on, or stay quiet until something important happens?",
          "You're all set! Here's a quick summary of your setup plan. You can always change it later."
        ]
      default:
        return [
          "Your cyber risk score looks great! Keep up the good security habits.",
          "I noticed some unusual activity. Would you like me to investigate?",
          "Time for your weekly security check-in. Shall we review your protection?",
          "New security update available for your smart TV. Want me to help you install it?",
          "Your family's digital safety has improved this week. Well done!"
        ]
    }
  }

  const tips = getContextualTips()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 10000) // Change tip every 10 seconds

    return () => clearInterval(interval)
  }, [tips.length])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowMessage(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Speech Bubble */}
      {showMessage && !isMinimized && (
        <Card className="mb-4 max-w-xs bg-white shadow-lg border-blue-200 animate-in slide-in-from-bottom-2">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-1">Nova says:</p>
                <p className="text-sm text-slate-700">{message || tips[currentTip]}</p>
                <div className="flex items-center space-x-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowMessage(false)}
                    className="text-xs"
                  >
                    Got it
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsMinimized(true)}
                    className="text-xs"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            {/* Speech bubble tail */}
            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nova Avatar */}
      <div 
        className="relative cursor-pointer"
        onClick={() => {
          if (isMinimized) {
            setIsMinimized(false)
            setShowMessage(true)
          } else {
            setShowMessage(!showMessage)
          }
        }}
      >
        {/* Holographic glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 opacity-75 animate-pulse blur-sm"></div>
        
        {/* Orbital rings */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-50 animate-spin-slow"></div>
        <div className="absolute inset-2 rounded-full border border-purple-300 opacity-30 animate-spin-reverse"></div>
        
        {/* Main avatar */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
          
          {/* Floating particles */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-300 rounded-full animate-float opacity-60"></div>
          <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-purple-300 rounded-full animate-float-delayed opacity-60"></div>
          <div className="absolute top-2 -right-2 w-1 h-1 bg-blue-200 rounded-full animate-float-slow opacity-40"></div>
          
          {/* Nova's face/icon */}
          <div className="relative z-10">
            <Shield className="w-8 h-8 text-white" />
          </div>
          
          {/* Notification dot */}
          {showMessage && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-2 h-2 text-white" />
            </div>
          )}
        </div>

        {/* Tooltip on hover */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {isMinimized ? 'Click to chat with Nova' : 'Nova - Your Digital Guardian'}
          </div>
        </div>
      </div>

      {/* Quick action buttons */}
      {!isMinimized && (
        <div className="absolute bottom-full right-0 mb-20 flex flex-col space-y-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-white shadow-md">
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="w-10 h-10 p-0 bg-white shadow-md">
            <Lightbulb className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}