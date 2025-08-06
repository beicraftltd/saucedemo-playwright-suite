#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Configuration
const TOTAL_SHARDS = process.env.TOTAL_SHARDS || 4;
const SHARD_INDEX = process.env.SHARD_INDEX || 1;
const HEADED = process.env.HEADED === 'true';
const WORKERS = process.env.WORKERS || 2;
const TAGS = process.env.TAGS || 'not @wip';

console.log(`🚀 Starting BDD Test Sharding`);
console.log(`📊 Shard ${SHARD_INDEX}/${TOTAL_SHARDS}`);
console.log(`👁️  Headed: ${HEADED}`);
console.log(`⚡ Workers: ${WORKERS}`);
console.log(`🏷️  Tags: ${TAGS}`);

// BDD feature files to shard
const featureFiles = [
  'features/login.feature',
  'features/shopping-cart.feature', 
  'features/checkout.feature'
];

// Calculate which features to run in this shard
const featuresPerShard = Math.ceil(featureFiles.length / TOTAL_SHARDS);
const startIndex = (SHARD_INDEX - 1) * featuresPerShard;
const endIndex = Math.min(startIndex + featuresPerShard, featureFiles.length);
const shardFeatures = featureFiles.slice(startIndex, endIndex);

console.log(`📋 Features in this shard: ${shardFeatures.length}`);
shardFeatures.forEach(feature => console.log(`  - ${feature}`));

// Build Cucumber command
const args = [
  'cucumber-js',
  ...shardFeatures,
  '--require-module=ts-node/register',
  '--require=features/step-definitions/*.ts',
  '--require=features/support/*.ts',
  '--format=progress-bar',
  `--format=html:reports/cucumber-report-shard-${SHARD_INDEX}.html`,
  `--format=json:reports/cucumber-report-shard-${SHARD_INDEX}.json`,
  `--parallel=${WORKERS}`
];

// Set environment variable for headed mode instead of world-parameters
if (HEADED) {
  process.env.HEADED = 'true';
}

console.log(`🔧 Command: npx ${args.join(' ')}`);

// Execute the command
const child = spawn('npx', args, {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  console.log(`✅ BDD Shard ${SHARD_INDEX} completed with exit code ${code}`);
  process.exit(code);
});

child.on('error', (error) => {
  console.error(`❌ BDD Shard ${SHARD_INDEX} failed:`, error);
  process.exit(1);
}); 