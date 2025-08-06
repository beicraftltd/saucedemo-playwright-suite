#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Configuration
const TOTAL_SHARDS = process.env.TOTAL_SHARDS || 4;
const SHARD_INDEX = process.env.SHARD_INDEX || 1;
const BROWSER = process.env.BROWSER || 'chromium';
const HEADED = process.env.HEADED === 'true';
const WORKERS = process.env.WORKERS || 2;

console.log(`🚀 Starting Sauce Demo Test Sharding`);
console.log(`📊 Shard ${SHARD_INDEX}/${TOTAL_SHARDS}`);
console.log(`🌐 Browser: ${BROWSER}`);
console.log(`👁️  Headed: ${HEADED}`);
console.log(`⚡ Workers: ${WORKERS}`);

// Test files to shard
const testFiles = [
  'tests/authentication.spec.ts',
  'tests/shopping-cart.spec.ts',
  'tests/checkout-process.spec.ts',
  'tests/product-sorting.spec.ts',
  'tests/accessibility.spec.ts',
  'tests/performance.spec.ts',
  'tests/cross-browser.spec.ts'
];

// Calculate which tests to run in this shard
const testsPerShard = Math.ceil(testFiles.length / TOTAL_SHARDS);
const startIndex = (SHARD_INDEX - 1) * testsPerShard;
const endIndex = Math.min(startIndex + testsPerShard, testFiles.length);
const shardTests = testFiles.slice(startIndex, endIndex);

console.log(`📋 Tests in this shard: ${shardTests.length}`);
shardTests.forEach(test => console.log(`  - ${test}`));

// Build Playwright command
const args = [
  'test',
  ...shardTests,
  `--shard=${SHARD_INDEX}/${TOTAL_SHARDS}`,
  `--workers=${WORKERS}`,
  '--reporter=json',
  `--output=test-results/shard-${SHARD_INDEX}`,
  '--reporter=html',
  `--output=playwright-report`
];

if (HEADED) {
  args.push('--headed');
}

if (BROWSER !== 'all') {
  args.push(`--project=${BROWSER}`);
}

console.log(`🔧 Command: npx playwright ${args.join(' ')}`);

// Execute the command
const child = spawn('npx', ['playwright', ...args], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  console.log(`✅ Shard ${SHARD_INDEX} completed with exit code ${code}`);
  process.exit(code);
});

child.on('error', (error) => {
  console.error(`❌ Shard ${SHARD_INDEX} failed:`, error);
  process.exit(1);
}); 