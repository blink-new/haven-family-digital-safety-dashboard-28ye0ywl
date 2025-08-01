import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const avatarOptions = [
  { id: 'nova', name: 'Nova', emoji: '🌟', description: 'Bright and cheerful' },
  { id: 'sage', name: 'Sage', emoji: '🦉', description: 'Wise and thoughtful' },
  { id: 'buddy', name: 'Buddy', emoji: '🐕', description: 'Loyal and friendly' },
  { id: 'spark', name: 'Spark', emoji: '⚡', description: 'Quick and energetic' },
  { id: 'zen', name: 'Zen', emoji: '🧘', description: 'Calm and peaceful' },
  { id: 'scout', name: 'Scout', emoji: '🔍', description: 'Alert and watchful' }
]

const voiceTones = [
  { id: 'friendly', name: 'Friendly', description: 'Warm and encouraging' },
  { id: 'professional', name: 'Professional', description: 'Clear and direct' },
  { id: 'casual', name: 'Casual', description: 'Relaxed and easy-going' },
  { id: 'caring', name: 'Caring', description: 'Gentle and nurturing' }
]

export function GuardianCustomization({ onGuardianCreated }) {
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0])
  const [selectedTone, setSelectedTone] = useState(voiceTones[0])
  const [customName, setCustomName] = useState('')
  const [step, setStep] = useState(1)

  const handleContinue = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else {
      const guardian = {
        ...selectedAvatar,
        name: customName || selectedAvatar.name,
        tone: selectedTone,
        id: Date.now()
      }
      onGuardianCreated(guardian)
    }
  }

  const getGreeting = () => {
    const name = customName || selectedAvatar.name
    switch (selectedTone.id) {
      case 'friendly':
        return `Hi there! I'm ${name}, and I'm so excited to help keep your family safe online! 😊`
      case 'professional':
        return `Hello, I'm ${name}. I'll be your digital safety companion, helping protect what matters most to your family.`
      case 'casual':
        return `Hey! ${name} here. Ready to make your digital life a whole lot safer and simpler?`
      case 'caring':
        return `Hello dear, I'm ${name}. Think of me as your family's gentle guardian, always looking out for you. 💙`
      default:
        return `Hi! I'm ${name}, your new digital safety companion!`
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Your AI Guardian
          </h1>
          <p className="text-xl text-gray-600">
            Let's create your personal digital safety companion
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">
              {step === 1 && "Choose Your Guardian's Look"}
              {step === 2 && "Pick Their Voice Style"}
              {step === 3 && "Give Them a Name"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedAvatar.id === avatar.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{avatar.emoji}</div>
                    <div className="font-medium">{avatar.name}</div>
                    <div className="text-sm text-gray-500">{avatar.description}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {voiceTones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedTone.id === tone.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{tone.name}</div>
                    <div className="text-sm text-gray-500">{tone.description}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">{selectedAvatar.emoji}</div>
                  <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 italic">"{getGreeting()}"</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What would you like to call me? (Optional)
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={`Leave blank to use "${selectedAvatar.name}"`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                className="ml-auto"
              >
                {step === 3 ? "Let's Get Started!" : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}