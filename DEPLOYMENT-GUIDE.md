# 🚀 Ecommerce Kubernetes Deployment Guide

## 📋 Overview

This guide explains how to deploy the ecommerce application using Docker Hub images with version control and canary deployment strategies.

## 🏗️ Architecture

### Version Strategy
- **Production**: `your-dockerhub-username/dashing-ecommerce:v1.0.0`
- **Staging**: `your-dockerhub-username/dashing-ecommerce:v1.0.0-staging`
- **Canary**: `your-dockerhub-username/dashing-ecommerce:v1.1.0-canary`

### Deployment Flow
```
Instance Build → Docker Hub Push → Kubernetes Deploy
     ↓                ↓                    ↓
  Build Image    Tag with Version    Update Manifests
```

## 🐳 Docker Hub Integration

### 1. Build and Push Process (On Instance)

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

### 2. Update Kubernetes Manifests

After pushing new images, update the image tags in the kustomization files:

#### Production (`k8s/overlays/production/kustomization.yaml`)
```yaml
images:
- name: dashing-ecommerce
  newName: your-dockerhub-username/dashing-ecommerce
  newTag: v1.0.0  # Update this version
```

#### Staging (`k8s/overlays/staging/kustomization.yaml`)
```yaml
images:
- name: dashing-ecommerce
  newName: your-dockerhub-username/dashing-ecommerce
  newTag: v1.0.0-staging  # Update this version
```

#### Canary (`k8s/overlays/canary/kustomization.yaml`)
```yaml
images:
- name: dashing-ecommerce
  newName: your-dockerhub-username/dashing-ecommerce
  newTag: v1.1.0-canary  # Update this version
```

## 🚀 Deployment Strategies

### 1. Staging Deployment
```bash
# Deploy to staging environment
kustomize build k8s/overlays/staging | kubectl apply -f -
```

### 2. Production Deployment
```bash
# Deploy to production environment
kustomize build k8s/overlays/production | kubectl apply -f -
```

### 3. Canary Deployment

#### Step 1: Deploy Canary Version
```bash
# Deploy canary version (10% traffic)
kustomize build k8s/overlays/canary | kubectl apply -f -
```

#### Step 2: Configure Traffic Splitting
```bash
# Apply canary traffic rules
kubectl apply -f k8s/istio/canary-virtual-service.yaml
kubectl apply -f k8s/istio/canary-destination-rule.yaml
```

#### Step 3: Monitor and Promote
```bash
# Check canary metrics
kubectl get pods -n ecommerce -l version=canary
kubectl logs -n ecommerce -l version=canary

# If successful, promote to production
# Update production kustomization with canary version
# If failed, rollback by removing canary deployment
```

## 📊 Monitoring Canary Deployment

### 1. Check Pod Status
```bash
kubectl get pods -n ecommerce -l version=canary
kubectl get pods -n ecommerce -l version=stable
```

### 2. Monitor Traffic Distribution
```bash
# Check Istio metrics
kubectl exec -n istio-system deployment/istiod -- pilot-discovery request GET /debug/endpointz
```

### 3. Application Logs
```bash
# Canary logs
kubectl logs -n ecommerce -l version=canary -f

# Stable logs
kubectl logs -n ecommerce -l version=stable -f
```

## 🔄 Rollback Strategy

### 1. Quick Rollback
```bash
# Remove canary deployment
kubectl delete deployment ecommerce-app -n ecommerce -l version=canary

# Remove canary traffic rules
kubectl delete virtualservice ecommerce-canary-vs -n ecommerce
kubectl delete destinationrule ecommerce-canary-dr -n ecommerce
```

### 2. Version Rollback
```bash
# Update production kustomization to previous version
# Edit k8s/overlays/production/kustomization.yaml
# Change newTag to previous stable version

# Apply the rollback
kustomize build k8s/overlays/production | kubectl apply -f -
```

## 🏷️ Version Management

### Version Naming Convention
- **Production**: `v1.0.0`, `v1.1.0`, `v2.0.0`
- **Staging**: `v1.0.0-staging`, `v1.1.0-staging`
- **Canary**: `v1.1.0-canary`, `v1.2.0-canary`
- **Hotfix**: `v1.0.1-hotfix`

### Version Update Process
1. **Build** new version on instance
2. **Tag** with appropriate version number
3. **Push** to Docker Hub
4. **Update** kustomization files
5. **Deploy** using appropriate strategy
6. **Monitor** deployment health
7. **Promote** or rollback based on results

## 🔧 Configuration Management

### Environment Variables
Each environment has its own configuration:

#### Production
```yaml
NODE_ENV: production
NEXTAUTH_URL: https://ecommerce.example.com
MONGODB_URI: mongodb://mongodb-service:27017/ecommerce_prod
```

#### Staging
```yaml
NODE_ENV: staging
NEXTAUTH_URL: https://staging.ecommerce.example.com
MONGODB_URI: mongodb://mongodb-service:27017/ecommerce_staging
```

#### Canary
```yaml
NODE_ENV: production
NEXTAUTH_URL: https://canary.ecommerce.example.com
MONGODB_URI: mongodb://mongodb-service:27017/ecommerce_canary
```

## 📈 Scaling Strategy

### Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ecommerce-hpa
  namespace: ecommerce
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ecommerce-app
  minReplicas: 1
  maxReplicas: 3
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## 🛡️ Security Considerations

### Image Security
- Use specific version tags (not `latest`)
- Scan images for vulnerabilities
- Use private Docker Hub repositories
- Implement image signing

### Network Security
- Istio mTLS between services
- Network policies for pod communication
- RBAC for Kubernetes resources
- Secrets management for sensitive data

## 📝 Best Practices

### 1. Version Control
- Always use semantic versioning
- Tag images with meaningful names
- Keep version history in Docker Hub
- Document breaking changes

### 2. Deployment
- Test in staging before production
- Use canary deployments for risky changes
- Monitor metrics during deployment
- Have rollback plan ready

### 3. Monitoring
- Set up alerts for deployment failures
- Monitor application performance
- Track error rates and response times
- Use distributed tracing

## 🆘 Troubleshooting

### Common Issues

1. **Image Pull Errors**
   ```bash
   kubectl describe pod <pod-name> -n ecommerce
   # Check image name and tag
   ```

2. **Canary Traffic Not Working**
   ```bash
   kubectl get virtualservice -n ecommerce
   kubectl get destinationrule -n ecommerce
   ```

3. **Deployment Stuck**
   ```bash
   kubectl rollout status deployment/ecommerce-app -n ecommerce
   kubectl rollout history deployment/ecommerce-app -n ecommerce
   ```

### Debug Commands
```bash
# Check all resources
kubectl get all -n ecommerce

# Check Istio resources
kubectl get virtualservice,destinationrule,gateway -n ecommerce

# Check pod logs
kubectl logs -n ecommerce -l app=ecommerce-app

# Check service endpoints
kubectl get endpoints -n ecommerce
```

---

**This deployment strategy ensures safe, versioned deployments with proper rollback capabilities! 🚀**
