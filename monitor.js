#!/usr/bin/env node

/**
 * API Monitoring Script
 * Runs health checks and logs results
 * Can be used with cron jobs or monitoring services
 */

import HealthChecker from './healthCheck.js';
import fs from 'fs';
import path from 'path';

class APIMonitor {
  constructor() {
    this.logFile = path.join(process.cwd(), 'health-monitor.log');
    this.checker = new HealthChecker();
  }

  /**
   * Log health check results
   */
  logResult(result) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      overall: result.overall,
      checks: result.checks
    };

    // Write to log file
    const logLine = `${timestamp} - ${result.overall.toUpperCase()} - ${JSON.stringify(result.checks)}\n`;
    fs.appendFileSync(this.logFile, logLine);

    // Console output
    console.log(`[${timestamp}] Health Check: ${result.overall.toUpperCase()}`);
    
    Object.entries(result.checks).forEach(([name, check]) => {
      const status = check.status === 'healthy' ? '✅' : '❌';
      console.log(`  ${status} ${name}: ${check.message}`);
    });
  }

  /**
   * Run monitoring check
   */
  async runCheck() {
    try {
      console.log('🔍 Running API health check...');
      const result = await this.checker.runAllChecks();
      this.logResult(result);
      
      // Exit with appropriate code
      process.exit(result.overall === 'healthy' ? 0 : 1);
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      const errorResult = {
        timestamp: new Date().toISOString(),
        overall: 'unhealthy',
        checks: { error: { status: 'unhealthy', message: error.message } }
      };
      this.logResult(errorResult);
      process.exit(1);
    }
  }

  /**
   * Check if APIs are working (for CI/CD)
   */
  async quickCheck() {
    try {
      const result = await this.checker.runAllChecks();
      return result.overall === 'healthy';
    } catch (error) {
      console.error('Quick check failed:', error.message);
      return false;
    }
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new APIMonitor();
  
  const args = process.argv.slice(2);
  if (args.includes('--quick')) {
    monitor.quickCheck().then(success => {
      console.log(success ? 'All APIs healthy' : 'Some APIs unhealthy');
      process.exit(success ? 0 : 1);
    });
  } else {
    monitor.runCheck();
  }
}

export default APIMonitor;
