#!/bin/bash

# Ecommerce Kubernetes Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if kustomize is installed
if ! command -v kustomize &> /dev/null; then
    print_warning "kustomize is not installed. Installing kustomize..."
    curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
    sudo mv kustomize /usr/local/bin/
fi

# Function to deploy to environment
deploy_to_env() {
    local env=$1
    print_status "Deploying to $env environment..."
    
    # Apply base resources
    print_status "Applying base resources..."
    kustomize build k8s/base | kubectl apply -f -
    
    # Apply environment-specific resources
    print_status "Applying $env-specific resources..."
    kustomize build k8s/overlays/$env | kubectl apply -f -
    
    # Apply Istio resources
    print_status "Applying Istio service mesh configuration..."
    kubectl apply -f k8s/istio/
    
    # Apply monitoring
    print_status "Applying monitoring stack..."
    kubectl apply -f monitoring/
    
    print_status "Deployment to $env completed!"
}

# Function to check deployment status
check_status() {
    local env=$1
    print_status "Checking deployment status for $env..."
    
    kubectl get pods -n ecommerce
    kubectl get services -n ecommerce
    kubectl get ingress -n ecommerce
}

# Function to build Docker image
build_image() {
    print_status "Building Docker image..."
    docker build -t dashing-ecommerce:latest .
    print_status "Docker image built successfully!"
}

# Main script logic
case "$1" in
    "build")
        build_image
        ;;
    "deploy-staging")
        build_image
        deploy_to_env "staging"
        check_status "staging"
        ;;
    "deploy-production")
        build_image
        deploy_to_env "production"
        check_status "production"
        ;;
    "status")
        check_status "production"
        ;;
    "cleanup")
        print_status "Cleaning up resources..."
        kubectl delete namespace ecommerce --ignore-not-found=true
        kubectl delete namespace ecommerce-staging --ignore-not-found=true
        print_status "Cleanup completed!"
        ;;
    *)
        echo "Usage: $0 {build|deploy-staging|deploy-production|status|cleanup}"
        echo ""
        echo "Commands:"
        echo "  build              - Build Docker image"
        echo "  deploy-staging     - Deploy to staging environment"
        echo "  deploy-production  - Deploy to production environment"
        echo "  status             - Check deployment status"
        echo "  cleanup            - Clean up all resources"
        exit 1
        ;;
esac
