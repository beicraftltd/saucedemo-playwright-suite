#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function formatDate(date) {
  return date.toISOString().replace(/[:.]/g, '-').replace('T', 'T').slice(0, 19);
}

function renderReport(data, pageTitle = 'Accessibility Report') {
  // This function generates HTML similar to your sample, using the data provided
  // For simplicity, expects data.violations as an array of { impact, help, nodes, description, ... }
  const summary = {
    total: data.violations.length,
    critical: data.violations.filter(v => v.impact === 'critical').length,
    serious: data.violations.filter(v => v.impact === 'serious').length,
    moderate: data.violations.filter(v => v.impact === 'moderate').length,
    minor: data.violations.filter(v => v.impact === 'minor').length,
  };
  const compliance = summary.critical > 0 ? 'Non-Compliant (Critical Issues)' : 'Compliant';
  const now = new Date();
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
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
        <p><strong>Page:</strong> ${data.pageTitle || 'Unknown'}</p>
        <p><strong>Generated:</strong> ${now.toLocaleString()}</p>
    </div>
    <div class="summary">
        <h2>📊 Summary</h2>
        <p><strong>Compliance Level:</strong> ${compliance}</p>
        <p><strong>Total Violations:</strong> ${summary.total}</p>
        <p><strong>Critical:</strong> ${summary.critical} | 
           <strong>Serious:</strong> ${summary.serious} | 
           <strong>Moderate:</strong> ${summary.moderate} | 
           <strong>Minor:</strong> ${summary.minor}</p>
    </div>
    ${['critical','serious','moderate','minor'].map(impact => {
      const issues = data.violations.filter(v => v.impact === impact);
      if (!issues.length) return '';
      return `<h2>${impact === 'critical' ? '🚨 Critical Issues (Fix Immediately)' : impact === 'serious' ? '⚠️ Serious Issues (Fix Soon)' : impact === 'moderate' ? '⚠️ Moderate Issues' : 'ℹ️ Minor Issues'}</h2>\n${issues.map(v => `
        <div class="${impact}">
            <h3><span class="impact-badge impact-${impact}">${impact.charAt(0).toUpperCase() + impact.slice(1)}</span> ${v.help || v.description}</h3>
            <p><strong>Elements affected:</strong> ${v.nodes ? v.nodes.length : '?'}</p>
            <p><strong>Help:</strong> ${v.help}</p>
            <div class="recommendation">
                <h4>💡 How to Fix:</h4>
                <ul>${v.nodes && v.nodes[0] && v.nodes[0].any ? v.nodes[0].any.map(a => `<li>${a.message}</li>`).join('') : ''}</ul>
                <h4>📝 Code Example:</h4>
                <div class="code">${v.codeExample || ''}</div>
            </div>
        </div>`).join('')}`;
    }).join('')}
    <h2>📋 Action Plan</h2>
    <div class="recommendation">
        <h3>🚨 Immediate Actions (Critical Issues)</h3>
        <ol>${data.violations.filter(v => v.impact === 'critical').map(v => `<li>${v.help || v.description}</li>`).join('') || '<li>None</li>'}</ol>
    </div>
    <div class="recommendation">
        <h3>⚠️ Short-term Actions (Serious Issues)</h3>
        <ol>${data.violations.filter(v => v.impact === 'serious').map(v => `<li>${v.help || v.description}</li>`).join('') || '<li>None</li>'}</ol>
    </div>
</body>
</html>`;
}

function main() {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node generate-accessibility-report.js <input-json>');
    process.exit(1);
  }
  const raw = fs.readFileSync(input, 'utf-8');
  const data = JSON.parse(raw);
  const html = renderReport(data, data.pageTitle || 'Accessibility Report');
  const outDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outFile = path.join(outDir, `accessibility-report-${formatDate(new Date())}.html`);
  fs.writeFileSync(outFile, html, 'utf-8');
  console.log('Accessibility report generated:', outFile);
}

if (require.main === module) main(); 