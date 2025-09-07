@echo off
REM Ecommerce Kubernetes Deployment Script for Windows

setlocal enabledelayedexpansion

REM Colors (Windows doesn't support colors in batch, but we can use echo)
set "INFO=[INFO]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"

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

REM Check if kubectl is installed
kubectl version --client >nul 2>&1
if errorlevel 1 (
    call :print_error "kubectl is not installed. Please install kubectl first."
    exit /b 1
)

REM Check if kustomize is installed
kustomize version >nul 2>&1
if errorlevel 1 (
    call :print_warning "kustomize is not installed. Please install kustomize first."
    call :print_warning "Download from: https://github.com/kubernetes-sigs/kustomize/releases"
    exit /b 1
)

REM Main script logic
if "%1"=="build" goto :build
if "%1"=="deploy-staging" goto :deploy_staging
if "%1"=="deploy-production" goto :deploy_production
if "%1"=="status" goto :status
if "%1"=="cleanup" goto :cleanup
goto :usage

:build
call :print_status "Building Docker image..."
docker build -t dashing-ecommerce:latest .
if errorlevel 1 (
    call :print_error "Docker build failed!"
    exit /b 1
)
call :print_status "Docker image built successfully!"
goto :eof

:deploy_staging
call :build
call :deploy_to_env "staging"
call :check_status "staging"
goto :eof

:deploy_production
call :build
call :deploy_to_env "production"
call :check_status "production"
goto :eof

:deploy_to_env
set env=%~1
call :print_status "Deploying to %env% environment..."

call :print_status "Applying base resources..."
kustomize build k8s/base | kubectl apply -f -
if errorlevel 1 (
    call :print_error "Failed to apply base resources!"
    exit /b 1
)

call :print_status "Applying %env%-specific resources..."
kustomize build k8s/overlays/%env% | kubectl apply -f -
if errorlevel 1 (
    call :print_error "Failed to apply %env% resources!"
    exit /b 1
)

call :print_status "Applying Istio service mesh configuration..."
kubectl apply -f k8s/istio/
if errorlevel 1 (
    call :print_warning "Failed to apply Istio resources (Istio might not be installed)"
)

call :print_status "Applying monitoring stack..."
kubectl apply -f monitoring/
if errorlevel 1 (
    call :print_warning "Failed to apply monitoring resources"
)

call :print_status "Deployment to %env% completed!"
goto :eof

:check_status
set env=%~1
call :print_status "Checking deployment status for %env%..."
echo.
echo Pods:
kubectl get pods -n ecommerce
echo.
echo Services:
kubectl get services -n ecommerce
echo.
echo Ingress:
kubectl get ingress -n ecommerce
goto :eof

:status
call :check_status "production"
goto :eof

:cleanup
call :print_status "Cleaning up resources..."
kubectl delete namespace ecommerce --ignore-not-found=true
kubectl delete namespace ecommerce-staging --ignore-not-found=true
call :print_status "Cleanup completed!"
goto :eof

:usage
echo Usage: %0 {build^|deploy-staging^|deploy-production^|status^|cleanup}
echo.
echo Commands:
echo   build              - Build Docker image
echo   deploy-staging     - Deploy to staging environment
echo   deploy-production  - Deploy to production environment
echo   status             - Check deployment status
echo   cleanup            - Clean up all resources
exit /b 1
