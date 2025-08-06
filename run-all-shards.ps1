#!/usr/bin/env pwsh

Write-Host "🚀 Starting Sauce Demo Test Sharding - All Shards" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Create directories if they don't exist
if (!(Test-Path "test-results")) {
    New-Item -ItemType Directory -Path "test-results" | Out-Null
}

if (!(Test-Path "playwright-report")) {
    New-Item -ItemType Directory -Path "playwright-report" | Out-Null
}

Write-Host "📊 Running all 4 shards in parallel..." -ForegroundColor Yellow
Write-Host ""

# Function to run a shard
function Run-Shard {
    param($shardIndex)
    $env:SHARD_INDEX = $shardIndex
    $env:TOTAL_SHARDS = 4
    Write-Host "🔄 Starting Shard $shardIndex..." -ForegroundColor Cyan
    node sharding.config.js
}

# Run all shards in parallel using jobs
$jobs = @()

for ($i = 1; $i -le 4; $i++) {
    $jobs += Start-Job -ScriptBlock {
        param($shardIndex)
        $env:SHARD_INDEX = $shardIndex
        $env:TOTAL_SHARDS = 4
        Set-Location $using:PWD
        node sharding.config.js
    } -ArgumentList $i
}

Write-Host "✅ All shards started successfully!" -ForegroundColor Green
Write-Host "📋 Waiting for all shards to complete..." -ForegroundColor Yellow

# Wait for all jobs to complete
$jobs | Wait-Job

# Get results
$jobs | ForEach-Object {
    $result = Receive-Job $_
    Write-Host "📊 Shard $($_.Id) completed" -ForegroundColor Green
    if ($result) {
        Write-Host $result
    }
}

# Clean up jobs
$jobs | Remove-Job

Write-Host ""
Write-Host "🎉 All shards completed!" -ForegroundColor Green
Write-Host "📊 Reports generated in test-results/ and playwright-report/" -ForegroundColor Yellow
Write-Host "💡 To merge reports, run: npm run merge:playwright:reports" -ForegroundColor Cyan 