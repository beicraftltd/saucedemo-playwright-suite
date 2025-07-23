#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function formatDate(date) {
  return date.toISOString().replace(/[:.]/g, '-').replace('T', 'T').slice(0, 19);
}

function renderReport(data, pageTitle = 'Performance Report') {
  // This function generates a Lighthouse-style HTML report using the data provided
  // Expects data to have metrics, opportunities, diagnostics, etc.
  const now = new Date();
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #1565c0; color: white; padding: 20px; border-radius: 5px; }
        .summary { background: #e3f2fd; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .score { font-size: 2em; font-weight: bold; }
        .metrics, .opportunities, .diagnostics { margin: 20px 0; }
        .metric { background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 8px; }
        .opportunity { background: #fffde7; padding: 10px; border-radius: 5px; margin-bottom: 8px; }
        .diagnostic { background: #f3e5f5; padding: 10px; border-radius: 5px; margin-bottom: 8px; }
        .bar { height: 20px; border-radius: 10px; background: #cfd8dc; margin: 5px 0; }
        .bar-inner { height: 100%; border-radius: 10px; background: #43a047; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Performance Report</h1>
        <p><strong>Page:</strong> ${data.pageTitle || 'Unknown'}</p>
        <p><strong>Generated:</strong> ${now.toLocaleString()}</p>
    </div>
    <div class="summary">
        <h2>📊 Summary</h2>
        <div class="score">Performance Score: ${data.score !== undefined ? data.score : 'N/A'}</div>
        <p><strong>First Contentful Paint:</strong> ${data.metrics?.firstContentfulPaint || 'N/A'} ms</p>
        <p><strong>Speed Index:</strong> ${data.metrics?.speedIndex || 'N/A'} ms</p>
        <p><strong>Largest Contentful Paint:</strong> ${data.metrics?.largestContentfulPaint || 'N/A'} ms</p>
        <p><strong>Total Blocking Time:</strong> ${data.metrics?.totalBlockingTime || 'N/A'} ms</p>
        <p><strong>Cumulative Layout Shift:</strong> ${data.metrics?.cumulativeLayoutShift || 'N/A'}</p>
    </div>
    <div class="metrics">
        <h2>📈 Metrics</h2>
        ${(data.metrics && Object.entries(data.metrics).map(([k, v]) => `<div class="metric"><strong>${k}:</strong> ${v}</div>`).join('')) || '<div class="metric">No metrics available</div>'}
    </div>
    <div class="opportunities">
        <h2>💡 Opportunities</h2>
        ${(data.opportunities && data.opportunities.length) ? data.opportunities.map(o => `<div class="opportunity"><strong>${o.title}:</strong> ${o.description || ''} <br/><strong>Estimated Savings:</strong> ${o.savings || 'N/A'} ms</div>`).join('') : '<div class="opportunity">No opportunities found</div>'}
    </div>
    <div class="diagnostics">
        <h2>🔬 Diagnostics</h2>
        ${(data.diagnostics && data.diagnostics.length) ? data.diagnostics.map(d => `<div class="diagnostic"><strong>${d.title}:</strong> ${d.description || ''}</div>`).join('') : '<div class="diagnostic">No diagnostics found</div>'}
    </div>
</body>
</html>`;
}

function main() {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node generate-performance-report.js <input-json>');
    process.exit(1);
  }
  const raw = fs.readFileSync(input, 'utf-8');
  const data = JSON.parse(raw);
  const html = renderReport(data, data.pageTitle || 'Performance Report');
  const outDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outFile = path.join(outDir, `performance-report-${formatDate(new Date())}.html`);
  fs.writeFileSync(outFile, html, 'utf-8');
  console.log('Performance report generated:', outFile);
}

if (require.main === module) main(); 