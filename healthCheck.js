import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

/**
 * Health Check System for External APIs
 * Tests connectivity and functionality of all external API dependencies
 */

const API_STATUS = {
  HEALTHY: 'healthy',
  UNHEALTHY: 'unhealthy',
  UNKNOWN: 'unknown'
};

class HealthChecker {
  constructor() {
    this.results = {};
  }

  /**
   * Test Google Generative AI (Gemini) API
   */
  async testGeminiAPI() {
    try {
      if (!process.env.API_KEY) {
        return {
          status: API_STATUS.UNHEALTHY,
          message: 'API_KEY environment variable not set',
          responseTime: null
        };
      }

      const startTime = Date.now();
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Test with a simple prompt
      const result = await model.generateContent("Hello, are you working?");
      const response = await result.response;
      const responseTime = Date.now() - startTime;

      if (response && response.text()) {
        return {
          status: API_STATUS.HEALTHY,
          message: 'Gemini API is responding correctly',
          responseTime: `${responseTime}ms`,
          model: 'gemini-1.5-flash'
        };
      } else {
        return {
          status: API_STATUS.UNHEALTHY,
          message: 'Gemini API returned empty response',
          responseTime: `${responseTime}ms`
        };
      }
    } catch (error) {
      return {
        status: API_STATUS.UNHEALTHY,
        message: `Gemini API error: ${error.message}`,
        responseTime: null,
        error: error.code || 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Test Wikipedia API
   */
  async testWikipediaAPI() {
    try {
      const startTime = Date.now();
      const testTopic = "artificial intelligence";
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(testTopic)}&limit=1&format=json&origin=*`;
      
      const headers = {
        "User-Agent": "AIBlogAgent/1.0 (huanghelen30@gmail.com)",
        "Content-Type": "application/json"
      };

      const searchResponse = await axios.get(searchUrl, { headers, timeout: 10000 });
      const responseTime = Date.now() - startTime;

      if (searchResponse.data && searchResponse.data[1] && searchResponse.data[1].length > 0) {
        // Test the summary endpoint as well
        const title = searchResponse.data[1][0];
        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        
        const summaryStartTime = Date.now();
        const summaryResponse = await axios.get(summaryUrl, { headers, timeout: 10000 });
        const summaryResponseTime = Date.now() - summaryStartTime;

        return {
          status: API_STATUS.HEALTHY,
          message: 'Wikipedia API is responding correctly',
          responseTime: `${responseTime}ms (search) + ${summaryResponseTime}ms (summary)`,
          testTopic: testTopic,
          foundTitle: title
        };
      } else {
        return {
          status: API_STATUS.UNHEALTHY,
          message: 'Wikipedia API returned no search results',
          responseTime: `${responseTime}ms`
        };
      }
    } catch (error) {
      return {
        status: API_STATUS.UNHEALTHY,
        message: `Wikipedia API error: ${error.message}`,
        responseTime: null,
        error: error.code || 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Test internal database connection
   */
  async testDatabase() {
    try {
      // Import database helper
      const db = (await import('./helpers/db.js')).default;
      
      const startTime = Date.now();
      // Simple query to test connection
      const result = await db.raw('SELECT 1 as test');
      const responseTime = Date.now() - startTime;

      if (result && result.rows && result.rows[0] && result.rows[0].test === 1) {
        return {
          status: API_STATUS.HEALTHY,
          message: 'Database connection is working',
          responseTime: `${responseTime}ms`
        };
      } else {
        return {
          status: API_STATUS.UNHEALTHY,
          message: 'Database returned unexpected result',
          responseTime: `${responseTime}ms`
        };
      }
    } catch (error) {
      return {
        status: API_STATUS.UNHEALTHY,
        message: `Database error: ${error.message}`,
        responseTime: null,
        error: error.code || 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Run all health checks
   */
  async runAllChecks() {
    console.log('🔍 Starting health checks...\n');

    // Test Gemini API
    console.log('Testing Google Generative AI (Gemini)...');
    this.results.gemini = await this.testGeminiAPI();
    this.printResult('Gemini API', this.results.gemini);

    // Test Wikipedia API
    console.log('\nTesting Wikipedia API...');
    this.results.wikipedia = await this.testWikipediaAPI();
    this.printResult('Wikipedia API', this.results.wikipedia);

    // Test Database
    console.log('\nTesting Database...');
    this.results.database = await this.testDatabase();
    this.printResult('Database', this.results.database);

    // Overall status
    const allHealthy = Object.values(this.results).every(result => result.status === API_STATUS.HEALTHY);
    const overallStatus = allHealthy ? API_STATUS.HEALTHY : API_STATUS.UNHEALTHY;

    console.log('\n' + '='.repeat(50));
    console.log(`Overall Status: ${overallStatus.toUpperCase()}`);
    console.log('='.repeat(50));

    return {
      overall: overallStatus,
      checks: this.results,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Print formatted result
   */
  printResult(name, result) {
    const statusIcon = result.status === API_STATUS.HEALTHY ? '✅' : '❌';
    console.log(`${statusIcon} ${name}: ${result.status.toUpperCase()}`);
    console.log(`   Message: ${result.message}`);
    if (result.responseTime) {
      console.log(`   Response Time: ${result.responseTime}`);
    }
    if (result.error) {
      console.log(`   Error Code: ${result.error}`);
    }
  }

  /**
   * Get health status as JSON (for API endpoints)
   */
  async getHealthStatus() {
    await this.runAllChecks();
    return {
      status: this.results,
      timestamp: new Date().toISOString()
    };
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const checker = new HealthChecker();
  checker.runAllChecks()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Health check failed:', error);
      process.exit(1);
    });
}

export default HealthChecker;
