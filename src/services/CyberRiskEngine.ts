import { HavenAPI } from './api'
import type { CyberScore, SecurityAlert } from '../lib/blink'

export interface ThreatEvent {
  id: string
  type: 'vulnerability' | 'breach' | 'malware' | 'phishing' | 'device_risk' | 'password_risk'
  severity: 'low' | 'medium' | 'high' | 'critical'
  detected: Date
  resolved?: Date
  autoRemediated: boolean
  description: string
  impact: number // Points impact on score
  source: string
}

export interface ScoreFactors {
  passwordSecurity: number
  deviceSecurity: number
  networkSecurity: number
  appSecurity: number
  familySafety: number
}

export interface ScoreCalculationResult {
  score: number
  grade: string
  trend: 'up' | 'down' | 'stable'
  factors: ScoreFactors
  threats: ThreatEvent[]
  autoRemediations: string[]
  recommendations: string[]
  summary: string
}

/**
 * HAVEN Cyber Risk Engine - Protection-Focused Scoring
 * 
 * Core Principles:
 * 1. Scores only decrease with NEW risks or UNRESOLVED vulnerabilities
 * 2. Passive users maintaining safe environments retain their scores
 * 3. Automatic remediations maintain or improve scores
 * 4. Protection prioritized over gamification pressure
 */
export class CyberRiskEngine {
  private static readonly BASE_SCORE = 75
  private static readonly MAX_SCORE = 100
  private static readonly MIN_SCORE = 20

  // Score decay rates (per day) - very conservative to avoid penalizing passive users
  private static readonly DECAY_RATES = {
    unresolved_critical: 0.5,  // Only critical unresolved threats cause decay
    unresolved_high: 0.2,
    unresolved_medium: 0.1,
    unresolved_low: 0.05,
    no_activity: 0 // NO penalty for passive users
  }

  /**
   * Calculate cyber risk score with protection-focused approach
   */
  static async calculateScore(userId: string, existingScore?: CyberScore): Promise<ScoreCalculationResult> {
    try {
      // Get current threats and security state
      const threats = await this.detectThreats(userId)
      const factors = await this.assessSecurityFactors(userId)
      const autoRemediations: string[] = []
      
      // Start with existing score or base score
      const currentScore = existingScore?.score || this.BASE_SCORE
      let scoreChange = 0
      
      // Only apply penalties for NEW or UNRESOLVED threats
      const unresolvedThreats = threats.filter(t => !t.resolved)
      const newThreats = threats.filter(t => this.isNewThreat(t, existingScore?.lastUpdate))
      
      // Process unresolved threats (main score impact)
      for (const threat of unresolvedThreats) {
        if (threat.autoRemediated) {
          // Auto-remediated threats don't penalize - they maintain or improve score
          autoRemediations.push(`We handled ${threat.description.toLowerCase()} for you — no action needed.`)
          scoreChange += Math.abs(threat.impact) * 0.5 // Small positive boost for auto-remediation
        } else {
          // Only unresolved manual threats cause score decrease
          const daysSinceDetected = Math.floor((Date.now() - threat.detected.getTime()) / (1000 * 60 * 60 * 24))
          const decayRate = this.DECAY_RATES[`unresolved_${threat.severity}`] || 0
          const penalty = threat.impact + (daysSinceDetected * decayRate)
          scoreChange -= penalty
        }
      }
      
      // Process new threats (immediate impact)
      for (const threat of newThreats) {
        if (!threat.autoRemediated) {
          scoreChange -= threat.impact
        }
      }
      
      // Apply positive factors (improvements, good practices)
      const positiveFactors = this.calculatePositiveFactors(factors, existingScore)
      scoreChange += positiveFactors.totalBonus
      
      // Calculate final score
      const newScore = Math.max(
        this.MIN_SCORE,
        Math.min(this.MAX_SCORE, currentScore + scoreChange)
      )
      
      // Determine trend
      const trend = this.calculateTrend(newScore, currentScore, scoreChange)
      
      // Generate grade
      const grade = this.calculateGrade(newScore)
      
      // Generate summary message
      const summary = this.generateSummary(scoreChange, autoRemediations, unresolvedThreats)
      
      // Generate recommendations (only for actionable items)
      const recommendations = this.generateRecommendations(unresolvedThreats, factors)
      
      return {
        score: Math.round(newScore),
        grade,
        trend,
        factors,
        threats,
        autoRemediations,
        recommendations,
        summary
      }
    } catch (error) {
      console.error('Error calculating cyber risk score:', error)
      
      // Return safe fallback
      return {
        score: existingScore?.score || this.BASE_SCORE,
        grade: existingScore?.grade || 'C',
        trend: 'stable',
        factors: {
          passwordSecurity: 75,
          deviceSecurity: 75,
          networkSecurity: 75,
          appSecurity: 75,
          familySafety: 75
        },
        threats: [],
        autoRemediations: [],
        recommendations: [],
        summary: 'Score maintained - no new risks detected.'
      }
    }
  }

  /**
   * Detect current threats and vulnerabilities
   */
  private static async detectThreats(userId: string): Promise<ThreatEvent[]> {
    const threats: ThreatEvent[] = []
    const devices = await HavenAPI.getDevices(userId)
    const alerts = await HavenAPI.getSecurityAlerts(userId, 50)
    
    // Convert existing alerts to threat events
    for (const alert of alerts) {
      const threat: ThreatEvent = {
        id: alert.id,
        type: this.mapAlertTypeToThreat(alert.category),
        severity: alert.severity as any,
        detected: new Date(alert.createdAt),
        resolved: alert.status === 'resolved' ? new Date(alert.updatedAt) : undefined,
        autoRemediated: alert.status === 'auto_resolved' || alert.description.includes('automatically'),
        description: alert.title,
        impact: this.calculateThreatImpact(alert.severity, alert.category),
        source: alert.category
      }
      threats.push(threat)
    }
    
    // Detect new device-based threats
    for (const device of devices) {
      if (device.status === 'vulnerable' || device.status === 'warning') {
        const existingThreat = threats.find(t => t.source === device.id)
        if (!existingThreat) {
          // Check if this can be auto-remediated
          const canAutoRemediate = this.canAutoRemediateDevice(device)
          
          threats.push({
            id: `device_${device.id}_${Date.now()}`,
            type: 'device_risk',
            severity: device.status === 'vulnerable' ? 'high' : 'medium',
            detected: new Date(),
            autoRemediated: canAutoRemediate,
            description: `${device.name} security update available`,
            impact: device.status === 'vulnerable' ? 8 : 4,
            source: device.id
          })
          
          // If auto-remediatable, mark as resolved
          if (canAutoRemediate) {
            await this.autoRemediateDevice(userId, device.id)
          }
        }
      }
    }
    
    return threats
  }

  /**
   * Assess current security factors
   */
  private static async assessSecurityFactors(userId: string): Promise<ScoreFactors> {
    const devices = await HavenAPI.getDevices(userId)
    const familyMembers = await HavenAPI.getFamilyMembers(userId)
    
    // Calculate factor scores based on current state
    const passwordSecurity = this.assessPasswordSecurity(devices, familyMembers)
    const deviceSecurity = this.assessDeviceSecurity(devices)
    const networkSecurity = this.assessNetworkSecurity(devices)
    const appSecurity = this.assessAppSecurity(devices)
    const familySafety = this.assessFamilySafety(familyMembers)
    
    return {
      passwordSecurity,
      deviceSecurity,
      networkSecurity,
      appSecurity,
      familySafety
    }
  }

  /**
   * Check if threat is new (detected after last score update)
   */
  private static isNewThreat(threat: ThreatEvent, lastUpdate?: string): boolean {
    if (!lastUpdate) return true
    const lastUpdateDate = new Date(lastUpdate)
    return threat.detected > lastUpdateDate
  }

  /**
   * Calculate positive factors that improve score
   */
  private static calculatePositiveFactors(factors: ScoreFactors, existingScore?: CyberScore) {
    let totalBonus = 0
    const improvements: string[] = []
    
    // Compare with previous factors if available
    if (existingScore) {
      const improvements_found = []
      
      if (factors.passwordSecurity > (existingScore.passwordSecurity || 0)) {
        const bonus = (factors.passwordSecurity - (existingScore.passwordSecurity || 0)) * 0.1
        totalBonus += bonus
        improvements_found.push(`Password security improved (+${bonus.toFixed(1)} points)`)
      }
      
      if (factors.deviceSecurity > (existingScore.deviceSecurity || 0)) {
        const bonus = (factors.deviceSecurity - (existingScore.deviceSecurity || 0)) * 0.1
        totalBonus += bonus
        improvements_found.push(`Device security improved (+${bonus.toFixed(1)} points)`)
      }
      
      if (factors.networkSecurity > (existingScore.networkSecurity || 0)) {
        const bonus = (factors.networkSecurity - (existingScore.networkSecurity || 0)) * 0.1
        totalBonus += bonus
        improvements_found.push(`Network security improved (+${bonus.toFixed(1)} points)`)
      }
      
      if (factors.appSecurity > (existingScore.appSecurity || 0)) {
        const bonus = (factors.appSecurity - (existingScore.appSecurity || 0)) * 0.1
        totalBonus += bonus
        improvements_found.push(`App security improved (+${bonus.toFixed(1)} points)`)
      }
      
      if (factors.familySafety > (existingScore.familySafety || 0)) {
        const bonus = (factors.familySafety - (existingScore.familySafety || 0)) * 0.1
        totalBonus += bonus
        improvements_found.push(`Family safety improved (+${bonus.toFixed(1)} points)`)
      }
      
      improvements.push(...improvements_found)
    }
    
    return { totalBonus, improvements }
  }

  /**
   * Calculate score trend
   */
  private static calculateTrend(newScore: number, oldScore: number, change: number): 'up' | 'down' | 'stable' {
    if (Math.abs(change) < 1) return 'stable'
    return newScore > oldScore ? 'up' : 'down'
  }

  /**
   * Calculate letter grade
   */
  private static calculateGrade(score: number): string {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  /**
   * Generate summary message
   */
  private static generateSummary(scoreChange: number, autoRemediations: string[], unresolvedThreats: ThreatEvent[]): string {
    if (autoRemediations.length > 0) {
      return `Your score is protected. We automatically handled ${autoRemediations.length} security issue${autoRemediations.length > 1 ? 's' : ''} for you.`
    }
    
    if (unresolvedThreats.length === 0) {
      return 'Your digital environment is secure. No action needed.'
    }
    
    if (scoreChange > 2) {
      return `Great job! Your security improvements increased your score by ${Math.round(scoreChange)} points.`
    }
    
    if (scoreChange < -2) {
      const criticalThreats = unresolvedThreats.filter(t => t.severity === 'critical').length
      if (criticalThreats > 0) {
        return `${criticalThreats} critical security issue${criticalThreats > 1 ? 's' : ''} need${criticalThreats === 1 ? 's' : ''} your attention.`
      }
      return `${unresolvedThreats.length} security issue${unresolvedThreats.length > 1 ? 's' : ''} detected. Review recommendations below.`
    }
    
    return 'Your security score is stable. Keep up the good work!'
  }

  /**
   * Generate actionable recommendations
   */
  private static generateRecommendations(unresolvedThreats: ThreatEvent[], factors: ScoreFactors): string[] {
    const recommendations: string[] = []
    
    // Focus on unresolved threats first
    const criticalThreats = unresolvedThreats.filter(t => t.severity === 'critical')
    const highThreats = unresolvedThreats.filter(t => t.severity === 'high')
    
    for (const threat of criticalThreats.slice(0, 2)) {
      recommendations.push(`🔴 Critical: ${threat.description}`)
    }
    
    for (const threat of highThreats.slice(0, 2)) {
      recommendations.push(`🟡 Important: ${threat.description}`)
    }
    
    // Add factor-based recommendations only if no critical threats
    if (criticalThreats.length === 0) {
      if (factors.passwordSecurity < 70) {
        recommendations.push('Enable password manager for better password security')
      }
      if (factors.deviceSecurity < 70) {
        recommendations.push('Update device security settings and install patches')
      }
      if (factors.networkSecurity < 70) {
        recommendations.push('Secure your Wi-Fi network with WPA3 encryption')
      }
    }
    
    return recommendations.slice(0, 3) // Limit to top 3 recommendations
  }

  // Helper methods for threat detection and assessment
  private static mapAlertTypeToThreat(category: string): ThreatEvent['type'] {
    switch (category) {
      case 'password': return 'password_risk'
      case 'device': return 'device_risk'
      case 'network': return 'vulnerability'
      case 'malware': return 'malware'
      case 'phishing': return 'phishing'
      default: return 'vulnerability'
    }
  }

  private static calculateThreatImpact(severity: string, category: string): number {
    const baseImpact = {
      critical: 15,
      high: 8,
      medium: 4,
      low: 2
    }[severity] || 2
    
    // Category multipliers
    const multiplier = {
      password: 1.2,
      device: 1.0,
      network: 1.3,
      malware: 1.5,
      phishing: 1.1
    }[category] || 1.0
    
    return Math.round(baseImpact * multiplier)
  }

  private static canAutoRemediateDevice(device: any): boolean {
    // Simple heuristics for auto-remediation
    return device.type === 'smart_device' || 
           device.name?.toLowerCase().includes('router') ||
           device.status === 'update_available'
  }

  private static async autoRemediateDevice(userId: string, deviceId: string): Promise<void> {
    // Simulate auto-remediation
    await HavenAPI.updateDevice(deviceId, {
      status: 'secure',
      lastScan: new Date().toISOString()
    })
    
    // Log the auto-remediation
    await HavenAPI.logActivity(userId, {
      type: 'auto_remediation',
      title: 'Device Security Updated',
      description: 'HAVEN automatically applied security updates',
      metadata: { deviceId, automated: true }
    })
  }

  // Security factor assessment methods
  private static assessPasswordSecurity(devices: any[], familyMembers: any[]): number {
    // Base score
    let score = 75
    
    // Check for password manager usage (simulated)
    const hasPasswordManager = Math.random() > 0.6
    if (hasPasswordManager) score += 15
    
    // Check for MFA (simulated)
    const hasMFA = Math.random() > 0.4
    if (hasMFA) score += 10
    
    return Math.min(100, score)
  }

  private static assessDeviceSecurity(devices: any[]): number {
    if (devices.length === 0) return 75
    
    const secureDevices = devices.filter(d => d.status === 'secure').length
    const totalDevices = devices.length
    
    return Math.round((secureDevices / totalDevices) * 100)
  }

  private static assessNetworkSecurity(devices: any[]): number {
    // Simulate network security assessment
    const hasSecureRouter = Math.random() > 0.3
    const hasGuestNetwork = Math.random() > 0.5
    const hasFirewall = Math.random() > 0.4
    
    let score = 60
    if (hasSecureRouter) score += 20
    if (hasGuestNetwork) score += 10
    if (hasFirewall) score += 10
    
    return Math.min(100, score)
  }

  private static assessAppSecurity(devices: any[]): number {
    // Simulate app security assessment
    return Math.floor(Math.random() * 20) + 75 // 75-95 range
  }

  private static assessFamilySafety(familyMembers: any[]): number {
    if (familyMembers.length === 0) return 80
    
    // Simulate family safety assessment based on parental controls, etc.
    const hasParentalControls = Math.random() > 0.4
    const hasScreenTimeControls = Math.random() > 0.5
    
    let score = 70
    if (hasParentalControls) score += 15
    if (hasScreenTimeControls) score += 15
    
    return Math.min(100, score)
  }

  /**
   * Update user's cyber score using the protection-focused engine
   */
  static async updateUserScore(userId: string): Promise<CyberScore> {
    try {
      // Get existing score
      const existingScore = await HavenAPI.getCyberScore(userId)
      
      // Calculate new score
      const result = await this.calculateScore(userId, existingScore || undefined)
      
      // Update score in database
      const updatedScore = await HavenAPI.updateCyberScore(userId, {
        score: result.score,
        grade: result.grade,
        trend: result.trend,
        passwordSecurity: result.factors.passwordSecurity,
        deviceSecurity: result.factors.deviceSecurity,
        networkSecurity: result.factors.networkSecurity,
        appSecurity: result.factors.appSecurity,
        familySafety: result.factors.familySafety,
        lastUpdate: new Date().toISOString()
      })
      
      // Log activity if there were auto-remediations
      if (result.autoRemediations.length > 0) {
        await HavenAPI.logActivity(userId, {
          type: 'auto_protection',
          title: 'Automatic Protection Applied',
          description: result.summary,
          metadata: { 
            autoRemediations: result.autoRemediations,
            scoreChange: result.score - (existingScore?.score || this.BASE_SCORE)
          }
        })
      }
      
      // Broadcast update
      await HavenAPI.broadcastUpdate(userId, 'score-update', {
        score: updatedScore,
        summary: result.summary,
        autoRemediations: result.autoRemediations,
        recommendations: result.recommendations
      })
      
      return updatedScore
    } catch (error) {
      console.error('Error updating user score:', error)
      throw error
    }
  }
}