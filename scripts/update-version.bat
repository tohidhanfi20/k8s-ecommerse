@echo off
REM 🏷️ Version Update Script for Ecommerce Application (Windows)
REM This script helps update image versions in Kubernetes manifests

setlocal enabledelayedexpansion

REM Colors (Windows doesn't support colors in batch, but we can use echo)
set "INFO=[INFO]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"
set "HEADER=[VERSION UPDATE]"

REM Configuration
set "DOCKER_USERNAME=your-dockerhub-username"
set "BASE_IMAGE=dashing-ecommerce"

REM Function to print status
:print_status
echo %INFO% %~1
goto :eof

:print_warning
echo %WARNING% %~1
goto :eof

:print_error
echo %ERROR% %~1
goto :eof

:print_header
echo %HEADER% %~1
goto :eof

REM Function to update kustomization file
:update_kustomization
set env=%~1
set version=%~2
set file=k8s\overlays\%env%\kustomization.yaml

if not exist "%file%" (
    call :print_error "Kustomization file not found: %file%"
    exit /b 1
)

call :print_status "Updating %env% environment to version %version%"

REM Update the image tag using PowerShell
powershell -Command "(Get-Content '%file%') -replace 'newTag: .*', 'newTag: %version%' | Set-Content '%file%'"
powershell -Command "(Get-Content '%file%') -replace 'newName: .*', 'newName: %DOCKER_USERNAME%/%BASE_IMAGE%' | Set-Content '%file%'"

call :print_status "Updated %file% with version %version%"
goto :eof

REM Function to update canary deployment
:update_canary_deployment
set version=%~1
set file=k8s\overlays\canary\ecommerce-canary-deployment.yaml

if not exist "%file%" (
    call :print_error "Canary deployment file not found: %file%"
    exit /b 1
)

call :print_status "Updating canary deployment to version %version%"

REM Update the image tag using PowerShell
powershell -Command "(Get-Content '%file%') -replace 'image: .*', 'image: %DOCKER_USERNAME%/%BASE_IMAGE%:%version%' | Set-Content '%file%'"
powershell -Command "(Get-Content '%file%') -replace 'value: \".*\"', 'value: \"%version%\"' | Set-Content '%file%'"

call :print_status "Updated %file% with version %version%"
goto :eof

REM Function to show current versions
:show_versions
call :print_header "Current Versions"
echo.

echo Production:
findstr "newTag:" k8s\overlays\production\kustomization.yaml 2>nul || echo   Not found
echo.

echo Staging:
findstr "newTag:" k8s\overlays\staging\kustomization.yaml 2>nul || echo   Not found
echo.

echo Canary:
findstr "newTag:" k8s\overlays\canary\kustomization.yaml 2>nul || echo   Not found
echo.

echo Canary Deployment:
findstr "image:" k8s\overlays\canary\ecommerce-canary-deployment.yaml 2>nul || echo   Not found
goto :eof

REM Main script logic
if "%1"=="show" goto :show
if "%1"=="production" goto :production
if "%1"=="staging" goto :staging
if "%1"=="canary" goto :canary
if "%1"=="all" goto :all
goto :usage

:show
call :show_versions
goto :eof

:production
if "%2"=="" (
    call :print_error "Please provide version number"
    echo Usage: %0 production v1.0.0
    exit /b 1
)
call :update_kustomization "production" "%2"
call :print_status "Production version updated to %2"
goto :eof

:staging
if "%2"=="" (
    call :print_error "Please provide version number"
    echo Usage: %0 staging v1.0.0-staging
    exit /b 1
)
call :update_kustomization "staging" "%2"
call :print_status "Staging version updated to %2"
goto :eof

:canary
if "%2"=="" (
    call :print_error "Please provide version number"
    echo Usage: %0 canary v1.1.0-canary
    exit /b 1
)
call :update_kustomization "canary" "%2"
call :update_canary_deployment "%2"
call :print_status "Canary version updated to %2"
goto :eof

:all
if "%2"=="" (
    call :print_error "Please provide version number"
    echo Usage: %0 all v1.0.0
    exit /b 1
)
call :update_kustomization "production" "%2"
call :update_kustomization "staging" "%2-staging"
call :update_kustomization "canary" "%2-canary"
call :update_canary_deployment "%2-canary"
call :print_status "All environments updated to version %2"
goto :eof

:usage
echo Usage: %0 {show^|production^|staging^|canary^|all} [version]
echo.
echo Commands:
echo   show                    - Show current versions
echo   production ^<version^>    - Update production version
echo   staging ^<version^>       - Update staging version
echo   canary ^<version^>        - Update canary version
echo   all ^<version^>           - Update all environments
echo.
echo Examples:
echo   %0 show
echo   %0 production v1.0.0
echo   %0 staging v1.0.0-staging
echo   %0 canary v1.1.0-canary
echo   %0 all v1.0.0
exit /b 1
