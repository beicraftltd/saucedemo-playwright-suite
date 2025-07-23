import { Page } from '@playwright/test';
import { getViolations } from 'axe-playwright';
import * as fs from 'fs';
import * as path from 'path';

// Define the Violation type based on axe-playwright structure
interface Violation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | undefined;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: any[];
}

/**
 * AccessibilityReporter Class
 * 
 * This class provides comprehensive accessibility reporting with:
 * - Detailed violation analysis
 * - Specific recommendations for fixes
 * - Page-specific issue highlighting
 * - HTML report generation
 * - Priority-based issue categorization
 */
export class AccessibilityReporter {
  readonly page: Page;
  private reportData: any[] = [];
  private currentPage: string = '';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Generate comprehensive accessibility report for a page
   * @param pageTitle - Title of the page being tested
   * @param pageUrl - URL of the page being tested
   */
  async generateAccessibilityReport(pageTitle: string, pageUrl: string) {
    console.log(`📊 Generating accessibility report for: ${pageTitle}`);
    
    this.currentPage = pageTitle;
    const timestamp = new Date().toISOString();
    
    // Get all accessibility violations
    const violations = await getViolations(this.page, undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    });

    const report = {
      pageTitle,
      pageUrl,
      timestamp,
      summary: this.generateSummary(violations as Violation[]),
      violations: this.analyzeViolations(violations as Violation[]),
      recommendations: this.generateRecommendations(violations as Violation[]),
      priority: this.categorizeByPriority(violations as Violation[])
    };

    this.reportData.push(report);
    
    // Print detailed report to console
    this.printDetailedReport(report);
    
    // Generate HTML report
    await this.generateHTMLReport();
    
    return report;
  }

  /**
   * Generate summary statistics
   */
  private generateSummary(violations: Violation[]) {
    const totalViolations = violations.length;
    const criticalCount = violations.filter(v => v.impact === 'critical').length;
    const seriousCount = violations.filter(v => v.impact === 'serious').length;
    const moderateCount = violations.filter(v => v.impact === 'moderate').length;
    const minorCount = violations.filter(v => v.impact === 'minor').length;

    return {
      totalViolations,
      criticalCount,
      seriousCount,
      moderateCount,
      minorCount,
      complianceLevel: this.calculateComplianceLevel(totalViolations, criticalCount, seriousCount)
    };
  }

  /**
   * Analyze violations with detailed information
   */
  private analyzeViolations(violations: Violation[]) {
    return violations.map(violation => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      tags: violation.tags,
      nodes: violation.nodes.map(node => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary,
        impact: node.impact,
        any: node.any,
        all: node.all,
        none: node.none
      })),
      recommendations: this.getViolationRecommendations(violation)
    }));
  }

  /**
   * Generate specific recommendations for each violation type
   */
  private getViolationRecommendations(violation: Violation) {
    const recommendations: any = {
      'color-contrast': {
        title: 'Color Contrast Issues',
        description: 'Text or images have insufficient color contrast',
        fixes: [
          'Increase the contrast ratio between text and background colors',
          'Use tools like WebAIM Contrast Checker to verify contrast ratios',
          'Ensure text has at least 4.5:1 contrast ratio for normal text',
          'Ensure text has at least 3:1 contrast ratio for large text (18pt+)',
          'Consider using darker backgrounds or lighter text colors'
        ],
        codeExample: `
/* Good contrast example */
.good-contrast {
  color: #000000; /* Black text */
  background-color: #ffffff; /* White background */
  /* Contrast ratio: 21:1 */
}

/* Poor contrast example - AVOID */
.poor-contrast {
  color: #cccccc; /* Light gray text */
  background-color: #ffffff; /* White background */
  /* Contrast ratio: 1.6:1 - Too low! */
}
        `
      },
      'label': {
        title: 'Missing Form Labels',
        description: 'Form elements lack proper labels',
        fixes: [
          'Add explicit <label> elements for all form inputs',
          'Use aria-label or aria-labelledby for complex form controls',
          'Ensure labels are properly associated with form elements',
          'Use descriptive label text that explains the input purpose',
          'Test with screen readers to verify label associations'
        ],
        codeExample: `
<!-- Good example -->
<label for="username">Username:</label>
<input type="text" id="username" name="username">

<!-- Also good - using aria-label -->
<input type="text" aria-label="Username" name="username">

<!-- Bad example - AVOID -->
<input type="text" name="username"> <!-- No label! -->
        `
      },
      'link-name': {
        title: 'Link Name Issues',
        description: 'Links lack discernible text for screen readers',
        fixes: [
          'Add descriptive text content to all links',
          'Use aria-label for links with only images or icons',
          'Ensure link text describes the destination or action',
          'Avoid generic text like "click here" or "read more"',
          'Test links with screen readers to verify accessibility'
        ],
        codeExample: `
<!-- Good example -->
<a href="/about">About Our Company</a>

<!-- Good example with aria-label -->
<a href="/about" aria-label="Learn more about our company">
  <img src="about-icon.png" alt="">
</a>

<!-- Bad example - AVOID -->
<a href="/about">Click here</a> <!-- Generic text! -->
        `
      },
      'heading-order': {
        title: 'Heading Structure Issues',
        description: 'Heading hierarchy is not properly structured',
        fixes: [
          'Use heading elements (h1-h6) in proper hierarchical order',
          'Start with h1 for the main page heading',
          'Don\'t skip heading levels (e.g., h1 to h3)',
          'Use headings to organize content logically',
          'Ensure each page has exactly one h1 element'
        ],
        codeExample: `
<!-- Good heading structure -->
<h1>Main Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
<h2>Another Section</h2>

<!-- Bad structure - AVOID -->
<h1>Main Title</h1>
<h3>Subsection</h3> <!-- Skipped h2! -->
        `
      },
      'focus-order-semantics': {
        title: 'Focus Order Issues',
        description: 'Tab order doesn\'t follow logical document structure',
        fixes: [
          'Ensure tab order follows the visual layout of the page',
          'Use tabindex="-1" sparingly and only when necessary',
          'Test keyboard navigation to verify logical flow',
          'Ensure all interactive elements are keyboard accessible',
          'Use semantic HTML to improve focus order'
        ],
        codeExample: `
<!-- Good focus order -->
<nav>
  <a href="#home">Home</a>
  <a href="#about">About</a>
  <a href="#contact">Contact</a>
</nav>
<main>
  <h1>Page Content</h1>
  <form>
    <input type="text" placeholder="Name">
    <button type="submit">Submit</button>
  </form>
</main>
        `
      }
    };

    return recommendations[violation.id] || {
      title: violation.description,
      description: 'General accessibility issue',
      fixes: [
        'Review the WCAG guidelines for this specific issue',
        'Test with assistive technologies',
        'Consult accessibility experts if needed'
      ],
      codeExample: 'Refer to WCAG guidelines for specific implementation details.'
    };
  }

  /**
   * Generate overall recommendations
   */
  private generateRecommendations(violations: Violation[]) {
    const recommendations = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[]
    };

    violations.forEach(violation => {
      const rec = this.getViolationRecommendations(violation);
      
      if (violation.impact === 'critical') {
        recommendations.immediate.push(`Fix ${rec.title}: ${rec.fixes[0]}`);
      } else if (violation.impact === 'serious') {
        recommendations.shortTerm.push(`Address ${rec.title}: ${rec.fixes[0]}`);
      } else {
        recommendations.longTerm.push(`Consider ${rec.title}: ${rec.fixes[0]}`);
      }
    });

    return recommendations;
  }

  /**
   * Categorize issues by priority
   */
  private categorizeByPriority(violations: Violation[]) {
    // Process violations to include recommendations
    const processedViolations = violations.map(violation => ({
      ...violation,
      recommendations: this.getViolationRecommendations(violation)
    }));

    return {
      critical: processedViolations.filter(v => v.impact === 'critical'),
      serious: processedViolations.filter(v => v.impact === 'serious'),
      moderate: processedViolations.filter(v => v.impact === 'moderate'),
      minor: processedViolations.filter(v => v.impact === 'minor')
    };
  }

  /**
   * Calculate compliance level
   */
  private calculateComplianceLevel(total: number, critical: number, serious: number) {
    if (critical > 0) return 'Non-Compliant (Critical Issues)';
    if (serious > 0) return 'Partially Compliant (Serious Issues)';
    if (total > 0) return 'Mostly Compliant (Minor Issues)';
    return 'Fully Compliant';
  }

  /**
   * Print detailed report to console
   */
  private printDetailedReport(report: any) {
    console.log('\n' + '='.repeat(80));
    console.log(`🔍 ACCESSIBILITY REPORT: ${report.pageTitle}`);
    console.log('='.repeat(80));
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`   Page: ${report.pageTitle}`);
    console.log(`   URL: ${report.pageUrl}`);
    console.log(`   Compliance Level: ${report.summary.complianceLevel}`);
    console.log(`   Total Violations: ${report.summary.totalViolations}`);
    console.log(`   Critical: ${report.summary.criticalCount}`);
    console.log(`   Serious: ${report.summary.seriousCount}`);
    console.log(`   Moderate: ${report.summary.moderateCount}`);
    console.log(`   Minor: ${report.summary.minorCount}`);

    // Critical Issues
    if (report.priority.critical.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES (Fix Immediately):');
      report.priority.critical.forEach((violation: any, index: number) => {
        console.log(`   ${index + 1}. ${violation.description}`);
        console.log(`      Elements affected: ${violation.nodes.length}`);
        if (violation.recommendations && violation.recommendations.fixes && violation.recommendations.fixes.length > 0) {
          console.log(`      Recommendation: ${violation.recommendations.fixes[0]}`);
        } else {
          console.log(`      Recommendation: Review WCAG guidelines for ${violation.id}`);
        }
      });
    }

    // Serious Issues
    if (report.priority.serious.length > 0) {
      console.log('\n⚠️ SERIOUS ISSUES (Fix Soon):');
      report.priority.serious.forEach((violation: any, index: number) => {
        console.log(`   ${index + 1}. ${violation.description}`);
        console.log(`      Elements affected: ${violation.nodes.length}`);
        if (violation.recommendations && violation.recommendations.fixes && violation.recommendations.fixes.length > 0) {
          console.log(`      Recommendation: ${violation.recommendations.fixes[0]}`);
        } else {
          console.log(`      Recommendation: Review WCAG guidelines for ${violation.id}`);
        }
      });
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (report.recommendations.immediate.length > 0) {
      console.log('   Immediate Actions:');
      report.recommendations.immediate.forEach((rec: string, index: number) => {
        console.log(`     ${index + 1}. ${rec}`);
      });
    }
    
    if (report.recommendations.shortTerm.length > 0) {
      console.log('   Short-term Actions:');
      report.recommendations.shortTerm.forEach((rec: string, index: number) => {
        console.log(`     ${index + 1}. ${rec}`);
      });
    }

    console.log('\n' + '='.repeat(80));
  }

  /**
   * Generate HTML report
   */
  private async generateHTMLReport() {
    const htmlContent = this.generateHTMLContent();
    const reportDir = 'accessibility-reports';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `accessibility-report-${timestamp}.html`;
    
    // Create reports directory if it doesn't exist
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const filepath = path.join(reportDir, filename);
    fs.writeFileSync(filepath, htmlContent);
    
    console.log(`📄 HTML report generated: ${filepath}`);
  }

  /**
   * Generate HTML content for the report
   */
  private generateHTMLContent() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Report - ${this.currentPage}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 5px; }
        .summary { background: #ecf0f1; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .critical { border-left: 5px solid #e74c3c; background: #fdf2f2; padding: 15px; margin: 10px 0; }
        .serious { border-left: 5px solid #f39c12; background: #fef9e7; padding: 15px; margin: 10px 0; }
        .moderate { border-left: 5px solid #f1c40f; background: #fefce8; padding: 15px; margin: 10px 0; }
        .minor { border-left: 5px solid #3498db; background: #f0f8ff; padding: 15px; margin: 10px 0; }
        .recommendation { background: #e8f5e8; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .code { background: #2c3e50; color: #ecf0f1; padding: 10px; border-radius: 3px; font-family: monospace; }
        .impact-badge { padding: 5px 10px; border-radius: 3px; color: white; font-weight: bold; }
        .impact-critical { background: #e74c3c; }
        .impact-serious { background: #f39c12; }
        .impact-moderate { background: #f1c40f; }
        .impact-minor { background: #3498db; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 Accessibility Report</h1>
        <p><strong>Page:</strong> ${this.currentPage}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>

    ${this.reportData.map(report => `
        <div class="summary">
            <h2>📊 Summary</h2>
            <p><strong>Compliance Level:</strong> ${report.summary.complianceLevel}</p>
            <p><strong>Total Violations:</strong> ${report.summary.totalViolations}</p>
            <p><strong>Critical:</strong> ${report.summary.criticalCount} | 
               <strong>Serious:</strong> ${report.summary.seriousCount} | 
               <strong>Moderate:</strong> ${report.summary.moderateCount} | 
               <strong>Minor:</strong> ${report.summary.minorCount}</p>
        </div>

        ${report.priority.critical.length > 0 ? `
            <h2>🚨 Critical Issues (Fix Immediately)</h2>
            ${report.priority.critical.map((violation: any) => `
              <li>
                <strong>${violation.recommendations.title}</strong>: ${violation.recommendations.description}
                <ul>
                  ${violation.recommendations.fixes.map((fix: string) => `<li>${fix}</li>`).join('')}
                </ul>
              </li>
            `).join('')}
        ` : ''}

        ${report.priority.serious.length > 0 ? `
            <h2>⚠️ Serious Issues (Fix Soon)</h2>
            ${report.priority.serious.map((violation: any) => `
              <li>
                <strong>${violation.recommendations.title}</strong>: ${violation.recommendations.description}
                <ul>
                  ${violation.recommendations.fixes.map((fix: string) => `<li>${fix}</li>`).join('')}
                </ul>
              </li>
            `).join('')}
        ` : ''}

        ${report.priority.moderate.length > 0 ? `
            <h2>⚠️ Moderate Issues (Consider Fixing)</h2>
            ${report.priority.moderate.map((violation: any) => `
              <li>
                <strong>${violation.recommendations.title}</strong>: ${violation.recommendations.description}
                <ul>
                  ${violation.recommendations.fixes.map((fix: string) => `<li>${fix}</li>`).join('')}
                </ul>
              </li>
            `).join('')}
        ` : ''}

        <h2>📋 Action Plan</h2>
        ${report.recommendations.immediate.length > 0 ? `
            <div class="recommendation">
                <h3>🚨 Immediate Actions (Critical Issues)</h3>
                <ol>
                    ${report.recommendations.immediate.map((rec: string) => `<li>${rec}</li>`).join('')}
                </ol>
            </div>
        ` : ''}
        
        ${report.recommendations.shortTerm.length > 0 ? `
            <div class="recommendation">
                <h3>⚠️ Short-term Actions (Serious Issues)</h3>
                <ol>
                    ${report.recommendations.shortTerm.map((rec: string) => `<li>${rec}</li>`).join('')}
                </ol>
            </div>
        ` : ''}
        
        ${report.recommendations.longTerm.length > 0 ? `
            <div class="recommendation">
                <h3>📈 Long-term Improvements (Moderate/Minor Issues)</h3>
                <ol>
                    ${report.recommendations.longTerm.map((rec: string) => `<li>${rec}</li>`).join('')}
                </ol>
            </div>
        ` : ''}
    `).join('')}
</body>
</html>
    `;
  }

  /**
   * Get all reports generated in this session
   */
  getAllReports() {
    return this.reportData;
  }

  /**
   * Clear report data
   */
  clearReports() {
    this.reportData = [];
  }
} 