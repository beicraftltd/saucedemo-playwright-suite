@echo off
echo 🚀 Starting TDD Test Sharding Execution
echo.

REM Set default values
set TOTAL_SHARDS=3
set WORKERS=2
set HEADED=false
set TAGS=

REM Check if environment variables are set
if defined TOTAL_SHARDS (
    echo 📊 Total Shards: %TOTAL_SHARDS%
) else (
    echo 📊 Total Shards: %TOTAL_SHARDS% (default)
)

if defined WORKERS (
    echo ⚡ Workers: %WORKERS%
) else (
    echo ⚡ Workers: %WORKERS% (default)
)

if defined HEADED (
    echo 👁️  Headed: %HEADED%
) else (
    echo 👁️  Headed: %HEADED% (default)
)

if defined TAGS (
    echo 🏷️  Tags: %TAGS%
) else (
    echo 🏷️  Tags: %TAGS% (default)
)

echo.

REM Check if parallel execution is requested
if "%1"=="parallel" (
    echo 🔄 Running TDD shards in parallel...
    echo.
    
    start "TDD Shard 1" cmd /c "set SHARD_INDEX=1 && set TOTAL_SHARDS=%TOTAL_SHARDS% && set WORKERS=%WORKERS% && set HEADED=%HEADED% && set TAGS=%TAGS% && node tdd-sharding.config.js"
    start "TDD Shard 2" cmd /c "set SHARD_INDEX=2 && set TOTAL_SHARDS=%TOTAL_SHARDS% && set WORKERS=%WORKERS% && set HEADED=%HEADED% && set TAGS=%TAGS% && node tdd-sharding.config.js"
    start "TDD Shard 3" cmd /c "set SHARD_INDEX=3 && set TOTAL_SHARDS=%TOTAL_SHARDS% && set WORKERS=%WORKERS% && set HEADED=%HEADED% && set TAGS=%TAGS% && node tdd-sharding.config.js"
    
    echo ✅ All TDD shards started in parallel
    echo 📋 Check individual command windows for progress
    echo 📊 Reports will be generated in reports/ folder
    
) else (
    echo 🔄 Running TDD shards sequentially...
    echo.
    
    echo 📋 Running TDD Shard 1/3...
    set SHARD_INDEX=1
    node tdd-sharding.config.js
    if errorlevel 1 (
        echo ❌ TDD Shard 1 failed
        exit /b 1
    )
    
    echo 📋 Running TDD Shard 2/3...
    set SHARD_INDEX=2
    node tdd-sharding.config.js
    if errorlevel 1 (
        echo ❌ TDD Shard 2 failed
        exit /b 1
    )
    
    echo 📋 Running TDD Shard 3/3...
    set SHARD_INDEX=3
    node tdd-sharding.config.js
    if errorlevel 1 (
        echo ❌ TDD Shard 3 failed
        exit /b 1
    )
    
    echo ✅ All TDD shards completed successfully
    echo 📊 Merging reports...
    call npm run merge:tdd:reports
)

echo.
echo 🎉 TDD Test Sharding Execution Complete
echo 📁 Check reports/ folder for results 