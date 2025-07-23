const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

class ShardingManager {
  constructor() {
    this.featuresDir = path.join(__dirname, 'features');
    this.totalShards = process.env.TOTAL_SHARDS || 4;
    this.currentShard = process.env.SHARD_INDEX || 1;
  }

  // Get all feature files
  getFeatureFiles() {
    const features = [];
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.feature')) {
          features.push(filePath);
        }
      });
    };
    walkDir(this.featuresDir);
    return features;
  }

  // Distribute feature files across shards
  distributeFeatures() {
    const features = this.getFeatureFiles();
    const featuresPerShard = Math.ceil(features.length / this.totalShards);
    const startIndex = (this.currentShard - 1) * featuresPerShard;
    const endIndex = Math.min(startIndex + featuresPerShard, features.length);
    
    return features.slice(startIndex, endIndex);
  }

  // Run tests for current shard
  runShard() {
    const features = this.distributeFeatures();
    if (features.length === 0) {
      console.log(`No features assigned to shard ${this.currentShard}`);
      return;
    }

    const featurePaths = features.map(f => `"${f}"`).join(' ');
    // Output a unique JSON report per shard
    const reportFile = `reports/cucumber-report-${this.currentShard}.json`;
    const command = `cucumber-js ${featurePaths} --parallel 2 --format json:${reportFile}`;
    
    console.log(`Running shard ${this.currentShard}/${this.totalShards} with ${features.length} features`);
    console.log(`Features: ${features.map(f => path.basename(f)).join(', ')}`);
    
    try {
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      console.error(`Shard ${this.currentShard} failed:`, error.message);
      process.exit(1);
    }
  }

  // Run all shards in parallel
  runAllShards() {
    const commands = [];
    for (let i = 1; i <= this.totalShards; i++) {
      const command = `SHARD_INDEX=${i} TOTAL_SHARDS=${this.totalShards} node sharding.config.js`;
      commands.push(command);
    }
    
    console.log(`Running ${this.totalShards} shards in parallel...`);
    commands.forEach((cmd, index) => {
      console.log(`Starting shard ${index + 1}: ${cmd}`);
      // In a real implementation, you'd spawn these processes
      // For now, we'll just show the commands
    });
  }
}

// CLI interface
if (require.main === module) {
  const manager = new ShardingManager();
  
  if (process.argv.includes('--all')) {
    manager.runAllShards();
  } else {
    manager.runShard();
  }
}

module.exports = ShardingManager; 