# 🛒 K8s E-commerce - Kubernetes Deployment

A modern, scalable e-commerce application built with Next.js, MongoDB, and deployed on Kubernetes with comprehensive monitoring and dummy authentication system.

## 🏗️ Tech Stack

### Frontend & Backend
- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Authentication**: NextAuth.js (Dummy Authentication)
- **Database**: MongoDB 7.0
- **API**: Next.js API Routes

### Infrastructure & DevOps
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (kubeadm)
- **Service Mesh**: Istio (Gateway, Virtual Services, Destination Rules)
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: Docker Hub Integration
- **Networking**: Flannel CNI
- **Auto-scaling**: Horizontal Pod Autoscaler (HPA)

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Next.js Build System
- **Environment**: Node.js 18
- **Version Control**: Git

## 🏗️ Kubernetes Implementation

### Kubernetes Resources Used
- **Deployments**: E-commerce app, MongoDB, Prometheus, Grafana
- **Services**: ClusterIP services for internal communication
- **ConfigMaps**: Environment variables and configuration
- **PersistentVolumeClaims**: Data persistence for MongoDB and Grafana
- **HorizontalPodAutoscaler**: Auto-scaling based on CPU/Memory
- **Namespace**: Isolated `ecommerce` namespace
- **Health Checks**: Liveness, Readiness, and Startup probes

### Service Mesh (Istio)
- **Gateway**: External traffic entry point
- **Virtual Service**: Traffic routing rules
- **Destination Rule**: Load balancing and connection pooling
- **Canary Deployment**: Traffic splitting for gradual rollouts

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           🌐 USER INTERFACE LAYER                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Web Browser   │    │   Mobile App    │    │   API Client    │            │
│  │   (Port 3000)   │    │   (Future)      │    │   (Future)      │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        🚪 INGRESS & SERVICE MESH LAYER                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        Istio Gateway                                   │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │    │
│  │  │   Virtual       │  │   Destination   │  │   Traffic       │        │    │
│  │  │   Service       │  │   Rules         │  │   Splitting     │        │    │
│  │  │   (Routing)     │  │   (Load Bal.)   │  │   (Canary)      │        │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          🏗️ APPLICATION LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    E-commerce Application Pods                        │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │    │
│  │  │   Production    │  │     Staging     │  │     Canary      │        │    │
│  │  │   (90% traffic) │  │   (Testing)     │  │   (10% traffic) │        │    │
│  │  │   Port: 3000    │  │   Port: 3000    │  │   Port: 3000    │        │    │
│  │  │   Resources:    │  │   Resources:    │  │   Resources:    │        │    │
│  │  │   256Mi/200m    │  │   128Mi/100m    │  │   128Mi/100m    │        │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           💾 DATA LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        MongoDB Database                                │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │    │
│  │  │   User Data     │  │   Product Data  │  │   Session Data  │        │    │
│  │  │   (Profiles)    │  │   (Catalog)     │  │   (Auth)        │        │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │    │
│  │  Port: 27017 | Resources: 512Mi/300m | Persistent Storage              │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        📊 MONITORING & OBSERVABILITY LAYER                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  ┌─────────────────┐                    ┌─────────────────┐            │    │
│  │  │   Prometheus    │                    │     Grafana     │            │    │
│  │  │   (Metrics)     │◄──────────────────►│   (Dashboard)   │            │    │
│  │  │   Port: 9090    │                    │   Port: 3001    │            │    │
│  │  │   Resources:    │                    │   Resources:    │            │    │
│  │  │   256Mi/200m    │                    │   128Mi/100m    │            │    │
│  │  └─────────────────┘                    └─────────────────┘            │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           🔧 INFRASTRUCTURE LAYER                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        Kubernetes Cluster                              │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │    │
│  │  │   kubeadm       │  │   Flannel CNI   │  │   Metrics       │        │    │
│  │  │   (Control)     │  │   (Networking)  │  │   Server        │        │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │    │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │    │
│  │  │   HPA           │  │   PVC           │  │   ConfigMaps    │        │    │
│  │  │   (Auto-scale)  │  │   (Storage)     │  │   (Config)      │        │    │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │    │
│  │  Single Node | t2.medium | Ubuntu 20.04+ | Optimized Resources        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 🔄 Application Flow Diagram
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER JOURNEY FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  🌐 User Access                                                                 │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Home      │───►│  Products   │───►│   Cart      │───►│  Checkout   │     │
│  │   Page      │    │   Catalog   │    │   Page      │    │   Process   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Sign In   │───►│   Profile   │───►│   Orders    │───►│   Settings  │     │
│  │   (Dummy)   │    │   Page      │    │   History   │    │   & Logout  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                                                 │
│  🔧 Backend Processing                                                          │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   NextAuth  │───►│   MongoDB   │───►│   API       │───►│   Health    │     │
│  │   (Auth)    │    │   (Data)    │    │   Routes    │    │   Checks    │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                                                 │
│  📊 Monitoring & Observability                                                  │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Prometheus  │───►│   Grafana   │───►│   Alerts    │───►│   Logs      │     │
│  │ (Metrics)   │    │ (Dashboard) │    │ (Errors)    │    │ (Debug)     │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 🚀 Deployment Flow Diagram
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            DEPLOYMENT PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  💻 Local Development                                                           │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Code      │───►│   Docker    │───►│   Test      │───►│   Commit    │     │
│  │   Changes   │    │   Compose   │    │   Locally   │    │   & Push    │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                                                 │
│  🏗️ Instance Setup                                                              │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Clone     │───►│   Setup     │───►│   Build     │───►│   Push      │     │
│  │   Repo      │    │   Script    │    │   Image     │    │   DockerHub │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                                                 │
│  🚀 Kubernetes Deployment                                                       │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Staging   │───►│   Canary    │───►│ Production  │───►│   Monitor   │     │
│  │   Deploy    │    │   Deploy    │    │   Deploy    │    │   & Scale   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│       │                   │                   │                   │           │
│       ▼                   ▼                   ▼                   ▼           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Test      │    │   10%       │    │   90%       │    │   HPA       │     │
│  │   Features  │    │   Traffic   │    │   Traffic   │    │   Auto      │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Ubuntu 20.04+ (recommended)
- Docker
- Kubernetes cluster (kubeadm)
- kubectl
- kustomize
- Docker Hub account (`tohidazure`)

### Setup Installation (Ubuntu)
```bash
# Install all necessary software for Ubuntu
chmod +x scripts/instance-setup.sh
sudo ./scripts/instance-setup.sh

# This will install:
# - Docker & containerd
# - Kubernetes (kubeadm, kubectl, kubelet)
# - Flannel CNI
# - Metrics server
# - System optimizations
```

### Local Development
```bash
# Start all services with Docker Compose
docker-compose up -d

# Access services:
# - E-commerce App: http://localhost:3000
# - Grafana: http://localhost:3001 (admin/admin123)
# - Prometheus: http://localhost:9090
# - MongoDB: localhost:27017

# Or run Next.js directly
cd ecommerce-app
npm install
npm run dev
```

### Docker Hub Integration

#### 1. Build and Push Images (On Instance)
```bash
# Build the application
docker build -t tohidazure/k8s-ecommerce:latest .

# Login to Docker Hub
docker login

# Push to Docker Hub
docker push tohidazure/k8s-ecommerce:latest
```

#### 2. Deploy to Kubernetes
```bash
# Create namespace
kubectl create namespace ecommerce

# Deploy base configuration
kubectl apply -f k8s/base/

# Deploy monitoring
kubectl apply -f monitoring/

# Deploy dashboard configuration
kubectl apply -f monitoring/grafana-dashboard-config.yaml
```

### Kubernetes Deployment

#### 1. Deploy to Staging
```bash
# Deploy staging environment
kubectl apply -k k8s/overlays/staging/

# Check staging deployment
kubectl get pods -n ecommerce
```

#### 2. Deploy to Production
```bash
# Deploy production environment
kubectl apply -k k8s/overlays/production/

# Check production deployment
kubectl get pods -n ecommerce
```

#### 3. Canary Deployment
```bash
# Deploy canary version
kubectl apply -k k8s/overlays/canary/

# Apply canary traffic rules
kubectl apply -f k8s/istio/canary-virtual-service.yaml
kubectl apply -f k8s/istio/canary-destination-rule.yaml

# Check canary deployment
kubectl get pods -n ecommerce
```

#### 4. Verify Deployment
```bash
# Check all pods are running
kubectl get pods -n ecommerce

# Check services
kubectl get services -n ecommerce

# Check if everything is healthy
kubectl get pods -n ecommerce -o wide
```

#### 5. Access Your Application
```bash
# Access e-commerce app
kubectl port-forward -n ecommerce svc/ecommerce-service 3000:3000
# Visit: http://localhost:3000

# Access Grafana dashboard
kubectl port-forward -n ecommerce svc/grafana-service 3001:3001
# Visit: http://localhost:3001 (admin/admin123)
```

## 📁 Project Structure

```
k8s-ecommerce/
├── ecommerce-app/               # Next.js application
│   ├── app/                     # App Router directory
│   │   ├── api/                 # API routes (auth, health)
│   │   ├── auth/                # Authentication pages
│   │   ├── cart/                # Shopping cart
│   │   ├── categories/          # Product categories
│   │   ├── product/             # Product pages
│   │   └── profile/             # User profile
│   ├── components/              # React components
│   │   ├── BannerSlider/        # Homepage banner
│   │   ├── Category/            # Category display
│   │   ├── FeatureProducts/     # Featured products
│   │   ├── Header/              # Navigation header
│   │   └── ProductCards/        # Product cards
│   ├── lib/                     # Database connection
│   └── public/                  # Static assets
├── k8s/                         # Kubernetes manifests
│   ├── base/                    # Base configurations
│   │   ├── ecommerce-deployment.yaml
│   │   ├── mongodb-deployment.yaml
│   │   ├── configmap.yaml
│   │   └── hpa.yaml
│   ├── overlays/                # Environment-specific configs
│   │   ├── production/          # Production settings
│   │   ├── staging/             # Staging settings
│   │   └── canary/              # Canary deployment
│   └── istio/                   # Service mesh config
│       ├── gateway.yaml
│       ├── virtual-service.yaml
│       └── destination-rule.yaml
├── monitoring/                  # Monitoring stack
│   ├── prometheus-deployment.yaml
│   ├── grafana-deployment.yaml
│   ├── grafana-dashboard-config.yaml
│   └── grafana-dashboard.json
├── scripts/                     # Deployment scripts
│   ├── local-dev.sh            # Local development
│   └── instance-setup.sh       # Server setup
├── docker-compose.yml          # Local development
├── Dockerfile                  # Production container
├── Dockerfile.local           # Local development container
├── DEPLOYMENT.md              # Detailed deployment guide
└── README.md                  # This file
```

## 🔧 Configuration

### Environment Variables
- `NEXTAUTH_URL`: Authentication callback URL
- `NEXTAUTH_SECRET`: JWT secret key (auto-generated)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/staging/production)

### Kubernetes Resources
- **Namespace**: `ecommerce` (isolated environment)
- **ConfigMap**: Environment configuration and secrets
- **Deployments**: E-commerce app, MongoDB, Prometheus, Grafana
- **Services**: ClusterIP services for internal communication
- **PVCs**: Persistent storage for MongoDB and Grafana data
- **HPA**: Auto-scaling based on CPU (80%) and Memory (85%)
- **Health Checks**: Liveness, Readiness, and Startup probes

## 📊 Monitoring & Observability

### Prometheus Metrics
- Application performance metrics
- Database connection metrics
- Kubernetes pod metrics
- Custom business metrics

### Grafana Dashboards
- **E-commerce Application Dashboard** (auto-provisioned)
- Application health monitoring
- HTTP request rate and response time
- Error rate tracking (4xx/5xx)
- Active user sessions
- Database connection monitoring

### Access Monitoring
```bash
# Port forward to access Grafana
kubectl port-forward -n ecommerce svc/grafana-service 3001:3001

# Access Grafana at http://localhost:3001
# Username: admin
# Password: admin123
# Dashboard: "E-commerce Application Dashboard"
```

## 🌐 Service Access

| Service | URL | Description |
|---------|-----|-------------|
| E-commerce App | http://localhost:3000 | Main application with dummy auth |
| Grafana | http://localhost:3001 (port-forward) | Monitoring dashboard |
| Prometheus | http://localhost:9090 (port-forward) | Metrics collection |
| MongoDB | localhost:27017 | Database (internal) |

### Authentication
- **Type**: Dummy Authentication (NextAuth.js)
- **Credentials**: Use any email and password
- **Features**: User profile, session management, sign-out

## 🔄 Deployment Strategies

### Local Development
- Docker Compose setup
- Hot reload enabled
- Debug logging
- Local MongoDB instance

### Staging Environment
- 1-2 replicas
- Reduced resources (optimized for testing)
- Debug logging enabled
- Separate MongoDB database
- Testing environment

### Production Environment
- 1-2 replicas (optimized for t2.medium)
- Resource limits: 256Mi memory, 200m CPU
- Production logging
- Persistent storage
- Auto-scaling enabled

### Canary Deployment
- Gradual traffic rollout (10% → 50% → 100%)
- A/B testing capabilities
- Quick rollback if issues detected
- Istio traffic splitting

## 🛡️ Security Features

- **Istio Service Mesh**: Traffic encryption, mTLS
- **Network Policies**: Pod-to-pod communication control
- **RBAC**: Role-based access control
- **Secrets Management**: Secure credential storage
- **Image Security**: Non-root containers
- **Dummy Authentication**: No external OAuth dependencies
- **Health Checks**: Comprehensive application monitoring

## 📈 Scaling

### Horizontal Pod Autoscaler (HPA)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ecommerce-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ecommerce-app
  minReplicas: 1
  maxReplicas: 2
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 85
```

### Resource Optimization
- **Optimized for t2.medium**: Memory and CPU limits configured
- **Efficient scaling**: 1-2 replicas based on load
- **Cost-effective**: Minimal resource usage

## 🔧 Troubleshooting

### Common Issues

1. **Pod Not Starting**
   ```bash
   kubectl describe pod <pod-name> -n ecommerce
   kubectl logs <pod-name> -n ecommerce
   ```

2. **Database Connection Issues**
   ```bash
   kubectl get pods -n ecommerce
   kubectl exec -it <mongodb-pod> -n ecommerce -- mongosh
   ```

3. **Service Mesh Issues**
   ```bash
   kubectl get virtualservices -n ecommerce
   kubectl get destinationrules -n ecommerce
   ```

### Health Checks
- **Liveness Probe**: `/api/health` endpoint
- **Readiness Probe**: `/api/health` endpoint
- **Startup Probe**: `/api/health` endpoint
- **Health Check**: 30s interval, 3 retries

## 🚀 Production Deployment

### Prerequisites
- Ubuntu 20.04+ server
- t2.medium instance or better
- Root access
- Docker Hub account (`tohidazure`)

### Deployment Steps
1. **Setup Instance**: Run `scripts/instance-setup.sh`
2. **Build & Push**: `docker build -t tohidazure/k8s-ecommerce:latest .`
3. **Deploy K8s**: `kubectl apply -f k8s/base/`
4. **Deploy Monitoring**: `kubectl apply -f monitoring/`
5. **Verify**: Check all pods are running
6. **Access**: Port-forward to access services

## 📝 Development

### Adding New Features
1. Develop locally with `docker-compose up -d`
2. Test authentication with dummy credentials
3. Create feature branch
4. Test with Kubernetes deployment
5. Merge to main and deploy to production

### Database Migrations
- MongoDB schema changes
- Data migration scripts
- Backup before changes
- Rollback procedures

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Kubernetes and Istio documentation

---

**Built with ❤️ using Next.js, Kubernetes, Istio, and comprehensive monitoring**

## 🎯 Key Features Implemented

### ✅ **Application Features**
- **Dummy Authentication**: Simple email/password login (any credentials work)
- **User Profile**: Complete profile page with avatar and user info
- **Product Catalog**: Browse products and categories
- **Shopping Cart**: Cart functionality with fake data
- **Health Monitoring**: `/api/health` endpoint for Kubernetes probes

### ✅ **Kubernetes Implementation**
- **Single-node cluster** with kubeadm
- **Flannel CNI** for pod networking
- **Istio service mesh** for traffic management
- **Auto-scaling** with HPA (1-2 replicas)
- **Resource optimization** for t2.medium instances
- **Persistent storage** for MongoDB and Grafana

### ✅ **Monitoring & Observability**
- **Prometheus** for metrics collection
- **Grafana** with pre-configured e-commerce dashboard
- **Health checks** for all services
- **Port conflict resolution** (Grafana: 3001, App: 3000)

### ✅ **DevOps & CI/CD**
- **Docker Hub integration** (`tohidazure/k8s-ecommerce`)
- **Automated deployment scripts**
- **Environment-specific configurations**
- **Local development** with Docker Compose