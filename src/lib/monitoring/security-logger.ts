import { SecurityEvent } from '@/lib/types/security';

export class SecurityLogger {
  private static events: SecurityEvent[] = [];
  private static maxEvents = 1000;

  static async log(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };

    // Add to in-memory store
    this.events.push(securityEvent);

    // Trim if too many events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SECURITY EVENT] ${event.type.toUpperCase()}:`, securityEvent);
    } else {
      // In production, send to external monitoring
      this.sendToMonitoringService(securityEvent);
    }

    // Check for critical events and trigger alerts
    this.checkForAlerts(securityEvent);
  }

  static getEvents(limit?: number, type?: string): SecurityEvent[] {
    let filtered = this.events;
    
    if (type) {
      filtered = filtered.filter(event => event.type === type);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return limit ? filtered.slice(0, limit) : filtered;
  }

  static getEventsByIP(ip: string, timeWindow: number = 3600000): SecurityEvent[] {
    const now = Date.now();
    return this.events.filter(event => 
      event.ip === ip && 
      (now - event.timestamp.getTime()) <= timeWindow
    );
  }

  static getEventStats(timeWindow: number = 3600000): Record<string, number> {
    const now = Date.now();
    const recentEvents = this.events.filter(event => 
      (now - event.timestamp.getTime()) <= timeWindow
    );

    const stats: Record<string, number> = {};
    recentEvents.forEach(event => {
      stats[event.type] = (stats[event.type] || 0) + 1;
    });

    return stats;
  }

  private static async sendToMonitoringService(event: SecurityEvent): Promise<void> {
    try {
      // Log to console for now (can be extended with external services)
      console.error('Security Event:', JSON.stringify(event, null, 2));

      // Future: Send to Sentry or external monitoring
      if (process.env.SENTRY_DSN) {
        // Implementation for Sentry integration
      }

      // Future: Send webhook
      if (process.env.SECURITY_WEBHOOK_URL) {
        await fetch(process.env.SECURITY_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        });
      }

    } catch (error) {
      console.error('Failed to send security event to monitoring service:', error);
    }
  }

  private static checkForAlerts(event: SecurityEvent): void {
    // Critical events trigger immediate alerts
    if (event.severity === 'critical') {
      this.sendAlert(`CRITICAL: ${event.type}`, event);
    }

    // Multiple auth failures from same IP
    if (event.type === 'auth_failure' && event.ip) {
      const recentFailures = this.getEventsByIP(event.ip, 300000); // 5 minutes
      if (recentFailures.length >= 5) {
        this.sendAlert('Multiple authentication failures detected', {
          ...event,
          details: { ...event.details, failureCount: recentFailures.length }
        });
      }
    }

    // High rate of security events
    const recentEvents = this.getEventsByIP(event.ip || 'unknown', 300000); // 5 minutes
    if (recentEvents.length >= 10) {
      this.sendAlert('High volume of security events detected', {
        ...event,
        details: { ...event.details, eventCount: recentEvents.length }
      });
    }
  }

  private static async sendAlert(message: string, event: SecurityEvent): Promise<void> {
    try {
      console.error('🚨 SECURITY ALERT:', message);
      console.error('Event Details:', JSON.stringify(event, null, 2));

      // Future: Send email alert
      if (process.env.ADMIN_EMAIL_RECIPIENT) {
        // Implementation for email alerts
      }

      // Future: Send Slack webhook if configured
      if (process.env.SLACK_WEBHOOK_URL) {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 Security Alert: ${message}`,
            attachments: [{
              color: event.severity === 'critical' ? 'danger' : 
                     event.severity === 'high' ? 'warning' : 'good',
              fields: [
                { title: 'Type', value: event.type, short: true },
                { title: 'Severity', value: event.severity, short: true },
                { title: 'IP', value: event.ip || 'Unknown', short: true },
                { title: 'Timestamp', value: event.timestamp.toISOString(), short: true }
              ]
            }]
          })
        });
      }

    } catch (error) {
      console.error('Failed to send security alert:', error);
    }
  }

  static async exportEvents(format: 'json' | 'csv' = 'json'): Promise<string> {
    const events = this.getEvents();
    
    if (format === 'csv') {
      const headers = ['timestamp', 'type', 'severity', 'ip', 'userAgent', 'details'];
      const csvRows = [headers.join(',')];
      
      events.forEach(event => {
        const row = [
          event.timestamp.toISOString(),
          event.type,
          event.severity,
          event.ip || '',
          event.userAgent || '',
          JSON.stringify(event.details).replace(/"/g, '""')
        ];
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    }
    
    return JSON.stringify(events, null, 2);
  }

  static clearEvents(): void {
    this.events = [];
  }
}