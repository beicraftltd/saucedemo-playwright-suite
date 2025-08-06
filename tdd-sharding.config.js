#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Configuration
const TOTAL_SHARDS = process.env.TOTAL_SHARDS || 3;
const SHARD_INDEX = process.env.SHARD_INDEX || 1;
const HEADED = process.env.HEADED === 'true';
const WORKERS = process.env.WORKERS || 2;
const TAGS = process.env.TAGS || '';

console.log(`🚀 Starting TDD Test Sharding`);
console.log(`📊 Shard ${SHARD_INDEX}/${TOTAL_SHARDS}`);
console.log(`👁️  Headed: ${HEADED}`);
console.log(`⚡ Workers: ${WORKERS}`);
console.log(`🏷️  Tags: ${TAGS || 'all'}`);

// TDD test files to shard
const testFiles = [
  'tests/login.spec.ts',
  'tests/cart.spec.ts',
  'tests/checkout.spec.ts'
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
  'playwright',
  'test',
  ...shardTests,
  '--reporter=html',
  `--reporter=html:reports/playwright-report-shard-${SHARD_INDEX}.html`,
  `--reporter=json:reports/playwright-report-shard-${SHARD_INDEX}.json`,
  '--reporter=list'
];

if (HEADED) {
  args.push('--headed');
}

if (WORKERS > 1) {
  args.push(`--workers=${WORKERS}`);
}

if (TAGS) {
  args.push(`--grep=${TAGS}`);
}

console.log(`🔧 Command: npx ${args.join(' ')}`);

// Execute the command
const child = spawn('npx', args, {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  console.log(`✅ TDD Shard ${SHARD_INDEX} completed with exit code ${code}`);
  process.exit(code);
});

child.on('error', (error) => {
  console.error(`❌ TDD Shard ${SHARD_INDEX} failed:`, error);
  process.exit(1);
}); 