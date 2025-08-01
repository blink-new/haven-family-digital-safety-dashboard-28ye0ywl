import { createClient } from '@blinkdotnew/sdk'

// Initialize Blink client with project configuration
export const blink = createClient({
  projectId: 'haven-family-digital-safety-dashboard-28ye0ywl',
  authRequired: true // Enable automatic authentication
})

// Export types for TypeScript support
export type BlinkUser = {
  id: string
  email: string
  displayName?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export type CyberScore = {
  id: string
  userId: string
  score: number
  grade: string
  trend: 'up' | 'down' | 'stable' | 'improving' | 'stable'
  lastUpdate: string
  passwordSecurity: number
  deviceSecurity: number
  networkSecurity: number
  appSecurity: number
  familySafety: number
  createdAt: string
  updatedAt: string
}

export type FamilyMember = {
  id: string
  userId: string
  name: string
  avatar?: string
  role: 'parent' | 'child' | 'teen' | 'elderly'
  riskLevel: 'low' | 'medium' | 'high'
  screenTime: number
  lastActivity: string
  devices: string[]
  createdAt: string
  updatedAt: string
}

export type Device = {
  id: string
  userId: string
  name: string
  type: 'phone' | 'tablet' | 'laptop' | 'smart_tv' | 'smart_home' | 'gaming' | 'other'
  brand: string
  model: string
  status: 'safe' | 'warning' | 'critical' | 'unknown'
  lastSeen: string
  securityScore: number
  owner?: string
  location?: string
  createdAt: string
  updatedAt: string
}

export type SecurityAlert = {
  id: string
  userId: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'device' | 'network' | 'app' | 'family' | 'general'
  status: 'new' | 'acknowledged' | 'resolved' | 'dismissed'
  actionRequired: boolean
  actionText?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export type UserPreferences = {
  id: string
  userId: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    frequency: 'immediate' | 'daily' | 'weekly'
  }
  privacy: {
    shareData: boolean
    analytics: boolean
    marketing: boolean
  }
  security: {
    autoScan: boolean
    realTimeMonitoring: boolean
    familySharing: boolean
  }
  tutorial: {
    completed: boolean
    currentStep: number
    skipped: boolean
  }
  createdAt: string
  updatedAt: string
}

export type ActivityLog = {
  id: string
  userId: string
  type: 'scan' | 'alert' | 'device_added' | 'score_change' | 'family_activity' | 'security_update'
  title: string
  description: string
  metadata?: Record<string, any>
  createdAt: string
}