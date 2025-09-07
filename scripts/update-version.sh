#!/bin/bash

# 🏷️ Version Update Script for Ecommerce Application
# This script helps update image versions in Kubernetes manifests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}[VERSION UPDATE]${NC} $1"
}

# Configuration
DOCKER_USERNAME="your-dockerhub-username"
BASE_IMAGE="dashing-ecommerce"

# Function to update version in kustomization file
update_kustomization() {
    local env=$1
    local version=$2
    local file="k8s/overlays/$env/kustomization.yaml"
    
    if [ ! -f "$file" ]; then
        print_error "Kustomization file not found: $file"
        return 1
    fi
    
    print_status "Updating $env environment to version $version"
    
    # Update the image tag
    sed -i.bak "s/newTag: .*/newTag: $version/" "$file"
    sed -i.bak "s/newName: .*/newName: $DOCKER_USERNAME\/$BASE_IMAGE/" "$file"
    
    # Remove backup file
    rm "$file.bak"
    
    print_status "Updated $file with version $version"
}

# Function to update canary deployment
update_canary_deployment() {
    local version=$1
    local file="k8s/overlays/canary/ecommerce-canary-deployment.yaml"
    
    if [ ! -f "$file" ]; then
        print_error "Canary deployment file not found: $file"
        return 1
    fi
    
    print_status "Updating canary deployment to version $version"
    
    # Update the image tag
    sed -i.bak "s|image: .*|image: $DOCKER_USERNAME/$BASE_IMAGE:$version|" "$file"
    sed -i.bak "s/value: \".*\"/value: \"$version\"/" "$file"
    
    # Remove backup file
    rm "$file.bak"
    
    print_status "Updated $file with version $version"
}

# Function to show current versions
show_versions() {
    print_header "Current Versions"
    echo
    
    echo "Production:"
    grep "newTag:" k8s/overlays/production/kustomization.yaml || echo "  Not found"
    echo
    
    echo "Staging:"
    grep "newTag:" k8s/overlays/staging/kustomization.yaml || echo "  Not found"
    echo
    
    echo "Canary:"
    grep "newTag:" k8s/overlays/canary/kustomization.yaml || echo "  Not found"
    echo
    
    echo "Canary Deployment:"
    grep "image:" k8s/overlays/canary/ecommerce-canary-deployment.yaml || echo "  Not found"
}

# Function to validate version format
validate_version() {
    local version=$1
    
    # Check if version follows semantic versioning
    if [[ ! $version =~ ^v?[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?$ ]]; then
        print_warning "Version format should be: v1.0.0 or v1.0.0-staging or v1.0.0-canary"
        print_warning "Proceeding anyway..."
    fi
}

# Main script logic
case "$1" in
    "show")
        show_versions
        ;;
    "production")
        if [ -z "$2" ]; then
            print_error "Please provide version number"
            echo "Usage: $0 production v1.0.0"
            exit 1
        fi
        validate_version "$2"
        update_kustomization "production" "$2"
        print_status "Production version updated to $2"
        ;;
    "staging")
        if [ -z "$2" ]; then
            print_error "Please provide version number"
            echo "Usage: $0 staging v1.0.0-staging"
            exit 1
        fi
        validate_version "$2"
        update_kustomization "staging" "$2"
        print_status "Staging version updated to $2"
        ;;
    "canary")
        if [ -z "$2" ]; then
            print_error "Please provide version number"
            echo "Usage: $0 canary v1.1.0-canary"
            exit 1
        fi
        validate_version "$2"
        update_kustomization "canary" "$2"
        update_canary_deployment "$2"
        print_status "Canary version updated to $2"
        ;;
    "all")
        if [ -z "$2" ]; then
            print_error "Please provide version number"
            echo "Usage: $0 all v1.0.0"
            exit 1
        fi
        validate_version "$2"
        update_kustomization "production" "$2"
        update_kustomization "staging" "$2-staging"
        update_kustomization "canary" "$2-canary"
        update_canary_deployment "$2-canary"
        print_status "All environments updated to version $2"
        ;;
    *)
        echo "Usage: $0 {show|production|staging|canary|all} [version]"
        echo ""
        echo "Commands:"
        echo "  show                    - Show current versions"
        echo "  production <version>    - Update production version"
        echo "  staging <version>       - Update staging version"
        echo "  canary <version>        - Update canary version"
        echo "  all <version>           - Update all environments"
        echo ""
        echo "Examples:"
        echo "  $0 show"
        echo "  $0 production v1.0.0"
        echo "  $0 staging v1.0.0-staging"
        echo "  $0 canary v1.1.0-canary"
        echo "  $0 all v1.0.0"
        exit 1
        ;;
esac
