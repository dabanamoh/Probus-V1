/**
 * Production-Ready AI Monitoring Service
 * 
 * This service provides a comprehensive monitoring system that:
 * 1. Collects all user activities across the application
 * 2. Structures data in AI-friendly formats
 * 3. Provides real-time event streaming
 * 4. Supports multiple AI integration endpoints
 * 5. Includes privacy controls and data retention
 */

import apiClient from '@/lib/api-client';

// ==================== CORE TYPES ====================

export interface AIMonitoringEvent {
  // Unique identifier
  id: string;
  
  // Event metadata
  eventType: EventType;
  category: EventCategory;
  severity: SeverityLevel;
  timestamp: string;
  
  // User context
  userId: string;
  userRole: 'admin' | 'employee' | 'manager' | 'hr';
  userName?: string;
  departmentId?: string;
  
  // Event data
  action: string;
  description: string;
  metadata: Record<string, any>;
  
  // Content for AI analysis
  content?: {
    raw?: string;  // Original content
    sanitized?: string;  // Privacy-filtered content
    sentiment?: 'positive' | 'negative' | 'neutral';
    language?: string;
  };
  
  // Context
  context: {
    page?: string;
    module?: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    location?: GeolocationData;
  };
  
  // AI Analysis results (populated by AI)
  aiAnalysis?: {
    riskScore?: number;  // 0-100
    threatLevel?: 'none' | 'low' | 'medium' | 'high' | 'critical';
    categories?: string[];  // harassment, security, policy_violation, etc.
    confidence?: number;  // 0-1
    recommendations?: string[];
    flags?: string[];
  };
  
  // Privacy and compliance
  privacy: {
    isPersonalData: boolean;
    consentGiven: boolean;
    retentionDays: number;
    canBeShared: boolean;
  };
}

export type EventType =
  // User activity
  | 'login' | 'logout' | 'page_view' | 'navigation' | 'session_start' | 'session_end'
  // Communication
  | 'chat_message' | 'email_sent' | 'email_received' | 'file_shared' | 'call_made'
  // Work activity
  | 'task_created' | 'task_updated' | 'task_completed' | 'task_deleted'
  | 'approval_requested' | 'approval_given' | 'approval_denied'
  // Time tracking
  | 'clock_in' | 'clock_out' | 'break_start' | 'break_end' | 'overtime_logged'
  // HR events
  | 'leave_requested' | 'leave_approved' | 'leave_denied'
  | 'resignation_submitted' | 'resignation_processed'
  | 'employee_onboarded' | 'employee_offboarded'
  // Compliance
  | 'policy_acknowledged' | 'policy_violated' | 'whistleblower_report'
  | 'security_alert' | 'data_access' | 'data_export'
  // Performance
  | 'kpi_updated' | 'feedback_submitted' | 'review_completed'
  // System
  | 'settings_changed' | 'integration_connected' | 'integration_disconnected'
  | 'error_occurred' | 'warning_triggered';

export type EventCategory =
  | 'user_activity'
  | 'communication'
  | 'productivity'
  | 'compliance'
  | 'security'
  | 'hr'
  | 'performance'
  | 'system';

export type SeverityLevel = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

// ==================== AI MONITORING CONFIG ====================

export interface AIMonitoringConfig {
  enabled: boolean;
  realTimeStreaming: boolean;
  batchInterval: number;  // milliseconds
  retentionDays: number;
  privacyMode: 'strict' | 'balanced' | 'minimal';
  categories: {
    harassment: boolean;
    security: boolean;
    productivity: boolean;
    policy_compliance: boolean;
  };
  aiEndpoints: {
    analysis: string;
    realtime: string;
    batch: string;
  };
}

// ==================== AI MONITORING SERVICE ====================

class AIMonitoringServiceV2 {
  private config: AIMonitoringConfig;
  private eventQueue: AIMonitoringEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor() {
    this.config = this.loadConfig();
    this.startBatchProcessor();
  }

  // ==================== CONFIGURATION ====================

  private loadConfig(): AIMonitoringConfig {
    const defaultConfig: AIMonitoringConfig = {
      enabled: true,
      realTimeStreaming: false,
      batchInterval: 60000,  // 1 minute
      retentionDays: 90,
      privacyMode: 'balanced',
      categories: {
        harassment: true,
        security: true,
        productivity: true,
        policy_compliance: true,
      },
      aiEndpoints: {
        analysis: '/ai/analyze',
        realtime: '/ai/stream',
        batch: '/ai/batch',
      },
    };

    // Load from localStorage or use defaults
    const savedConfig = localStorage.getItem('aiMonitoringConfig');
    return savedConfig ? { ...defaultConfig, ...JSON.parse(savedConfig) } : defaultConfig;
  }

  public updateConfig(updates: Partial<AIMonitoringConfig>): void {
    this.config = { ...this.config, ...updates };
    localStorage.setItem('aiMonitoringConfig', JSON.stringify(this.config));
  }

  public getConfig(): AIMonitoringConfig {
    return { ...this.config };
  }

  // ==================== EVENT LOGGING ====================

  /**
   * Log an event for AI monitoring
   * This is the main entry point for all event logging
   */
  public async logEvent(event: Partial<AIMonitoringEvent>): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    // Build complete event
    const completeEvent = this.buildEvent(event);

    // Apply privacy filters
    const sanitizedEvent = this.applySanitization(completeEvent);

    // Add to queue
    this.eventQueue.push(sanitizedEvent);

    // Real-time streaming if enabled
    if (this.config.realTimeStreaming) {
      await this.streamEvent(sanitizedEvent);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('[AI Monitoring]', sanitizedEvent);
    }
  }

  private buildEvent(partial: Partial<AIMonitoringEvent>): AIMonitoringEvent {
    const sessionId = this.getSessionId();
    const userId = this.getUserId();
    const userRole = this.getUserRole();

    return {
      id: crypto.randomUUID(),
      eventType: partial.eventType || 'page_view',
      category: partial.category || this.inferCategory(partial.eventType),
      severity: partial.severity || 'info',
      timestamp: new Date().toISOString(),
      userId: partial.userId || userId,
      userRole: partial.userRole || userRole,
      userName: partial.userName,
      departmentId: partial.departmentId,
      action: partial.action || '',
      description: partial.description || '',
      metadata: partial.metadata || {},
      content: partial.content,
      context: {
        page: window.location.pathname,
        module: this.inferModule(window.location.pathname),
        ipAddress: '',  // Set by backend
        userAgent: navigator.userAgent,
        sessionId,
        ...partial.context,
      },
      privacy: {
        isPersonalData: partial.content?.raw ? true : false,
        consentGiven: true,  // Assume consent from settings
        retentionDays: this.config.retentionDays,
        canBeShared: false,
        ...partial.privacy,
      },
      aiAnalysis: partial.aiAnalysis,
    };
  }

  private inferCategory(eventType?: EventType): EventCategory {
    if (!eventType) return 'user_activity';

    const categoryMap: Record<string, EventCategory> = {
      login: 'user_activity',
      logout: 'user_activity',
      chat_message: 'communication',
      email_sent: 'communication',
      task_created: 'productivity',
      task_completed: 'productivity',
      clock_in: 'productivity',
      clock_out: 'productivity',
      policy_acknowledged: 'compliance',
      security_alert: 'security',
      whistleblower_report: 'compliance',
      leave_requested: 'hr',
      resignation_submitted: 'hr',
      kpi_updated: 'performance',
    };

    return categoryMap[eventType] || 'user_activity';
  }

  private inferModule(pathname: string): string {
    const moduleMap: Record<string, string> = {
      '/work': 'MyWork',
      '/employees': 'EmployeeManagement',
      '/departments': 'Departments',
      '/notices': 'Communications',
      '/events': 'Events',
      '/kpis': 'Performance',
      '/safety': 'SafetyMonitoring',
      '/app': 'EmployeeDashboard',
      '/manager': 'ManagerDashboard',
      '/hr': 'HRDashboard',
    };

    for (const [path, module] of Object.entries(moduleMap)) {
      if (pathname.startsWith(path)) return module;
    }

    return 'Unknown';
  }

  // ==================== PRIVACY & SANITIZATION ====================

  private applySanitization(event: AIMonitoringEvent): AIMonitoringEvent {
    if (this.config.privacyMode === 'strict') {
      return this.strictSanitization(event);
    } else if (this.config.privacyMode === 'minimal') {
      return event;  // No sanitization
    }

    // Balanced mode
    return this.balancedSanitization(event);
  }

  private strictSanitization(event: AIMonitoringEvent): AIMonitoringEvent {
    return {
      ...event,
      userName: undefined,
      content: event.content ? {
        raw: undefined,
        sanitized: this.redactPersonalInfo(event.content.raw || ''),
        sentiment: event.content.sentiment,
        language: event.content.language,
      } : undefined,
      metadata: this.redactMetadata(event.metadata),
    };
  }

  private balancedSanitization(event: AIMonitoringEvent): AIMonitoringEvent {
    return {
      ...event,
      content: event.content ? {
        ...event.content,
        raw: undefined,  // Never send raw content in balanced mode
        sanitized: this.redactPersonalInfo(event.content.raw || ''),
      } : undefined,
    };
  }

  private redactPersonalInfo(text: string): string {
    // Redact emails
    text = text.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]');
    
    // Redact phone numbers
    text = text.replace(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, '[PHONE]');
    
    // Redact credit cards
    text = text.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD]');
    
    // Redact SSN
    text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
    
    return text;
  }

  private redactMetadata(metadata: Record<string, any>): Record<string, any> {
    const redacted: Record<string, any> = {};
    const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'ssn', 'creditCard'];

    for (const [key, value] of Object.entries(metadata)) {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = value;
      }
    }

    return redacted;
  }

  // ==================== BATCH PROCESSING ====================

  private startBatchProcessor(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }

    this.batchTimer = setInterval(() => {
      this.processBatch();
    }, this.config.batchInterval);
  }

  private async processBatch(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const batch = [...this.eventQueue];
      this.eventQueue = [];

      const response = await apiClient.post(this.config.aiEndpoints.batch, {
        events: batch,
        config: {
          categories: this.config.categories,
          privacyMode: this.config.privacyMode,
        },
      });

      if (response.success) {
        console.log(`[AI Monitoring] Processed batch of ${batch.length} events`);
      } else {
        console.error('[AI Monitoring] Batch processing failed:', response.error);
        // Re-queue failed events
        this.eventQueue.unshift(...batch);
      }
    } catch (error) {
      console.error('[AI Monitoring] Batch processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // ==================== REAL-TIME STREAMING ====================

  private async streamEvent(event: AIMonitoringEvent): Promise<void> {
    try {
      await apiClient.post(this.config.aiEndpoints.realtime, { event });
    } catch (error) {
      console.error('[AI Monitoring] Real-time streaming error:', error);
    }
  }

  // ==================== AI ANALYSIS REQUESTS ====================

  /**
   * Request AI analysis for specific content
   * Use this for on-demand analysis (e.g., before sending a message)
   */
  public async analyzeContent(content: string, context?: Partial<AIMonitoringEvent>): Promise<any> {
    try {
      const response = await apiClient.post(this.config.aiEndpoints.analysis, {
        content,
        context,
        categories: this.config.categories,
      });

      return response.data;
    } catch (error) {
      console.error('[AI Monitoring] Analysis error:', error);
      return null;
    }
  }

  // ==================== HELPERS ====================

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('aiMonitoringSessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('aiMonitoringSessionId', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || 'anonymous';
  }

  private getUserRole(): 'admin' | 'employee' | 'manager' | 'hr' {
    return (localStorage.getItem('userRole') as any) || 'employee';
  }

  // ==================== PUBLIC UTILITIES ====================

  /**
   * Get current queue size
   */
  public getQueueSize(): number {
    return this.eventQueue.length;
  }

  /**
   * Force process current batch
   */
  public async flushQueue(): Promise<void> {
    await this.processBatch();
  }

  /**
   * Clear all queued events
   */
  public clearQueue(): void {
    this.eventQueue = [];
  }

  /**
   * Destroy service
   */
  public destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }
    this.eventQueue = [];
  }
}

// Export singleton instance
export const aiMonitoring = new AIMonitoringServiceV2();

// Export convenience methods
export const logAIEvent = (event: Partial<AIMonitoringEvent>) => aiMonitoring.logEvent(event);
export const analyzeWithAI = (content: string, context?: Partial<AIMonitoringEvent>) => 
  aiMonitoring.analyzeContent(content, context);
