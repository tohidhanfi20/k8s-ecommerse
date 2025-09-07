# 🐧 Ubuntu Kubernetes Deployment Guide

## 📋 Overview

This guide provides step-by-step instructions for deploying the ecommerce application on Ubuntu using kubeadm.

## 🖥️ System Requirements

### Hardware Requirements
- **CPU**: 2+ cores (4 cores recommended for production)
- **RAM**: 4GB+ (8GB recommended for production)
- **Storage**: 20GB+ free space (50GB recommended for production)
- **Network**: Internet connection

### Recommended Instance Types
- **Production**: t3.large (2 vCPUs, 8GB RAM) or t3.xlarge (4 vCPUs, 16GB RAM)
- **Staging**: t3.medium (2 vCPUs, 4GB RAM)
- **Development**: t3.small (2 vCPUs, 2GB RAM)

### Software Requirements
- **OS**: Ubuntu 20.04+ (22.04 LTS recommended)
- **Architecture**: x86_64

## 🚀 Complete Setup Process

### Step 1: System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git vim htop

# Clone the repository
git clone <your-repo-url>
cd dashing-ecommerce
```

### Step 2: Run Setup Script

```bash
# Make setup script executable
chmod +x setup.sh

# Run the setup script (installs all required software)
./setup.sh
```

The setup script will install:
- Docker
- kubectl
- kustomize
- Helm
- Istio
- kubeadm
- Node.js and npm
- Additional Ubuntu packages

### Step 3: Setup Kubernetes Cluster

```bash
# Run kubeadm cluster setup (requires root)
sudo ./scripts/setup-kubeadm-cluster.sh
```

This script will:
- Optimize Ubuntu system for Kubernetes
- Initialize kubeadm cluster
- Install Calico CNI
- Install Istio service mesh
- Install monitoring addons (Prometheus, Grafana, Jaeger, Kiali)
- Configure the cluster for production use

### Step 4: Verify Cluster

```bash
# Check cluster status
kubectl get nodes
kubectl get pods -A

# Check Istio installation
kubectl get pods -n istio-system
```

## 🐳 Docker Hub Integration

### Step 1: Build and Push Images

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

### Step 2: Update Version Manifests

```bash
# Update versions in Kubernetes manifests
./scripts/update-version.sh production v1.0.0
./scripts/update-version.sh staging v1.0.0-staging
./scripts/update-version.sh canary v1.1.0-canary
```

## 🚀 Deployment

### Deploy to Staging

```bash
# Deploy to staging environment
./scripts/deploy.sh deploy-staging

# Check deployment status
kubectl get pods -n ecommerce
kubectl get services -n ecommerce
```

### Deploy to Production

```bash
# Deploy to production environment
./scripts/deploy.sh deploy-production

# Check deployment status
kubectl get pods -n ecommerce
kubectl get services -n ecommerce
```

### Canary Deployment

```bash
# Deploy canary version
kustomize build k8s/overlays/canary | kubectl apply -f -

# Apply canary traffic rules
kubectl apply -f k8s/istio/canary-virtual-service.yaml
kubectl apply -f k8s/istio/canary-destination-rule.yaml

# Monitor canary deployment
kubectl get pods -n ecommerce -l version=canary
```

## 📊 Monitoring and Observability

### Access Dashboards

```bash
# Access Kiali (Istio service mesh dashboard)
istioctl dashboard kiali

# Access Grafana
istioctl dashboard grafana

# Access Prometheus
istioctl dashboard prometheus

# Access Jaeger (distributed tracing)
istioctl dashboard jaeger
```

### Port Forwarding (Alternative Access)

```bash
# Grafana
kubectl port-forward -n istio-system svc/grafana 3000:3000

# Prometheus
kubectl port-forward -n istio-system svc/prometheus 9090:9090

# Kiali
kubectl port-forward -n istio-system svc/kiali 20001:20001
```

## 🔧 Ubuntu-Specific Optimizations

### System Tuning

The setup includes Ubuntu-specific optimizations:

```bash
# Disable swap
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# Enable IP forwarding
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf

# Load required kernel modules
sudo modprobe br_netfilter
sudo modprobe ip_vs

# Configure kernel parameters
sudo tee /etc/sysctl.d/k8s.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
vm.swappiness = 0
EOF

sudo sysctl --system
```

### Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 6443/tcp
sudo ufw allow 2379:2380/tcp
sudo ufw allow 10250/tcp
sudo ufw allow 10251/tcp
sudo ufw allow 10252/tcp
sudo ufw allow 10255/tcp
sudo ufw allow 30000:32767/tcp
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Swap Not Disabled
```bash
# Check swap status
swapon --show

# Disable swap
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

#### 2. Kernel Modules Not Loaded
```bash
# Load required modules
sudo modprobe br_netfilter
sudo modprobe ip_vs

# Make them persistent
echo 'br_netfilter' | sudo tee -a /etc/modules
echo 'ip_vs' | sudo tee -a /etc/modules
```

#### 3. Firewall Blocking Traffic
```bash
# Check firewall status
sudo ufw status

# Allow required ports
sudo ufw allow 6443/tcp
sudo ufw allow 2379:2380/tcp
sudo ufw allow 10250/tcp
```

#### 4. Pods Stuck in Pending
```bash
# Check node taints
kubectl describe nodes

# Remove taint from master node
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

### Debug Commands

```bash
# Check cluster status
kubectl cluster-info
kubectl get nodes
kubectl get pods -A

# Check system resources
kubectl top nodes
kubectl top pods -A

# Check logs
kubectl logs -n kube-system <pod-name>
kubectl logs -n istio-system <pod-name>

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp
```

## 🔄 Maintenance

### Update Cluster

```bash
# Update kubeadm
sudo apt update
sudo apt install -y kubeadm=1.28.0-00

# Update cluster
sudo kubeadm upgrade plan
sudo kubeadm upgrade apply v1.28.0

# Update kubelet and kubectl
sudo apt install -y kubelet=1.28.0-00 kubectl=1.28.0-00
sudo systemctl daemon-reload
sudo systemctl restart kubelet
```

### Backup and Restore

```bash
# Backup etcd
sudo ETCDCTL_API=3 etcdctl snapshot save /tmp/etcd-backup.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Backup cluster configuration
sudo cp -r /etc/kubernetes /tmp/kubernetes-backup
```

## 📈 Performance Tuning

### Node Optimization

```bash
# Increase file limits
echo '* soft nofile 65536' | sudo tee -a /etc/security/limits.conf
echo '* hard nofile 65536' | sudo tee -a /etc/security/limits.conf

# Optimize kernel parameters
echo 'vm.max_map_count=262144' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Container Runtime Optimization

```bash
# Configure Docker daemon
sudo tee /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF

sudo systemctl restart docker
```

## 🎯 Production Checklist

- [ ] Ubuntu 20.04+ installed
- [ ] System updated and optimized
- [ ] Docker installed and configured
- [ ] Kubernetes cluster initialized with kubeadm
- [ ] Calico CNI installed
- [ ] Istio service mesh installed
- [ ] Monitoring stack deployed
- [ ] Firewall configured
- [ ] Docker Hub images built and pushed
- [ ] Application deployed to staging
- [ ] Application deployed to production
- [ ] Canary deployment tested
- [ ] Monitoring dashboards accessible
- [ ] Backup strategy implemented

---

**Your Ubuntu Kubernetes cluster is now ready for production workloads! 🚀**
