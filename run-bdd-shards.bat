@echo off
echo 🚀 Starting BDD Test Sharding Execution
echo.

REM Set default values
set TOTAL_SHARDS=4
set WORKERS=2
set HEADED=false
set TAGS=not @wip

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
    echo 🔄 Running BDD shards in parallel...
    echo.
    
    start "BDD Shard 1" cmd /c "set SHARD_INDEX=1 && set TOTAL_SHARDS=%TOTAL_SHARDS% && set WORKERS=%WORKERS% && set HEADED=%HEADED% && set TAGS=%TAGS% && node bdd-sharding.config.js"
    start "BDD Shard 2" cmd /c "set SHARD_INDEX=2 && set TOTAL_SHARDS=%TOTAL_SHARDS% && set WORKERS=%WORKERS% && set HEADED=%HEADED% && set TAGS=%TAGS% && node bdd-sharding.config.js"
    start "BDD Shard 3" cmd /c "set SHARD_INDEX=3 && set TOTAL_SHARDS=%TOTAL_SHARDS% && set WORKERS=%WORKERS% && set HEADED=%HEADED% && set TAGS=%TAGS% && node bdd-sharding.config.js"
    start "BDD Shard 4" cmd /c "set SHARD_INDEX=4 && set TOTAL_SHARDS=%TOTAL_SHARDS% && set WORKERS=%WORKERS% && set HEADED=%HEADED% && set TAGS=%TAGS% && node bdd-sharding.config.js"
    
    echo ✅ All BDD shards started in parallel
    echo 📋 Check individual command windows for progress
    echo 📊 Reports will be generated in reports/ folder
    
) else (
    echo 🔄 Running BDD shards sequentially...
    echo.
    
    echo 📋 Running BDD Shard 1/4...
    set SHARD_INDEX=1
    node bdd-sharding.config.js
    if errorlevel 1 (
        echo ❌ BDD Shard 1 failed
        exit /b 1
    )
    
    echo 📋 Running BDD Shard 2/4...
    set SHARD_INDEX=2
    node bdd-sharding.config.js
    if errorlevel 1 (
        echo ❌ BDD Shard 2 failed
        exit /b 1
    )
    
    echo 📋 Running BDD Shard 3/4...
    set SHARD_INDEX=3
    node bdd-sharding.config.js
    if errorlevel 1 (
        echo ❌ BDD Shard 3 failed
        exit /b 1
    )
    
    echo 📋 Running BDD Shard 4/4...
    set SHARD_INDEX=4
    node bdd-sharding.config.js
    if errorlevel 1 (
        echo ❌ BDD Shard 4 failed
        exit /b 1
    )
    
    echo ✅ All BDD shards completed successfully
    echo 📊 Merging reports...
    call npm run merge:bdd:reports
)

echo.
echo 🎉 BDD Test Sharding Execution Complete
echo 📁 Check reports/ folder for results 