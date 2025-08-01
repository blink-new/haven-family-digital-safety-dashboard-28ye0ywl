import { HavenAPI } from './api'
import { blink } from '../lib/blink'

export interface CyberResilienceScore {
  id: string
  userId: string
  score: number
  deviceSecurity: number
  networkHealth: number
  dataPrivacy: number
  threatLevel: number
  lastScanDate?: string
  createdAt: string
  updatedAt: string
}

export interface UserScore {
  id: string
  userId: string
  score: number
  recommendationsCompleted: number
  safeSettingsEnabled: number
  screenTimeCompliance: number
  engagementLevel: number
  weeklyResetDate?: string
  createdAt: string
  updatedAt: string
}

export interface UserScoreActivity {
  id: string
  userId: string
  activityType: 'recommendation_completed' | 'safe_setting_enabled' | 'screen_time_goal_met' | 'engagement_action'
  pointsEarned: number
  description: string
  createdAt: string
}

export interface DualScoreResult {
  cyberResilience: CyberResilienceScore
  userScore: UserScore
  summary: {
    cyberResilienceChange: number
    userScoreChange: number
    cyberResilienceMessage: string
    userScoreMessage: string
  }
}

/**
 * HAVEN Dual Scoring Engine
 * 
 * Manages two distinct scoring systems:
 * 1. Cyber Resilience Score - Technical household security state
 * 2. User Score - Individual behavioral engagement tracking
 */
export class DualScoringEngine {
  private static readonly CYBER_RESILIENCE_BASE = 75
  private static readonly CYBER_RESILIENCE_MAX = 100
  private static readonly USER_SCORE_BASE = 50
  private static readonly USER_SCORE_MAX = 100

  /**
   * Get or create Cyber Resilience Score for a user
   */
  static async getCyberResilienceScore(userId: string): Promise<CyberResilienceScore> {
    try {
      const result = await blink.db.sql(`
        SELECT * FROM cyber_resilience_scores 
        WHERE user_id = ? 
        ORDER BY updated_at DESC 
        LIMIT 1
      `, [userId])

      if (result.length > 0) {
        const score = result[0]
        return {
          id: score.id,
          userId: score.user_id,
          score: score.score,
          deviceSecurity: score.device_security,
          networkHealth: score.network_health,
          dataPrivacy: score.data_privacy,
          threatLevel: score.threat_level,
          lastScanDate: score.last_scan_date,
          createdAt: score.created_at,
          updatedAt: score.updated_at
        }
      }

      // Create initial score
      return await this.createInitialCyberResilienceScore(userId)
    } catch (error) {
      console.error('Error getting cyber resilience score:', error)
      throw error
    }
  }

  /**
   * Get or create User Score for a user
   */
  static async getUserScore(userId: string): Promise<UserScore> {
    try {
      const result = await blink.db.sql(`
        SELECT * FROM user_scores 
        WHERE user_id = ? 
        ORDER BY updated_at DESC 
        LIMIT 1
      `, [userId])

      if (result.length > 0) {
        const score = result[0]
        
        // Check if weekly reset is needed
        const weeklyResetDate = score.weekly_reset_date ? new Date(score.weekly_reset_date) : null
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        
        if (!weeklyResetDate || weeklyResetDate < oneWeekAgo) {
          return await this.resetWeeklyUserScore(userId, score)
        }

        return {
          id: score.id,
          userId: score.user_id,
          score: score.score,
          recommendationsCompleted: score.recommendations_completed,
          safeSettingsEnabled: score.safe_settings_enabled,
          screenTimeCompliance: score.screen_time_compliance,
          engagementLevel: score.engagement_level,
          weeklyResetDate: score.weekly_reset_date,
          createdAt: score.created_at,
          updatedAt: score.updated_at
        }
      }

      // Create initial score
      return await this.createInitialUserScore(userId)
    } catch (error) {
      console.error('Error getting user score:', error)
      throw error
    }
  }

  /**
   * Update Cyber Resilience Score based on technical factors
   */
  static async updateCyberResilienceScore(userId: string): Promise<CyberResilienceScore> {
    try {
      const currentScore = await this.getCyberResilienceScore(userId)
      
      // Simulate technical assessment
      const devices = await HavenAPI.getDevices(userId)
      const alerts = await HavenAPI.getSecurityAlerts(userId, 10)
      
      // Calculate component scores
      const deviceSecurity = this.calculateDeviceSecurityScore(devices)
      const networkHealth = this.calculateNetworkHealthScore(devices)
      const dataPrivacy = this.calculateDataPrivacyScore(userId)
      const threatLevel = this.calculateThreatLevelScore(alerts)
      
      // Calculate overall score (weighted average)
      const newScore = Math.round(
        (deviceSecurity * 0.3) + 
        (networkHealth * 0.25) + 
        (dataPrivacy * 0.25) + 
        (threatLevel * 0.2)
      )

      // Update in database
      await blink.db.sql(`
        UPDATE cyber_resilience_scores 
        SET score = ?, 
            device_security = ?, 
            network_health = ?, 
            data_privacy = ?, 
            threat_level = ?,
            last_scan_date = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [newScore, deviceSecurity, networkHealth, dataPrivacy, threatLevel, new Date().toISOString(), currentScore.id])

      return {
        ...currentScore,
        score: newScore,
        deviceSecurity,
        networkHealth,
        dataPrivacy,
        threatLevel,
        lastScanDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error updating cyber resilience score:', error)
      throw error
    }
  }

  /**
   * Add points to User Score for positive behavior
   */
  static async addUserScorePoints(
    userId: string, 
    activityType: UserScoreActivity['activityType'], 
    points: number, 
    description: string
  ): Promise<UserScore> {
    try {
      const currentScore = await this.getUserScore(userId)
      
      // Record the activity
      await blink.db.sql(`
        INSERT INTO user_score_activities (user_id, activity_type, points_earned, description)
        VALUES (?, ?, ?, ?)
      `, [userId, activityType, points, description])

      // Update counters based on activity type
      let updateFields = 'score = score + ?'
      const updateValues = [points]

      switch (activityType) {
        case 'recommendation_completed':
          updateFields += ', recommendations_completed = recommendations_completed + 1'
          break
        case 'safe_setting_enabled':
          updateFields += ', safe_settings_enabled = safe_settings_enabled + 1'
          break
        case 'screen_time_goal_met':
          updateFields += ', screen_time_compliance = screen_time_compliance + 1'
          break
        case 'engagement_action':
          updateFields += ', engagement_level = engagement_level + 1'
          break
      }

      updateValues.push(currentScore.id)

      // Update user score (cap at maximum)
      await blink.db.sql(`
        UPDATE user_scores 
        SET ${updateFields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, updateValues)

      // Ensure score doesn't exceed maximum
      await blink.db.sql(`
        UPDATE user_scores 
        SET score = CASE 
          WHEN score > ? THEN ? 
          ELSE score 
        END
        WHERE id = ?
      `, [this.USER_SCORE_MAX, this.USER_SCORE_MAX, currentScore.id])

      return await this.getUserScore(userId)
    } catch (error) {
      console.error('Error adding user score points:', error)
      throw error
    }
  }

  /**
   * Get both scores for dashboard display
   */
  static async getDualScores(userId: string): Promise<DualScoreResult> {
    try {
      const [cyberResilience, userScore] = await Promise.all([
        this.getCyberResilienceScore(userId),
        this.getUserScore(userId)
      ])

      // Calculate changes (simplified - in real app would compare with previous values)
      const cyberResilienceChange = 0 // Would calculate from history
      const userScoreChange = 0 // Would calculate from history

      return {
        cyberResilience,
        userScore,
        summary: {
          cyberResilienceChange,
          userScoreChange,
          cyberResilienceMessage: this.getCyberResilienceMessage(cyberResilience),
          userScoreMessage: this.getUserScoreMessage(userScore)
        }
      }
    } catch (error) {
      console.error('Error getting dual scores:', error)
      throw error
    }
  }

  /**
   * Create initial Cyber Resilience Score
   */
  private static async createInitialCyberResilienceScore(userId: string): Promise<CyberResilienceScore> {
    const id = `crs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    await blink.db.sql(`
      INSERT INTO cyber_resilience_scores 
      (id, user_id, score, device_security, network_health, data_privacy, threat_level, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, userId, this.CYBER_RESILIENCE_BASE, 75, 75, 75, 75, now, now])

    return {
      id,
      userId,
      score: this.CYBER_RESILIENCE_BASE,
      deviceSecurity: 75,
      networkHealth: 75,
      dataPrivacy: 75,
      threatLevel: 75,
      createdAt: now,
      updatedAt: now
    }
  }

  /**
   * Create initial User Score
   */
  private static async createInitialUserScore(userId: string): Promise<UserScore> {
    const id = `us_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    await blink.db.sql(`
      INSERT INTO user_scores 
      (id, user_id, score, recommendations_completed, safe_settings_enabled, screen_time_compliance, engagement_level, weekly_reset_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, userId, this.USER_SCORE_BASE, 0, 0, 0, 0, now, now, now])

    return {
      id,
      userId,
      score: this.USER_SCORE_BASE,
      recommendationsCompleted: 0,
      safeSettingsEnabled: 0,
      screenTimeCompliance: 0,
      engagementLevel: 0,
      weeklyResetDate: now,
      createdAt: now,
      updatedAt: now
    }
  }

  /**
   * Reset User Score weekly to encourage ongoing engagement
   */
  private static async resetWeeklyUserScore(userId: string, currentScore: any): Promise<UserScore> {
    const now = new Date().toISOString()
    
    // Reset to base score but keep some progress (70% reset, 30% carry-over)
    const newScore = Math.round(this.USER_SCORE_BASE + (currentScore.score - this.USER_SCORE_BASE) * 0.3)
    
    await blink.db.sql(`
      UPDATE user_scores 
      SET score = ?, 
          weekly_reset_date = ?, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newScore, now, currentScore.id])

    // Log the reset activity
    await blink.db.sql(`
      INSERT INTO user_score_activities (user_id, activity_type, points_earned, description)
      VALUES (?, ?, ?, ?)
    `, [userId, 'engagement_action', 0, 'Weekly score reset - keep up the great work!'])

    return {
      id: currentScore.id,
      userId: currentScore.user_id,
      score: newScore,
      recommendationsCompleted: currentScore.recommendations_completed,
      safeSettingsEnabled: currentScore.safe_settings_enabled,
      screenTimeCompliance: currentScore.screen_time_compliance,
      engagementLevel: currentScore.engagement_level,
      weeklyResetDate: now,
      createdAt: currentScore.created_at,
      updatedAt: now
    }
  }

  // Scoring calculation methods
  private static calculateDeviceSecurityScore(devices: any[]): number {
    if (devices.length === 0) return 75
    
    const secureDevices = devices.filter(d => d.status === 'secure').length
    const totalDevices = devices.length
    
    return Math.round((secureDevices / totalDevices) * 100)
  }

  private static calculateNetworkHealthScore(devices: any[]): number {
    // Simulate network health assessment
    const hasSecureRouter = Math.random() > 0.3
    const hasFirewall = Math.random() > 0.4
    const hasVPN = Math.random() > 0.6
    
    let score = 60
    if (hasSecureRouter) score += 20
    if (hasFirewall) score += 15
    if (hasVPN) score += 5
    
    return Math.min(100, score)
  }

  private static calculateDataPrivacyScore(userId: string): number {
    // Simulate data privacy assessment
    const hasEncryption = Math.random() > 0.4
    const hasBackups = Math.random() > 0.5
    const hasPrivacySettings = Math.random() > 0.3
    
    let score = 65
    if (hasEncryption) score += 20
    if (hasBackups) score += 10
    if (hasPrivacySettings) score += 5
    
    return Math.min(100, score)
  }

  private static calculateThreatLevelScore(alerts: any[]): number {
    const criticalAlerts = alerts.filter(a => a.severity === 'critical').length
    const highAlerts = alerts.filter(a => a.severity === 'high').length
    
    let score = 90
    score -= criticalAlerts * 15
    score -= highAlerts * 8
    
    return Math.max(20, score)
  }

  private static getCyberResilienceMessage(score: CyberResilienceScore): string {
    if (score.score >= 90) {
      return 'Excellent! Your household security is top-tier.'
    } else if (score.score >= 80) {
      return 'Great security posture with room for minor improvements.'
    } else if (score.score >= 70) {
      return 'Good foundation, but some security gaps need attention.'
    } else {
      return 'Several security issues require immediate attention.'
    }
  }

  private static getUserScoreMessage(score: UserScore): string {
    if (score.score >= 90) {
      return 'Outstanding engagement! You\'re a security champion.'
    } else if (score.score >= 75) {
      return 'Great job staying engaged with your digital safety!'
    } else if (score.score >= 60) {
      return 'Good progress! Keep completing recommendations.'
    } else {
      return 'Let\'s work together to improve your digital habits.'
    }
  }
}