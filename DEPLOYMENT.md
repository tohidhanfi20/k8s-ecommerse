# 🚀 E-commerce Application Deployment Guide

## 📋 Overview

This guide covers two deployment scenarios:
1. **Local Development** - Run the app locally without Kubernetes
2. **Production Deployment** - Deploy to server with Kubernetes

## 🏠 Local Development

### Environment Variables Setup
Create a `.env.local` file in the `ecommerce-app` directory with:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Configuration
# Get these from: https://console.developers.google.com/
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Setting up Google OAuth

1. **Go to Google Cloud Console**: https://console.developers.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for local development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
5. **Copy the Client ID and Client Secret** to your `.env.local` file

# Application Configuration
NODE_ENV=development
```

### Option 1: Docker Compose (Recommended)
```bash
# Start all services with Docker Compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f ecommerce-app
```

### Option 2: Local Script
```bash
# Make script executable
chmod +x scripts/local-dev.sh

# Run local development setup
./scripts/local-dev.sh
```

### Access (Docker Compose)
- **Application**: http://localhost:3000
- **Grafana**: http://localhost:3001 (admin/admin123)
- **Prometheus**: http://localhost:9090
- **MongoDB**: mongodb://localhost:27017/ecommerce

### Access (Local Script)
- **Application**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017/ecommerce

### Docker Compose Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart ecommerce-app

# Rebuild and start
docker-compose up --build -d
```

## 🖥️ Production Deployment (Server)

### Prerequisites
- Ubuntu 20.04+ server
- t2.medium instance or better
- Root access

### Step 1: Clone Repository
```bash
# Clone the repository
git clone https://github.com/tohidhanfi20/k8s-ecommerse.git
cd k8s-ecommerse

# Make script executable
chmod +x scripts/instance-setup.sh
```

### Step 2: Setup Server
```bash
# Run instance setup (as root)
sudo ./scripts/instance-setup.sh
```

### What it does:
- Updates system packages
- Installs Docker, kubectl, kubeadm, kustomize
- Optimizes system for Kubernetes
- Initializes Kubernetes cluster
- Installs Flannel CNI
- Installs metrics server

### Step 3: Build and Push Docker Image
```bash
# Build the image
docker build -t tohidazure/k8s-ecommerce:latest .

# Login to Docker Hub
docker login

# Push the image
docker push tohidazure/k8s-ecommerce:latest
```

### Step 4: Update Image in Kubernetes Manifests
```bash
# Update the image in ecommerce deployment
sed -i 's|tohidazure/k8s-ecommerce:latest|tohidazure/k8s-ecommerce:latest|g' k8s/base/ecommerce-deployment.yaml
```

### Step 5: Deploy Application
```bash
# Make sure you're in the project directory
cd k8s-ecommerse

# Step 1: Create namespace and base configuration
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/base/configmap.yaml

# Step 2: Deploy MongoDB first (database dependency)
kubectl apply -f k8s/base/mongodb-simple.yaml

# Step 3: Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n ecommerce --timeout=600s

# Step 4: Deploy e-commerce application
kubectl apply -f k8s/base/ecommerce-deployment.yaml

# Step 5: Deploy monitoring services
kubectl apply -f monitoring/grafana-deployment.yaml
kubectl apply -f monitoring/grafana-dashboard-config.yaml
kubectl apply -f monitoring/prometheus-deployment.yaml

# Step 6: Deploy metrics server (required for HPA)
kubectl apply -f k8s/base/metrics-server-simple.yaml

# Step 7: Deploy HPA (after app and metrics server are running)
kubectl apply -f k8s/base/hpa.yaml

# Step 8: Deploy NodePort services for external access
kubectl apply -f k8s/base/nodeport-services.yaml

# Step 9: Check deployment status
kubectl get pods -n ecommerce

# Step 10: Wait for e-commerce app to be ready
kubectl wait --for=condition=ready pod -l app=ecommerce-app -n ecommerce --timeout=300s
```

### Step 6: Access Application

#### Option 1: Port Forward (Local Access)
```bash
# Port forward to access the app
kubectl port-forward -n ecommerce svc/ecommerce-service 3000:3000

# Access at: http://localhost:3000
```

#### Option 2: NodePort (External Access)
```bash
# NodePort services are already deployed in Step 7 above
# Get NodePort numbers (auto-assigned by Kubernetes)
kubectl get services -n ecommerce

# Alternative: Get only NodePort services with their assigned ports
kubectl get services -n ecommerce -o custom-columns="NAME:.metadata.name,TYPE:.spec.type,NODEPORT:.spec.ports[*].nodePort" | grep NodePort

# Access via: http://YOUR_INSTANCE_IP:NODEPORT
# E-commerce: http://YOUR_INSTANCE_IP:<AUTO_ASSIGNED_PORT>
# Grafana: http://YOUR_INSTANCE_IP:<AUTO_ASSIGNED_PORT> (admin/admin123)
# Prometheus: http://YOUR_INSTANCE_IP:<AUTO_ASSIGNED_PORT>
# MongoDB: mongodb://YOUR_INSTANCE_IP:<AUTO_ASSIGNED_PORT>/ecommerce
# Note: NodePorts are auto-assigned by Kubernetes (range: 30000-32767)
```

### Step 7: Verify Everything is Working
```bash
# Check all resources
kubectl get all -n ecommerce

# Check pod status
kubectl get pods -n ecommerce

# Check services and their NodePorts
kubectl get services -n ecommerce

# Check pod logs if needed
kubectl logs -n ecommerce -l app=ecommerce-app
kubectl logs -n ecommerce -l app=mongodb

# Check resource usage
kubectl top pods -n ecommerce
```

### Alternative: One-Command Deployment
```bash
# Make sure you're in the project directory
cd k8s-ecommerse

# Deploy everything in correct sequence with one command
kubectl apply -f k8s/base/namespace.yaml && \
kubectl apply -f k8s/base/configmap.yaml && \
kubectl apply -f k8s/base/mongodb-simple.yaml && \
kubectl wait --for=condition=ready pod -l app=mongodb -n ecommerce --timeout=600s && \
kubectl apply -f k8s/base/ecommerce-deployment.yaml && \
kubectl apply -f monitoring/grafana-deployment.yaml && \
kubectl apply -f monitoring/grafana-dashboard-config.yaml && \
kubectl apply -f monitoring/prometheus-deployment.yaml && \
kubectl apply -f k8s/base/metrics-server-simple.yaml && \
kubectl apply -f k8s/base/hpa.yaml && \
kubectl apply -f k8s/base/nodeport-services.yaml && \
echo "Deployment completed! Check status with: kubectl get pods -n ecommerce"
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Containerd CRI Error
```bash
# If you get "container runtime is not running" error
sudo systemctl stop containerd
sudo mkdir -p /etc/containerd
sudo containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml
sudo systemctl restart containerd
sudo systemctl enable containerd
```

#### 2. MongoDB OOMKilled
```bash
# If MongoDB keeps crashing due to memory
kubectl delete deployment mongodb -n ecommerce
kubectl apply -f k8s/base/mongodb-deployment.yaml
```

#### 3. Grafana Port Conflict
```bash
# Grafana is configured to use port 3001 to avoid conflict with e-commerce app
# If Grafana still uses port 3000, restart the deployment
kubectl rollout restart deployment/grafana -n ecommerce
```

#### 4. MongoDB Metrics Not Showing in Prometheus
```bash
# Check if MongoDB exporter is running
kubectl get pods -n ecommerce -l app=mongodb

# Check MongoDB exporter logs
kubectl logs -n ecommerce -l app=mongodb -c mongodb-exporter

# Verify MongoDB exporter is accessible
kubectl port-forward -n ecommerce svc/mongodb-service 9216:9216
# Then visit: http://localhost:9216/metrics

# Restart MongoDB deployment if needed
kubectl rollout restart deployment/mongodb -n ecommerce
```

#### 5. Metrics Server Issues
```bash
# If metrics server fails, delete and reapply the local version
kubectl delete -f k8s/base/metrics-server.yaml
kubectl apply -f k8s/base/metrics-server.yaml

# Check metrics server logs
kubectl logs -n kube-system -l k8s-app=metrics-server

# Verify metrics server is working
kubectl top nodes
kubectl top pods -n ecommerce

# If still failing, check if the pod is running
kubectl get pods -n kube-system -l k8s-app=metrics-server
```

## 🔧 Configuration

### Environment Variables
- `NEXTAUTH_URL`: Authentication callback URL
- `NEXTAUTH_SECRET`: JWT secret key
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)

### Resource Limits (t2.medium optimized)
- **E-commerce App**: 128Mi-256Mi memory, 50m-200m CPU
- **MongoDB**: 256Mi-512Mi memory, 100m-300m CPU
- **Prometheus**: 128Mi-256Mi memory, 50m-200m CPU
- **Grafana**: 64Mi-128Mi memory, 50m-100m CPU

## 📊 Monitoring

### Access Monitoring
```bash
# Grafana
kubectl port-forward -n ecommerce svc/grafana-service 3001:3001
# Access: http://localhost:3001 (admin/admin123)
# Dashboard: "E-commerce Application Dashboard" (auto-provisioned)

# Prometheus
kubectl port-forward -n ecommerce svc/prometheus-service 9090:9090
# Access: http://localhost:9090
```

## 🔄 Scaling

### Horizontal Pod Autoscaler
The app automatically scales based on CPU and memory usage:
- **Min replicas**: 1
- **Max replicas**: 2
- **CPU threshold**: 80%
- **Memory threshold**: 85%

### Manual Scaling
```bash
# Scale ecommerce app
kubectl scale deployment ecommerce-app --replicas=2 -n ecommerce

# Check scaling
kubectl get hpa -n ecommerce
```

## 🛠️ Troubleshooting

### Common Issues

1. **Pods not starting**
   ```bash
   kubectl describe pod <pod-name> -n ecommerce
   kubectl logs <pod-name> -n ecommerce
   ```

2. **Database connection issues**
   ```bash
   kubectl get pods -n ecommerce
   kubectl exec -it <mongodb-pod> -n ecommerce -- mongosh
   ```

3. **Resource issues**
   ```bash
   kubectl top pods -n ecommerce
   kubectl top nodes
   ```

### Health Checks
- **Liveness Probe**: `/api/health`
- **Readiness Probe**: `/api/health`
- **Startup Probe**: `/api/health`

## 🔐 Authentication System

### Dummy Authentication
The application uses a simple dummy authentication system that accepts any email and password combination:

**Test Credentials:**
- **Email**: `test@example.com`
- **Password**: `password123`
- **Or use ANY email/password combination**

### Authentication Flow
1. Visit `/profile` page
2. Click "SignIn" button
3. Fill in any email and password
4. Click "Sign In"
5. Redirected to profile page with user information

### Features
- ✅ Simple sign-in form
- ✅ User profile display with avatar
- ✅ Session management
- ✅ Sign-out functionality
- ✅ No external OAuth dependencies

## 🔒 Security

### Network Security
- Flannel CNI for pod networking
- Firewall rules configured
- Non-root containers

### Access Control
- RBAC enabled
- Secrets management
- Network policies

## 📈 Performance

### Optimizations
- Multi-stage Docker build
- Node.js production mode
- MongoDB connection pooling
- Resource limits configured

### Monitoring
- Prometheus metrics collection
- Grafana dashboards
- Health check endpoints

## 🆘 Support

### Logs
```bash
# Application logs
kubectl logs -n ecommerce -l app=ecommerce-app

# MongoDB logs
kubectl logs -n ecommerce -l app=mongodb

# System logs
kubectl logs -n ecommerce -l app=prometheus
```

### Status Check
```bash
# Overall status
kubectl get all -n ecommerce

# Resource usage
kubectl top pods -n ecommerce
kubectl top nodes

# Events
kubectl get events -n ecommerce --sort-by='.lastTimestamp'
```

---

**Built with ❤️ using Next.js, Kubernetes, and Docker**
