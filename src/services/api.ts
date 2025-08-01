import { blink, type CyberScore, type FamilyMember, type Device, type SecurityAlert, type UserPreferences, type ActivityLog } from '../lib/blink'

// Rate limiting and retry utilities
class RateLimitManager {
  private static requestCounts = new Map<string, { count: number; resetTime: number }>()
  private static readonly RATE_LIMIT = 50 // requests per minute
  private static readonly WINDOW_MS = 60 * 1000 // 1 minute
  
  static async withRateLimit<T>(key: string, operation: () => Promise<T>): Promise<T> {
    const now = Date.now()
    const windowKey = `${key}-${Math.floor(now / this.WINDOW_MS)}`
    
    const current = this.requestCounts.get(windowKey) || { count: 0, resetTime: now + this.WINDOW_MS }
    
    if (current.count >= this.RATE_LIMIT) {
      const waitTime = current.resetTime - now
      if (waitTime > 0) {
        console.warn(`Rate limit reached for ${key}, waiting ${waitTime}ms`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        return this.withRateLimit(key, operation)
      }
    }
    
    current.count++
    this.requestCounts.set(windowKey, current)
    
    // Clean up old entries
    for (const [k, v] of this.requestCounts.entries()) {
      if (v.resetTime < now) {
        this.requestCounts.delete(k)
      }
    }
    
    return operation()
  }
  
  static async withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError: Error
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error: any) {
        lastError = error
        
        // Don't retry on validation errors
        if (error.code === 'VALIDATION_ERROR') {
          throw error
        }
        
        // Handle rate limiting
        if (error.code === 'NETWORK_ERROR' && error.status === 429) {
          const retryAfter = error.details?.reset ? new Date(error.details.reset).getTime() - Date.now() : (attempt + 1) * 2000
          console.warn(`Rate limited, retrying after ${retryAfter}ms (attempt ${attempt + 1}/${maxRetries + 1})`)
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.min(retryAfter, 10000)))
            continue
          }
        }
        
        // Exponential backoff for other errors
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000)
          console.warn(`Operation failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    throw lastError!
  }
}

// Database service class for HAVEN
export class HavenAPI {
  
  // Database Query Method (for dual scoring engine)
  static async query(sql: string, params: any[] = []): Promise<any[]> {
    try {
      // Use Blink's SQL runner for direct database queries
      const result = await blink.db.sql(sql, params)
      return result
    } catch (error) {
      console.error('Database query failed:', error)
      throw error
    }
  }
  
  // User Management
  static async getCurrentUser() {
    try {
      return await blink.auth.me()
    } catch (error) {
      console.error('Failed to get current user:', error)
      throw error
    }
  }

  static async updateUserProfile(data: { displayName?: string; avatar?: string }) {
    try {
      return await blink.auth.updateMe(data)
    } catch (error) {
      console.error('Failed to update user profile:', error)
      throw error
    }
  }

  // Cyber Score Management
  static async getCyberScore(userId: string): Promise<CyberScore | null> {
    return RateLimitManager.withRetry(async () => {
      return RateLimitManager.withRateLimit(`getCyberScore-${userId}`, async () => {
        // First try to get user-specific score
        const scores = await blink.db.cyberScores.list({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          limit: 1
        })
        
        if (scores.length > 0) {
          return scores[0]
        }
        
        // If no user-specific score, get a default one or create one
        const defaultScores = await blink.db.cyberScores.list({
          where: { userId: 'user_default' },
          limit: 1
        })
        
        if (defaultScores.length > 0) {
          // Create a copy for this user based on default
          return await this.updateCyberScore(userId, {
            score: defaultScores[0].score,
            grade: defaultScores[0].grade,
            trend: defaultScores[0].trend,
            passwordSecurity: defaultScores[0].passwordSecurity,
            deviceSecurity: defaultScores[0].deviceSecurity,
            networkSecurity: defaultScores[0].networkSecurity,
            appSecurity: defaultScores[0].appSecurity,
            familySafety: defaultScores[0].familySafety
          })
        }
        
        return null
      })
    }).catch(error => {
      console.error('Failed to get cyber score:', error)
      return null
    })
  }

  static async updateCyberScore(userId: string, scoreData: Partial<CyberScore>): Promise<CyberScore> {
    try {
      // Check if user already has a score (but don't create one in getCyberScore)
      const existingScores = await blink.db.cyberScores.list({
        where: { userId },
        limit: 1
      })
      
      if (existingScores.length > 0) {
        return await blink.db.cyberScores.update(existingScores[0].id, {
          ...scoreData,
          lastUpdate: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      } else {
        return await blink.db.cyberScores.create({
          id: `score_${Date.now()}`,
          userId,
          score: scoreData.score || 75,
          grade: scoreData.grade || 'B',
          trend: scoreData.trend || 'stable',
          lastUpdate: new Date().toISOString(),
          passwordSecurity: scoreData.passwordSecurity || 80,
          deviceSecurity: scoreData.deviceSecurity || 75,
          networkSecurity: scoreData.networkSecurity || 70,
          appSecurity: scoreData.appSecurity || 85,
          familySafety: scoreData.familySafety || 75,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Failed to update cyber score:', error)
      throw error
    }
  }

  // Family Members Management
  static async getFamilyMembers(userId: string): Promise<FamilyMember[]> {
    try {
      return await blink.db.familyMembers.list({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      console.error('Failed to get family members:', error)
      return []
    }
  }

  static async addFamilyMember(userId: string, memberData: Omit<FamilyMember, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<FamilyMember> {
    try {
      return await blink.db.familyMembers.create({
        id: `member_${Date.now()}`,
        userId,
        ...memberData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to add family member:', error)
      throw error
    }
  }

  static async updateFamilyMember(memberId: string, memberData: Partial<FamilyMember>): Promise<FamilyMember> {
    try {
      return await blink.db.familyMembers.update(memberId, {
        ...memberData,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to update family member:', error)
      throw error
    }
  }

  // Device Management
  static async getDevices(userId: string): Promise<Device[]> {
    try {
      return await blink.db.devices.list({
        where: { userId },
        orderBy: { lastSeen: 'desc' }
      })
    } catch (error) {
      console.error('Failed to get devices:', error)
      return []
    }
  }

  static async addDevice(userId: string, deviceData: Omit<Device, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Device> {
    try {
      return await blink.db.devices.create({
        id: `device_${Date.now()}`,
        userId,
        ...deviceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to add device:', error)
      throw error
    }
  }

  static async updateDevice(deviceId: string, deviceData: Partial<Device>): Promise<Device> {
    try {
      return await blink.db.devices.update(deviceId, {
        ...deviceData,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to update device:', error)
      throw error
    }
  }

  // Security Alerts Management
  static async getSecurityAlerts(userId: string, limit: number = 10): Promise<SecurityAlert[]> {
    return RateLimitManager.withRetry(async () => {
      return RateLimitManager.withRateLimit(`getSecurityAlerts-${userId}`, async () => {
        return await blink.db.securityAlerts.list({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          limit
        })
      })
    }).catch(error => {
      console.error('Failed to get security alerts:', error)
      return []
    })
  }

  static async createSecurityAlert(userId: string, alertData: Omit<SecurityAlert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SecurityAlert> {
    try {
      return await blink.db.securityAlerts.create({
        id: `alert_${Date.now()}`,
        userId,
        ...alertData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to create security alert:', error)
      throw error
    }
  }

  static async updateSecurityAlert(alertId: string, alertData: Partial<SecurityAlert>): Promise<SecurityAlert> {
    try {
      return await blink.db.securityAlerts.update(alertId, {
        ...alertData,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to update security alert:', error)
      throw error
    }
  }

  // User Preferences Management
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    return RateLimitManager.withRetry(async () => {
      return RateLimitManager.withRateLimit(`getUserPreferences-${userId}`, async () => {
        const preferences = await blink.db.userPreferences.list({
          where: { userId },
          limit: 1
        })
        
        if (preferences.length === 0) return null
        
        const pref = preferences[0]
        
        // Convert flattened schema back to nested structure
        return {
          id: pref.id,
          userId: pref.userId,
          notifications: {
            email: Number(pref.notificationsEmail) > 0,
            push: Number(pref.notificationsPush) > 0,
            sms: Number(pref.notificationsSms) > 0,
            frequency: pref.notificationsFrequency || 'daily'
          },
          privacy: {
            shareData: Number(pref.privacyShareData) > 0,
            analytics: Number(pref.privacyAnalytics) > 0,
            marketing: Number(pref.privacyMarketing) > 0
          },
          security: {
            autoScan: Number(pref.securityAutoScan) > 0,
            realTimeMonitoring: Number(pref.securityRealTimeMonitoring) > 0,
            familySharing: Number(pref.securityFamilySharing) > 0
          },
          tutorial: {
            completed: Number(pref.tutorialCompleted) > 0,
            currentStep: pref.tutorialCurrentStep || 0,
            skipped: Number(pref.tutorialSkipped) > 0
          },
          createdAt: pref.createdAt,
          updatedAt: pref.updatedAt
        } as UserPreferences
      })
    }).catch(error => {
      console.error('Failed to get user preferences:', error)
      return null
    })
  }

  static async updateUserPreferences(userId: string, preferencesData: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const existingPreferences = await this.getUserPreferences(userId)
      
      // Convert nested structure to flattened schema
      const flattenedData: any = {
        updatedAt: new Date().toISOString()
      }
      
      if (preferencesData.notifications) {
        flattenedData.notificationsEmail = preferencesData.notifications.email ? 1 : 0
        flattenedData.notificationsPush = preferencesData.notifications.push ? 1 : 0
        flattenedData.notificationsSms = preferencesData.notifications.sms ? 1 : 0
        flattenedData.notificationsFrequency = preferencesData.notifications.frequency || 'daily'
      }
      
      if (preferencesData.privacy) {
        flattenedData.privacyShareData = preferencesData.privacy.shareData ? 1 : 0
        flattenedData.privacyAnalytics = preferencesData.privacy.analytics ? 1 : 0
        flattenedData.privacyMarketing = preferencesData.privacy.marketing ? 1 : 0
      }
      
      if (preferencesData.security) {
        flattenedData.securityAutoScan = preferencesData.security.autoScan ? 1 : 0
        flattenedData.securityRealTimeMonitoring = preferencesData.security.realTimeMonitoring ? 1 : 0
        flattenedData.securityFamilySharing = preferencesData.security.familySharing ? 1 : 0
      }
      
      if (preferencesData.tutorial) {
        flattenedData.tutorialCompleted = preferencesData.tutorial.completed ? 1 : 0
        flattenedData.tutorialCurrentStep = preferencesData.tutorial.currentStep || 0
        flattenedData.tutorialSkipped = preferencesData.tutorial.skipped ? 1 : 0
      }
      
      if (existingPreferences) {
        await blink.db.userPreferences.update(existingPreferences.id, flattenedData)
        return await this.getUserPreferences(userId) as UserPreferences
      } else {
        const newPreferences = await blink.db.userPreferences.create({
          id: `pref_${Date.now()}`,
          userId,
          notificationsEmail: 1,
          notificationsPush: 1,
          notificationsSms: 0,
          notificationsFrequency: 'daily',
          privacyShareData: 0,
          privacyAnalytics: 1,
          privacyMarketing: 0,
          securityAutoScan: 1,
          securityRealTimeMonitoring: 1,
          securityFamilySharing: 1,
          tutorialCompleted: 0,
          tutorialCurrentStep: 0,
          tutorialSkipped: 0,
          ...flattenedData,
          createdAt: new Date().toISOString()
        })
        
        return await this.getUserPreferences(userId) as UserPreferences
      }
    } catch (error) {
      console.error('Failed to update user preferences:', error)
      throw error
    }
  }

  // Activity Log Management
  static async getActivityLog(userId: string, limit: number = 20): Promise<ActivityLog[]> {
    try {
      return await blink.db.activityLogs.list({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        limit
      })
    } catch (error) {
      console.error('Failed to get activity log:', error)
      return []
    }
  }

  static async logActivity(userId: string, activityData: Omit<ActivityLog, 'id' | 'userId' | 'createdAt'>): Promise<ActivityLog> {
    try {
      return await blink.db.activityLogs.create({
        id: `activity_${Date.now()}`,
        userId,
        ...activityData,
        createdAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to log activity:', error)
      throw error
    }
  }

  // Real-time Security Scan
  static async performSecurityScan(userId: string): Promise<{
    score: number
    alerts: SecurityAlert[]
    recommendations: string[]
  }> {
    try {
      // Simulate security scan with AI analysis
      const devices = await this.getDevices(userId)
      const familyMembers = await this.getFamilyMembers(userId)
      
      // Calculate new score based on current state
      const baseScore = 75
      const factors = {
        passwordSecurity: Math.floor(Math.random() * 20) + 70,
        deviceSecurity: Math.floor(Math.random() * 25) + 65,
        networkSecurity: Math.floor(Math.random() * 30) + 60,
        appSecurity: Math.floor(Math.random() * 20) + 75,
        familySafety: Math.floor(Math.random() * 25) + 70
      }
      
      const newScore = Math.floor(
        (factors.passwordSecurity + factors.deviceSecurity + factors.networkSecurity + factors.appSecurity + factors.familySafety) / 5
      )
      
      // Update cyber score
      await this.updateCyberScore(userId, {
        score: newScore,
        grade: newScore >= 90 ? 'A' : newScore >= 80 ? 'B' : newScore >= 70 ? 'C' : 'D',
        trend: newScore > baseScore ? 'up' : newScore < baseScore ? 'down' : 'stable',
        lastUpdate: new Date().toISOString(),
        passwordSecurity: factors.passwordSecurity,
        deviceSecurity: factors.deviceSecurity,
        networkSecurity: factors.networkSecurity,
        appSecurity: factors.appSecurity,
        familySafety: factors.familySafety
      })
      
      // Generate mock alerts based on scan
      const alerts: SecurityAlert[] = []
      if (factors.deviceSecurity < 70) {
        alerts.push(await this.createSecurityAlert(userId, {
          title: 'Device Security Update Required',
          description: 'Some of your devices need security updates',
          severity: 'medium',
          category: 'device',
          status: 'new',
          actionRequired: true,
          actionText: 'Update Devices'
        }))
      }
      
      if (factors.networkSecurity < 65) {
        alerts.push(await this.createSecurityAlert(userId, {
          title: 'Network Security Warning',
          description: 'Your Wi-Fi network may have security vulnerabilities',
          severity: 'high',
          category: 'network',
          status: 'new',
          actionRequired: true,
          actionText: 'Secure Network'
        }))
      }
      
      // Log the scan activity
      await this.logActivity(userId, {
        type: 'scan',
        title: 'Security Scan Completed',
        description: `Security scan completed with score: ${newScore}`,
        metadata: { score: newScore, alertsGenerated: alerts.length }
      })
      
      const recommendations = [
        'Enable two-factor authentication on all accounts',
        'Update device passwords regularly',
        'Keep all devices updated with latest security patches',
        'Review app permissions for family members',
        'Set up secure guest Wi-Fi network'
      ]
      
      return {
        score: newScore,
        alerts,
        recommendations: recommendations.slice(0, 3)
      }
    } catch (error) {
      console.error('Failed to perform security scan:', error)
      throw error
    }
  }

  // Tutorial Management
  static async updateTutorialProgress(userId: string, step: number, completed: boolean = false): Promise<void> {
    try {
      const preferences = await this.getUserPreferences(userId)
      await this.updateUserPreferences(userId, {
        tutorial: {
          ...preferences?.tutorial,
          currentStep: step,
          completed,
          skipped: false
        }
      })
    } catch (error) {
      console.error('Failed to update tutorial progress:', error)
    }
  }

  // Real-time notifications using Blink realtime with improved singleton pattern
  private static realtimeConnections = new Map<string, { 
    channel: any; 
    unsubscribe: () => void;
    callbacks: Set<(data: any) => void>;
    isConnecting: boolean;
  }>()
  
  static async subscribeToUpdates(userId: string, callback: (data: any) => void) {
    try {
      const channelKey = `haven-${userId}`
      
      // Check if already subscribed - add callback to existing subscription
      if (this.realtimeConnections.has(channelKey)) {
        const connection = this.realtimeConnections.get(channelKey)!
        connection.callbacks.add(callback)
        console.log('Added callback to existing subscription for user:', userId)
        
        // Return unsubscribe function that only removes this callback
        return () => {
          connection.callbacks.delete(callback)
          // If no more callbacks, cleanup the entire connection
          if (connection.callbacks.size === 0) {
            connection.unsubscribe()
          }
        }
      }
      
      // Check if connection is in progress
      const existingConnection = this.realtimeConnections.get(channelKey)
      if (existingConnection?.isConnecting) {
        console.log('Connection already in progress for user:', userId)
        // Wait a bit and try again
        await new Promise(resolve => setTimeout(resolve, 100))
        return this.subscribeToUpdates(userId, callback)
      }
      
      // Mark as connecting to prevent race conditions
      const callbackSet = new Set([callback])
      this.realtimeConnections.set(channelKey, {
        channel: null,
        unsubscribe: () => {},
        callbacks: callbackSet,
        isConnecting: true
      })
      
      const channel = blink.realtime.channel(channelKey)
      
      await channel.subscribe({
        userId,
        metadata: { type: 'haven-dashboard' }
      })
      
      const messageUnsubscribe = channel.onMessage((message) => {
        if (message.type === 'score-update' || message.type === 'alert' || message.type === 'device-update') {
          // Call all registered callbacks
          const connection = this.realtimeConnections.get(channelKey)
          if (connection) {
            connection.callbacks.forEach(cb => {
              try {
                cb(message.data)
              } catch (error) {
                console.error('Error in realtime callback:', error)
              }
            })
          }
        }
      })
      
      const fullUnsubscribe = async () => {
        try {
          messageUnsubscribe()
          await channel.unsubscribe()
          this.realtimeConnections.delete(channelKey)
          console.log('Fully unsubscribed from channel:', channelKey)
        } catch (error) {
          console.error('Error during unsubscribe:', error)
          // Still remove from connections map even if unsubscribe fails
          this.realtimeConnections.delete(channelKey)
        }
      }
      
      // Update the connection with actual channel and unsubscribe function
      this.realtimeConnections.set(channelKey, {
        channel,
        unsubscribe: fullUnsubscribe,
        callbacks: callbackSet,
        isConnecting: false
      })
      
      console.log('Successfully subscribed to updates for user:', userId)
      
      // Return unsubscribe function that only removes this callback
      return () => {
        const connection = this.realtimeConnections.get(channelKey)
        if (connection) {
          connection.callbacks.delete(callback)
          // If no more callbacks, cleanup the entire connection
          if (connection.callbacks.size === 0) {
            connection.unsubscribe()
          }
        }
      }
    } catch (error) {
      console.error('Failed to subscribe to updates:', error)
      // Clean up failed connection attempt
      const channelKey = `haven-${userId}`
      this.realtimeConnections.delete(channelKey)
      return () => {}
    }
  }
  
  // Clean up all realtime connections
  static async cleanupRealtimeConnections() {
    try {
      console.log('Cleaning up all realtime connections...')
      for (const [key, connection] of this.realtimeConnections.entries()) {
        try {
          await connection.unsubscribe()
        } catch (error) {
          console.error(`Error cleaning up connection ${key}:`, error)
        }
      }
      this.realtimeConnections.clear()
      console.log('All realtime connections cleaned up')
    } catch (error) {
      console.error('Error cleaning up realtime connections:', error)
    }
  }

  // Get connection status for debugging
  static getConnectionStatus() {
    const connections = Array.from(this.realtimeConnections.entries()).map(([key, connection]) => ({
      channelKey: key,
      callbackCount: connection.callbacks.size,
      isConnecting: connection.isConnecting,
      hasChannel: !!connection.channel
    }))
    
    console.log('Current realtime connections:', connections)
    return connections
  }

  // Broadcast real-time updates
  static async broadcastUpdate(userId: string, type: string, data: any) {
    try {
      await blink.realtime.publish(`haven-${userId}`, type, data)
    } catch (error) {
      console.error('Failed to broadcast update:', error)
    }
  }
}