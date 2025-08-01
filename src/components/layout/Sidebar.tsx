import React from 'react'
import { Button } from '../ui/button'
import { HavenLogo } from '../ui/HavenLogo'
import { Home, Settings, BookOpen, Shield } from 'lucide-react'

const navigation = [
  { id: 'dashboard', name: 'Home', icon: Home, emoji: '🏠' },
  { id: 'settings', name: 'My Safety Settings', icon: Settings, emoji: '⚙️' },
  { id: 'journal', name: 'Safety Journal', icon: BookOpen, emoji: '📖' }
]

export function Sidebar({ currentPage, onPageChange }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <HavenLogo size="lg" showTagline={true} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              className="w-full justify-start h-12"
              onClick={() => onPageChange(item.id)}
            >
              <span className="text-xl mr-3">{item.emoji}</span>
              <span>{item.name}</span>
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500">
          <div className="mb-2">🛡️ Protected by HAVEN</div>
          <div className="text-xs">Keeping families safe online</div>
        </div>
      </div>
    </div>
  )
}