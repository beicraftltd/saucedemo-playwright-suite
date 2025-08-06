@echo off
echo 🚀 Starting Sauce Demo Test Sharding - All Shards
echo ================================================

REM Create test-results directory if it doesn't exist
if not exist "test-results" mkdir test-results

REM Create playwright-report directory if it doesn't exist
if not exist "playwright-report" mkdir playwright-report

echo 📊 Running all 4 shards in parallel...
echo.

REM Run all shards in parallel
start "Shard 1" cmd /c "set SHARD_INDEX=1 && set TOTAL_SHARDS=4 && node sharding.config.js"
start "Shard 2" cmd /c "set SHARD_INDEX=2 && set TOTAL_SHARDS=4 && node sharding.config.js"
start "Shard 3" cmd /c "set SHARD_INDEX=3 && set TOTAL_SHARDS=4 && node sharding.config.js"
start "Shard 4" cmd /c "set SHARD_INDEX=4 && set TOTAL_SHARDS=4 && node sharding.config.js"

echo ✅ All shards started successfully!
echo 📋 Check individual command windows for progress
echo 📊 Reports will be generated in test-results/ and playwright-report/
echo.
echo 💡 To merge reports after completion, run: npm run merge:playwright:reports 