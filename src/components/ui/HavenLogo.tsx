import React from 'react'
import { Shield } from 'lucide-react'

interface HavenLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  className?: string
  showTagline?: boolean
}

const sizeClasses = {
  sm: {
    container: 'h-8',
    icon: 'w-6 h-6',
    text: 'text-lg',
    tagline: 'text-xs'
  },
  md: {
    container: 'h-10',
    icon: 'w-8 h-8',
    text: 'text-xl',
    tagline: 'text-sm'
  },
  lg: {
    container: 'h-12',
    icon: 'w-10 h-10',
    text: 'text-2xl',
    tagline: 'text-base'
  },
  xl: {
    container: 'h-16',
    icon: 'w-12 h-12',
    text: 'text-3xl',
    tagline: 'text-lg'
  }
}

export function HavenLogo({ 
  size = 'md', 
  variant = 'full', 
  className = '',
  showTagline = false 
}: HavenLogoProps) {
  const sizes = sizeClasses[size]

  if (variant === 'icon') {
    return (
      <div className={`${sizes.container} ${className} flex items-center justify-center`}>
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-2 shadow-lg">
            <Shield className={`${sizes.icon} text-white`} />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={`${className} flex flex-col`}>
        <div className={`font-bold text-gray-800 ${sizes.text} tracking-tight`}>
          HAVEN
        </div>
        {showTagline && (
          <div className={`text-gray-600 ${sizes.tagline} font-medium`}>
            Family Digital Safety
          </div>
        )}
      </div>
    )
  }

  // Full variant (default)
  return (
    <div className={`${className} flex items-center space-x-3`}>
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Shield className={`${sizes.icon} text-white`} />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      </div>
      <div className="flex flex-col">
        <div className={`font-bold text-gray-800 ${sizes.text} tracking-tight`}>
          HAVEN
        </div>
        {showTagline && (
          <div className={`text-gray-600 ${sizes.tagline} font-medium`}>
            Family Digital Safety
          </div>
        )}
      </div>
    </div>
  )
}

// Animated version for special occasions
export function HavenLogoAnimated({ 
  size = 'md', 
  className = '',
  showTagline = true 
}: Omit<HavenLogoProps, 'variant'>) {
  const sizes = sizeClasses[size]

  return (
    <div className={`${className} flex items-center space-x-3 group cursor-pointer`}>
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-lg p-2 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 group-hover:rotate-3 animate-pulse-glow">
          <Shield className={`${sizes.icon} text-white group-hover:animate-bounce`} />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-bounce group-hover:animate-ping"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-2 -left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-75 animation-delay-300"></div>
          <div className="absolute -top-2 -right-2 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-50 animation-delay-600"></div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className={`font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent ${sizes.text} tracking-tight group-hover:scale-105 transition-all duration-300`}>
          HAVEN
        </div>
        {showTagline && (
          <div className={`text-gray-600 ${sizes.tagline} font-medium group-hover:text-blue-600 transition-colors duration-300`}>
            Family Digital Safety
          </div>
        )}
      </div>
    </div>
  )
}

// Compact version for headers and navigation
export function HavenBrand({ className = '' }: { className?: string }) {
  return (
    <div className={`${className} flex items-center space-x-2`}>
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-md p-1.5 shadow-md">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
      </div>
      <span className="font-bold text-gray-800 text-lg tracking-tight">HAVEN</span>
    </div>
  )
}