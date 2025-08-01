import React from 'react'
import { Shield, Brain, CheckCircle, AlertTriangle, Lock, Globe, Users, Zap } from 'lucide-react'

interface EnhancedIconProps {
  type: 'shield' | 'robot' | 'success' | 'warning' | 'security' | 'network' | 'family' | 'power'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'solid' | 'outline' | 'gradient'
  animated?: boolean
  className?: string
}

const iconMap = {
  shield: Shield,
  robot: Brain,
  success: CheckCircle,
  warning: AlertTriangle,
  security: Lock,
  network: Globe,
  family: Users,
  power: Zap
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10'
}

const gradientClasses = {
  shield: 'from-green-400 to-green-600',
  robot: 'from-indigo-400 to-indigo-600',
  success: 'from-emerald-400 to-emerald-600',
  warning: 'from-yellow-400 to-yellow-600',
  security: 'from-blue-400 to-blue-600',
  network: 'from-purple-400 to-purple-600',
  family: 'from-pink-400 to-pink-600',
  power: 'from-orange-400 to-orange-600'
}

const solidClasses = {
  shield: 'bg-green-500',
  robot: 'bg-indigo-500',
  success: 'bg-emerald-500',
  warning: 'bg-yellow-500',
  security: 'bg-blue-500',
  network: 'bg-purple-500',
  family: 'bg-pink-500',
  power: 'bg-orange-500'
}

const outlineClasses = {
  shield: 'border-2 border-green-500 text-green-500',
  robot: 'border-2 border-indigo-500 text-indigo-500',
  success: 'border-2 border-emerald-500 text-emerald-500',
  warning: 'border-2 border-yellow-500 text-yellow-500',
  security: 'border-2 border-blue-500 text-blue-500',
  network: 'border-2 border-purple-500 text-purple-500',
  family: 'border-2 border-pink-500 text-pink-500',
  power: 'border-2 border-orange-500 text-orange-500'
}

export function EnhancedIcon({ 
  type, 
  size = 'md', 
  variant = 'gradient', 
  animated = false,
  className = '' 
}: EnhancedIconProps) {
  const IconComponent = iconMap[type]
  
  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg transition-all duration-300`
  
  let variantClasses = ''
  let iconClasses = `${iconSizes[size]} text-white`
  
  switch (variant) {
    case 'gradient':
      variantClasses = `bg-gradient-to-br ${gradientClasses[type]}`
      break
    case 'solid':
      variantClasses = solidClasses[type]
      break
    case 'outline':
      variantClasses = `bg-white ${outlineClasses[type]}`
      iconClasses = `${iconSizes[size]} ${outlineClasses[type].split(' ').pop()}`
      break
  }
  
  const animationClasses = animated ? 'hover:scale-110 hover:shadow-xl animate-pulse' : 'hover:scale-105'
  
  return (
    <div className={`${baseClasses} ${variantClasses} ${animationClasses} ${className}`}>
      <IconComponent className={iconClasses} />
    </div>
  )
}

// Brand color component for company logos
interface BrandLogoProps {
  src: string
  alt: string
  brand: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const brandColors: { [key: string]: string } = {
  'Netflix': '#E50914',
  'Spotify': '#1DB954',
  'Disney': '#113CCF',
  'Amazon': '#FF9900',
  'YouTube': '#FF0000',
  'PlayStation': '#003791',
  'Microsoft': '#00BCF2',
  'Apple': '#000000',
  'Google': '#4285F4',
  'Samsung': '#1428A0',
  'Ring': '#0066CC',
  'Norton': '#FFD100',
  'Bitdefender': '#ED1C24',
  'McAfee': '#C8102E',
  'Kaspersky': '#006F5C',
  'Avast': '#FF6600',
  'Netgear': '#009639',
  'Linksys': '#0099CC',
  'ASUS': '#000000',
  'TP-Link': '#4285F4',
  'Comcast': '#0089CF',
  'Verizon': '#CD040B',
  'AT&T': '#00A8E0',
  'Spectrum': '#0066CC'
}

const logoSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10'
}

export function BrandLogo({ src, alt, brand, size = 'md', className = '' }: BrandLogoProps) {
  const brandColor = brandColors[brand]
  
  return (
    <div className={`${logoSizes[size]} flex items-center justify-center rounded-lg p-1 transition-all duration-300 hover:scale-110 ${className}`}
         style={{ backgroundColor: brandColor ? `${brandColor}15` : 'transparent' }}>
      <img 
        src={src} 
        alt={alt}
        className={`${logoSizes[size]} object-contain`}
        style={{ 
          filter: brandColor ? `drop-shadow(0 0 4px ${brandColor}40)` : 'none'
        }}
      />
    </div>
  )
}