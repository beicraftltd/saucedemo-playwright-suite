#!/usr/bin/env pwsh

Write-Host "🚀 Starting BDD Test Sharding Execution" -ForegroundColor Green
Write-Host ""

# Set default values
$TOTAL_SHARDS = if ($env:TOTAL_SHARDS) { $env:TOTAL_SHARDS } else { "4" }
$WORKERS = if ($env:WORKERS) { $env:WORKERS } else { "2" }
$HEADED = if ($env:HEADED) { $env:HEADED } else { "false" }
$TAGS = if ($env:TAGS) { $env:TAGS } else { "not @wip" }

# Display configuration
Write-Host "Total Shards: $TOTAL_SHARDS" -ForegroundColor Cyan
Write-Host "Workers: $WORKERS" -ForegroundColor Cyan
Write-Host "Headed: $HEADED" -ForegroundColor Cyan
Write-Host "Tags: $TAGS" -ForegroundColor Cyan
Write-Host ""

# Check if parallel execution is requested
if ($args[0] -eq "parallel") {
    Write-Host "Running BDD shards in parallel..." -ForegroundColor Yellow
    Write-Host ""
    
    # Create jobs for parallel execution
    $jobs = @()
    
    for ($i = 1; $i -le $TOTAL_SHARDS; $i++) {
        $env:SHARD_INDEX = $i.ToString()
        $env:TOTAL_SHARDS = $TOTAL_SHARDS
        $env:WORKERS = $WORKERS
        $env:HEADED = $HEADED
        $env:TAGS = $TAGS
        
        $job = Start-Job -ScriptBlock {
            param($shardIndex, $totalShards, $workers, $headed, $tags)
            $env:SHARD_INDEX = $shardIndex
            $env:TOTAL_SHARDS = $totalShards
            $env:WORKERS = $workers
            $env:HEADED = $headed
            $env:TAGS = $tags
            node bdd-sharding.config.js
        } -ArgumentList $i, $TOTAL_SHARDS, $WORKERS, $HEADED, $TAGS
        
        $jobs += $job
        Write-Host "Started BDD Shard $i/$TOTAL_SHARDS" -ForegroundColor Green
    }
    
    # Wait for all jobs to complete
    Write-Host ""
    Write-Host "Waiting for all shards to complete..." -ForegroundColor Yellow
    
    $completedJobs = 0
    $totalJobs = $jobs.Count
    
    while ($completedJobs -lt $totalJobs) {
        $completedJobs = ($jobs | Where-Object { $_.State -eq "Completed" }).Count
        $runningJobs = ($jobs | Where-Object { $_.State -eq "Running" }).Count
        
        Write-Progress -Activity "BDD Test Sharding" -Status "Completed: $completedJobs/$totalJobs, Running: $runningJobs" -PercentComplete (($completedJobs / $totalJobs) * 100)
        Start-Sleep -Seconds 2
    }
    
    # Check results
    $failedJobs = 0
    foreach ($job in $jobs) {
        $result = Receive-Job -Job $job
        if ($job.State -eq "Failed" -or $LASTEXITCODE -ne 0) {
            Write-Host "BDD Shard failed" -ForegroundColor Red
            $failedJobs++
        } else {
            Write-Host "BDD Shard completed successfully" -ForegroundColor Green
        }
        Remove-Job -Job $job
    }
    
    if ($failedJobs -gt 0) {
        Write-Host "$failedJobs BDD shard(s) failed" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "All BDD shards completed successfully" -ForegroundColor Green
    }
    
} else {
    Write-Host "Running BDD shards sequentially..." -ForegroundColor Yellow
    Write-Host ""
    
    $failedShards = 0
    
    for ($i = 1; $i -le $TOTAL_SHARDS; $i++) {
        Write-Host "Running BDD Shard $i/$TOTAL_SHARDS..." -ForegroundColor Cyan
        
        $env:SHARD_INDEX = $i.ToString()
        $env:TOTAL_SHARDS = $TOTAL_SHARDS
        $env:WORKERS = $WORKERS
        $env:HEADED = $HEADED
        $env:TAGS = $TAGS
        
        $result = node bdd-sharding.config.js
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "BDD Shard $i failed" -ForegroundColor Red
            $failedShards++
        } else {
            Write-Host "BDD Shard $i completed successfully" -ForegroundColor Green
        }
        
        Write-Host ""
    }
    
    if ($failedShards -gt 0) {
        Write-Host "$failedShards BDD shard(s) failed" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "All BDD shards completed successfully" -ForegroundColor Green
        Write-Host "Merging reports..." -ForegroundColor Yellow
        npm run merge:bdd:reports
    }
}

Write-Host ""
Write-Host "BDD Test Sharding Execution Complete" -ForegroundColor Green
Write-Host "Check reports/ folder for results" -ForegroundColor Cyan 