import React from 'react'

export const FloatingDataElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {/* Floating Data Streams */}
      <div className="absolute top-10 left-10 w-1 h-32 bg-gradient-to-b from-blue-400 to-transparent opacity-60 data-stream" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-20 right-20 w-1 h-24 bg-gradient-to-b from-green-400 to-transparent opacity-60 data-stream" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-32 left-32 w-1 h-28 bg-gradient-to-b from-purple-400 to-transparent opacity-60 data-stream" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-40 left-1/2 w-1 h-20 bg-gradient-to-b from-orange-400 to-transparent opacity-60 data-stream" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 right-40 w-1 h-36 bg-gradient-to-b from-cyan-400 to-transparent opacity-60 data-stream" style={{ animationDelay: '3s' }}></div>
      
      {/* Floating Particles */}
      <div className="absolute top-16 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-70 particle-effect" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-32 right-1/3 w-3 h-3 bg-green-400 rounded-full opacity-60 particle-effect" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-purple-400 rounded-full opacity-80 particle-effect" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-orange-400 rounded-full opacity-70 particle-effect" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-24 left-1/2 w-3 h-3 bg-pink-400 rounded-full opacity-60 particle-effect" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-24 left-3/4 w-2 h-2 bg-cyan-400 rounded-full opacity-75 particle-effect" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Energy Waves */}
      <div className="absolute top-1/3 left-1/4 w-16 h-16 border-2 border-blue-300 rounded-full opacity-30 energy-wave" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border-2 border-green-300 rounded-full opacity-25 energy-wave" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-12 h-12 border-2 border-purple-300 rounded-full opacity-35 energy-wave" style={{ animationDelay: '4s' }}></div>
      
      {/* Digital Rain Elements */}
      <div className="absolute top-0 left-1/6 w-px h-4 bg-blue-400 opacity-60 digital-rain" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-0 left-1/3 w-px h-6 bg-green-400 opacity-50 digital-rain" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-0 left-1/2 w-px h-3 bg-purple-400 opacity-70 digital-rain" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-0 left-2/3 w-px h-5 bg-orange-400 opacity-60 digital-rain" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-0 left-5/6 w-px h-4 bg-cyan-400 opacity-55 digital-rain" style={{ animationDelay: '4s' }}></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded-full opacity-40 glow-effect" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-32 right-32 w-6 h-6 bg-green-400 rounded-full opacity-30 glow-effect" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-16 w-3 h-3 bg-purple-400 rounded-full opacity-50 glow-effect" style={{ animationDelay: '4s' }}></div>
      <div className="absolute bottom-20 left-1/3 w-5 h-5 bg-orange-400 rounded-full opacity-35 glow-effect" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-40 right-20 w-4 h-4 bg-pink-400 rounded-full opacity-45 glow-effect" style={{ animationDelay: '3s' }}></div>
      
      {/* Color Shifting Elements */}
      <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 color-shift-effect" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full opacity-25 color-shift-effect" style={{ animationDelay: '5s' }}></div>
      <div className="absolute top-3/4 left-3/4 w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-15 color-shift-effect" style={{ animationDelay: '2.5s' }}></div>
      
      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Animated connecting lines */}
        <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="url(#lineGradient1)" strokeWidth="1" className="data-stream">
          <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="80%" y1="30%" x2="20%" y2="70%" stroke="url(#lineGradient2)" strokeWidth="1" className="data-stream">
          <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="6s" repeatCount="indefinite" />
        </line>
        <line x1="30%" y1="10%" x2="70%" y2="90%" stroke="url(#lineGradient3)" strokeWidth="1" className="data-stream">
          <animate attributeName="stroke-dasharray" values="0,100;50,50;100,0" dur="5s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  )
}

export default FloatingDataElements