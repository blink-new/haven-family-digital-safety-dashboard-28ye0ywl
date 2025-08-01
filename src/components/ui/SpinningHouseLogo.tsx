import React, { useState } from 'react'

interface SpinningHouseLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
  interactive?: boolean
}

export function SpinningHouseLogo({ 
  size = 'md', 
  className = '', 
  onClick,
  interactive = true 
}: SpinningHouseLogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-28 h-28'
  }

  const handleMouseDown = () => {
    if (interactive) {
      setIsDragging(true)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsDragging(false)
  }

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
    >
      {/* Ambient glow effect */}
      <div 
        className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-green-400/20 blur-xl transition-all duration-500 ${
          isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-60'
        }`}
      />
      
      {/* Floating particles */}
      {interactive && (
        <>
          <div className="absolute -top-2 -left-2 w-1 h-1 bg-blue-400 rounded-full animate-float-1" />
          <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-green-400 rounded-full animate-float-2" />
          <div className="absolute -bottom-2 -left-1 w-1 h-1 bg-purple-400 rounded-full animate-float-3" />
          <div className="absolute -bottom-1 -right-2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-float-1" />
        </>
      )}
      
      {/* Main house logo */}
      <div 
        className={`relative ${sizeClasses[size]} transition-all duration-300 ${
          interactive ? 'cursor-pointer' : ''
        } ${
          isHovered && !isDragging 
            ? 'scale-125 -translate-y-2' 
            : isDragging 
            ? 'scale-95' 
            : 'scale-100'
        }`}
        style={{
          transformOrigin: 'center bottom'
        }}
      >
        {/* Modern House Icon with Shield */}
        <div className={`w-full h-full flex items-center justify-center relative transition-all duration-300 ${
          isHovered ? 'drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]'
        }`}>
          {/* Main House Icon */}
          <div className="relative">
            <Home className={`${
              size === 'sm' ? 'w-8 h-8' : 
              size === 'md' ? 'w-12 h-12' : 
              size === 'lg' ? 'w-16 h-16' : 'w-14 h-14'
            } text-blue-600 stroke-2`} />
            
            {/* Shield overlay */}
            <div className="absolute -bottom-1 -right-1">
              <Shield className={`${
                size === 'sm' ? 'w-4 h-4' : 
                size === 'md' ? 'w-6 h-6' : 
                size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
              } text-green-500 fill-green-500/20 stroke-2`} />
            </div>
          </div>
        </div>
        
        {/* Holographic overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-50'
          }`}
          style={{
            background: isHovered 
              ? 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)'
              : 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)'
          }}
        />
        
        {/* Pulsing ring */}
        {interactive && (
          <div 
            className={`absolute inset-0 border-2 transition-all duration-500 ${
              isHovered 
                ? 'border-blue-400/60 scale-110' 
                : 'border-green-400/40 scale-100'
            }`}
            style={{
              animation: 'pulse-ring 3s ease-in-out infinite',
              borderRadius: '20%'
            }}
          />
        )}
      </div>
      
      {/* Status indicator */}
      {interactive && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse">
          <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75" />
        </div>
      )}
    </div>
  )
}

// Header version - smaller and simpler
export function HeaderLogo() {
  return (
    <div className="flex items-center space-x-3">
      <SpinningHouseLogo size="sm" interactive={false} />
      <div>
        <h1 className="text-xl font-bold text-gray-900">HAVEN</h1>
        <p className="text-xs text-gray-500">Family Digital Safety</p>
      </div>
    </div>
  )
}