#!/bin/bash

# Comprehensive Monitoring Deployment Script
# This script deploys a complete monitoring stack with proper metrics collection

set -e

echo "🚀 Deploying Comprehensive Monitoring Stack..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed or not in PATH"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster"
    exit 1
fi

print_status "Connected to Kubernetes cluster"

# Create namespace if it doesn't exist
print_status "Creating ecommerce namespace..."
kubectl create namespace ecommerce --dry-run=client -o yaml | kubectl apply -f -

# Deploy MongoDB with proper exporter
print_status "Deploying MongoDB with metrics exporter..."
kubectl apply -f k8s/base/mongodb-exporter-fixed.yaml

# Wait for MongoDB to be ready
print_status "Waiting for MongoDB to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mongodb -n ecommerce

# Deploy e-commerce application
print_status "Deploying e-commerce application..."
kubectl apply -f k8s/base/ecommerce-deployment.yaml

# Wait for e-commerce app to be ready
print_status "Waiting for e-commerce application to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/ecommerce-app -n ecommerce

# Deploy metrics server
print_status "Deploying metrics server..."
kubectl apply -f k8s/base/metrics-server-simple.yaml

# Wait for metrics server to be ready
print_status "Waiting for metrics server to be ready..."
kubectl wait --for=condition=available --timeout=600s deployment/metrics-server -n kube-system

# Deploy HPA
print_status "Deploying HPA..."
kubectl apply -f k8s/base/hpa.yaml

# Deploy NodePort services for external access
print_status "Deploying NodePort services for external access..."
kubectl apply -f k8s/base/nodeport-services.yaml

# Deploy monitoring AFTER all services are running
print_status "Deploying monitoring stack..."
kubectl apply -f k8s/base/prometheus-enhanced.yaml

# Wait for Prometheus to be ready
print_status "Waiting for Prometheus to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/prometheus -n ecommerce

# Deploy Grafana with dashboard
print_status "Deploying Grafana with comprehensive dashboard..."
kubectl apply -f monitoring/grafana-deployment.yaml

# Wait for Grafana to be ready
print_status "Waiting for Grafana to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/grafana -n ecommerce

# Get service URLs
print_status "Getting service access URLs..."

# Get NodePort for Grafana
GRAFANA_NODEPORT=$(kubectl get service grafana-nodeport -n ecommerce -o jsonpath='{.spec.ports[0].nodePort}')
GRAFANA_URL="http://$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}'):${GRAFANA_NODEPORT}"

# Get NodePort for Prometheus
PROMETHEUS_NODEPORT=$(kubectl get service prometheus-nodeport -n ecommerce -o jsonpath='{.spec.ports[0].nodePort}')
PROMETHEUS_URL="http://$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}'):${PROMETHEUS_NODEPORT}"

# Get NodePort for E-commerce app
ECOMMERCE_NODEPORT=$(kubectl get service ecommerce-nodeport -n ecommerce -o jsonpath='{.spec.ports[0].nodePort}')
ECOMMERCE_URL="http://$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="ExternalIP")].address}'):${ECOMMERCE_NODEPORT}"

print_success "🎉 Monitoring stack deployed successfully!"
echo ""
echo "📊 Access URLs:"
echo "  Grafana Dashboard: ${GRAFANA_URL}"
echo "  Prometheus: ${PROMETHEUS_URL}"
echo "  E-commerce App: ${ECOMMERCE_URL}"
echo ""
echo "🔐 Default Grafana credentials:"
echo "  Username: admin"
echo "  Password: admin"
echo ""
echo "📈 Available Dashboards:"
echo "  - E-commerce Application - Comprehensive Monitoring"
echo ""
echo "🔍 Key Metrics Available:"
echo "  - Application health and uptime"
echo "  - HTTP request rates and response times"
echo "  - Error rates and status codes"
echo "  - MongoDB connections and operations"
echo "  - Pod CPU and memory usage"
echo "  - Kubernetes pod status"
echo "  - Database size and disk usage"
echo ""
print_status "Monitoring stack is ready! Check the URLs above to access your dashboards."
