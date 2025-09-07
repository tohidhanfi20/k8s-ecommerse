# 🛒 Dashing Ecommerce - Kubernetes Deployment

A modern, scalable ecommerce application built with Next.js, MongoDB, and deployed on Kubernetes with Istio service mesh and comprehensive monitoring.

## 🏗️ Architecture

### Core Components
- **Frontend**: Next.js 13 with TypeScript
- **Database**: MongoDB 7.0
- **Authentication**: NextAuth.js
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Service Mesh**: Istio
- **Monitoring**: Prometheus + Grafana

### Kubernetes Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Istio Gateway                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Ecommerce │  │   MongoDB   │  │  Prometheus │        │
│  │     App     │  │   Service   │  │   Service   │        │
│  │  (3 replicas)│  │ (1 replica) │  │ (1 replica) │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    Grafana Dashboard                       │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Ubuntu 20.04+ (recommended)
- Docker
- Kubernetes cluster (kubeadm)
- kubectl
- kustomize
- Docker Hub account

### Setup Installation (Ubuntu)
```bash
# Install all necessary software for Ubuntu
chmod +x setup.sh
./setup.sh

# Setup Kubernetes cluster with kubeadm
sudo ./scripts/setup-kubeadm-cluster.sh
```

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Docker Hub Integration

#### 1. Build and Push Images (On Instance)
```bash
# Build the application
docker build -t your-dockerhub-username/dashing-ecommerce:latest .

# Tag for different environments
docker tag your-dockerhub-username/dashing-ecommerce:latest your-dockerhub-username/dashing-ecommerce:v1.0.0
docker tag your-dockerhub-username/dashing-ecommerce:latest your-dockerhub-username/dashing-ecommerce:v1.0.0-staging
docker tag your-dockerhub-username/dashing-ecommerce:latest your-dockerhub-username/dashing-ecommerce:v1.1.0-canary

# Push to Docker Hub
docker push your-dockerhub-username/dashing-ecommerce:v1.0.0
docker push your-dockerhub-username/dashing-ecommerce:v1.0.0-staging
docker push your-dockerhub-username/dashing-ecommerce:v1.1.0-canary
```

#### 2. Update Versions in Manifests
```bash
# Windows
scripts\update-version.bat production v1.0.0
scripts\update-version.bat staging v1.0.0-staging
scripts\update-version.bat canary v1.1.0-canary

# Linux/Mac
chmod +x scripts/update-version.sh
./scripts/update-version.sh production v1.0.0
./scripts/update-version.sh staging v1.0.0-staging
./scripts/update-version.sh canary v1.1.0-canary
```

### Kubernetes Deployment

#### 1. Deploy to Staging
```bash
# Windows
scripts\deploy.bat deploy-staging

# Linux/Mac
chmod +x scripts/deploy.sh
./scripts/deploy.sh deploy-staging
```

#### 2. Deploy to Production
```bash
# Windows
scripts\deploy.bat deploy-production

# Linux/Mac
./scripts/deploy.sh deploy-production
```

#### 3. Canary Deployment
```bash
# Deploy canary version
kustomize build k8s/overlays/canary | kubectl apply -f -

# Apply canary traffic rules
kubectl apply -f k8s/istio/canary-virtual-service.yaml
kubectl apply -f k8s/istio/canary-destination-rule.yaml
```

#### 4. Check Status
```bash
# Windows
scripts\deploy.bat status

# Linux/Mac
./scripts/deploy.sh status
```

## 📁 Project Structure

```
dashing-ecommerce/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   ├── cart/                     # Shopping cart
│   ├── categories/               # Product categories
│   ├── product/                  # Product pages
│   └── profile/                  # User profile
├── components/                   # React components
│   ├── BannerSlider/            # Homepage banner
│   ├── Category/                # Category display
│   ├── FeatureProducts/         # Featured products
│   ├── Header/                  # Navigation header
│   └── ProductCards/            # Product cards
├── k8s/                         # Kubernetes manifests
│   ├── base/                    # Base configurations
│   ├── overlays/                # Environment-specific configs
│   │   ├── production/          # Production settings
│   │   └── staging/             # Staging settings
│   └── istio/                   # Service mesh config
├── monitoring/                  # Monitoring stack
│   ├── prometheus-deployment.yaml
│   └── grafana-deployment.yaml
├── scripts/                     # Deployment scripts
│   ├── deploy.sh               # Linux/Mac deployment
│   └── deploy.bat              # Windows deployment
├── Dockerfile                   # Container image
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables
- `NEXTAUTH_URL`: Authentication callback URL
- `NEXTAUTH_SECRET`: JWT secret key
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/staging/production)

### Kubernetes Resources
- **Namespace**: `ecommerce`
- **ConfigMap**: Environment configuration
- **Deployments**: App and database
- **Services**: Internal service discovery
- **PVCs**: Persistent storage for MongoDB and monitoring

## 📊 Monitoring & Observability

### Prometheus Metrics
- Application performance metrics
- Database connection metrics
- Kubernetes pod metrics
- Custom business metrics

### Grafana Dashboards
- Application performance
- Database performance
- Kubernetes cluster health
- Business metrics (orders, users, etc.)

### Access Monitoring
```bash
# Port forward to access Grafana
kubectl port-forward -n ecommerce svc/grafana-service 3000:3000

# Access Grafana at http://localhost:3000
# Username: admin
# Password: admin123
```

## 🌐 Service Access

| Service | URL | Description |
|---------|-----|-------------|
| Ecommerce App | http://localhost:3000 | Main application |
| Grafana | http://localhost:3000 (port-forward) | Monitoring dashboard |
| Prometheus | http://localhost:9090 (port-forward) | Metrics collection |

## 🔄 Deployment Strategies

### Staging Environment
- 2 replicas
- Reduced resources
- Debug logging enabled
- Separate MongoDB database

### Production Environment
- 5 replicas
- High resource allocation
- Production logging
- Optimized performance

## 🛡️ Security Features

- **Istio Service Mesh**: Traffic encryption, mTLS
- **Network Policies**: Pod-to-pod communication control
- **RBAC**: Role-based access control
- **Secrets Management**: Secure credential storage
- **Image Security**: Non-root containers

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
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Vertical Pod Autoscaler (VPA)
- Automatic resource adjustment
- Memory and CPU optimization
- Cost-effective resource usage

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
- **Liveness Probe**: Ensures container is running
- **Readiness Probe**: Ensures container is ready to serve traffic
- **Startup Probe**: Handles slow-starting containers

## 🚀 Production Deployment

### Prerequisites
- Kubernetes cluster with Istio
- Persistent volume provisioner
- Load balancer or ingress controller
- SSL/TLS certificates

### Deployment Steps
1. Build and push Docker image to registry
2. Update image tags in kustomization files
3. Deploy using production overlay
4. Configure monitoring and alerting
5. Set up backup and disaster recovery

## 📝 Development

### Adding New Features
1. Develop locally with `npm run dev`
2. Test with staging deployment
3. Create feature branch
4. Deploy to staging for testing
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

**Built with ❤️ using Next.js, Kubernetes, and Istio**