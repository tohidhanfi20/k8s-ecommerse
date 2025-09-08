#!/bin/bash

# 🚀 Instance Setup Script for Kubernetes Deployment
# This script installs everything needed on the server

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[INSTANCE-SETUP]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    print_error "This script must be run as root"
    exit 1
fi

print_header "Setting up instance for Kubernetes deployment..."

# Update system
print_status "Updating system..."
apt-get update -y
apt-get upgrade -y

# Install essential packages
print_status "Installing essential packages..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    htop \
    vim \
    git \
    wget \
    unzip \
    jq

# Install Docker (needed for building images)
print_status "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker
systemctl start docker
systemctl enable docker

# Configure containerd for Kubernetes
print_status "Configuring containerd for Kubernetes..."
mkdir -p /etc/containerd
containerd config default | tee /etc/containerd/config.toml

# Enable SystemdCgroup
sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml

# Restart containerd
systemctl restart containerd
systemctl enable containerd

# Verify both Docker and containerd are working
print_status "Verifying Docker and containerd configuration..."
systemctl status docker --no-pager
systemctl status containerd --no-pager

# Install kubectl
print_status "Installing kubectl..."
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl

# Install kustomize
print_status "Installing kustomize..."
curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
chmod +x kustomize
mv kustomize /usr/local/bin/

# Install kubeadm
print_status "Installing kubeadm..."
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /' | tee /etc/apt/sources.list.d/kubernetes.list
apt-get update -y
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl

# System optimization
print_status "Optimizing system for Kubernetes..."

# Disable swap
swapoff -a
sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# Enable IP forwarding
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
sysctl -p

# Load kernel modules
cat > /etc/modules-load.d/k8s.conf << 'EOF'
br_netfilter
ip_vs
ip_vs_rr
ip_vs_wrr
ip_vs_sh
nf_conntrack
EOF

modprobe br_netfilter
modprobe ip_vs
modprobe ip_vs_rr
modprobe ip_vs_wrr
modprobe ip_vs_sh
modprobe nf_conntrack

# Configure kernel parameters
cat > /etc/sysctl.d/k8s.conf << 'EOF'
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
vm.swappiness = 0
vm.overcommit_memory = 1
vm.panic_on_oom = 0
EOF

sysctl --system

# Configure firewall
ufw --force enable
ufw allow ssh
ufw allow 6443/tcp
ufw allow 2379:2380/tcp
ufw allow 10250/tcp
ufw allow 10251/tcp
ufw allow 10252/tcp
ufw allow 10255/tcp
ufw allow 30000:32767/tcp

# Initialize Kubernetes cluster
print_status "Initializing Kubernetes cluster..."

# Try with proper containerd configuration first
if kubeadm init \
    --pod-network-cidr=10.244.0.0/16 \
    --apiserver-advertise-address=$(hostname -I | awk '{print $1}') \
    --control-plane-endpoint=$(hostname -I | awk '{print $1}') \
    --upload-certs \
    --kubernetes-version=stable; then
    print_status "Kubernetes cluster initialized successfully!"
else
    print_error "Standard initialization failed. Trying with containerd fixes..."
    
    # Stop containerd and reconfigure
    systemctl stop containerd
    
    # Create a minimal containerd config
    cat > /etc/containerd/config.toml << 'EOF'
version = 2
root = "/var/lib/containerd"
state = "/run/containerd"

[grpc]
  address = "/run/containerd/containerd.sock"
  uid = 0
  gid = 0

[ttrpc]
  address = "/run/containerd/containerd.sock.ttrpc"
  uid = 0
  gid = 0

[plugins]
  [plugins."io.containerd.grpc.v1.cri"]
    disable_tcp_service = true
    stream_server_address = "127.0.0.1"
    stream_server_port = "0"
    stream_idle_timeout = "4h0m0s"
    enable_selinux = false
    sandbox_image = "registry.k8s.io/pause:3.9"
    stats_collect_period = 10
    systemd_cgroup = true
    enable_tls_streaming = false
    max_container_log_line_size = 16384
    disable_cgroup = false
    disable_apparmor = false
    restrict_oom_score_adj = false
    max_concurrent_downloads = 3
    disable_proc_mount = false
    unset_seccomp_profile = ""
    tolerate_missing_hugetlb_controller = true
    ignore_image_defined_volumes = false
    [plugins."io.containerd.grpc.v1.cri".containerd]
      snapshotter = "overlayfs"
      default_runtime_name = "runc"
      no_pivot = false
      disable_snapshot_annotations = true
      discard_unpacked_layers = false
      [plugins."io.containerd.grpc.v1.cri".containerd.runtimes]
        [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
          runtime_type = "io.containerd.runc.v2"
          runtime_engine = ""
          runtime_root = ""
          privileged_without_host_devices = false
          base_runtime_spec = ""
          [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
            SystemdCgroup = true
    [plugins."io.containerd.grpc.v1.cri".cni]
      bin_dir = "/opt/cni/bin"
      conf_dir = "/etc/cni/net.d"
      max_conf_num = 1
      conf_template = ""
    [plugins."io.containerd.grpc.v1.cri".registry]
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
          endpoint = ["https://registry-1.docker.io"]
EOF

    # Restart containerd
    systemctl restart containerd
    systemctl enable containerd
    
    # Wait for containerd to be ready
    sleep 10
    
    # Try initialization again
    kubeadm init \
        --pod-network-cidr=10.244.0.0/16 \
        --apiserver-advertise-address=$(hostname -I | awk '{print $1}') \
        --control-plane-endpoint=$(hostname -I | awk '{print $1}') \
        --upload-certs \
        --kubernetes-version=stable
fi

# Setup kubectl
print_status "Setting up kubectl..."
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config

# Install Flannel CNI
print_status "Installing Flannel CNI..."
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml

# Wait for CNI
print_status "Waiting for CNI to be ready..."
sleep 30
kubectl wait --for=condition=ready pod -l app=flannel -n kube-flannel --timeout=300s || true

# Remove taint
print_status "Removing taint from master node..."
kubectl taint nodes --all node-role.kubernetes.io/control-plane-

# Install metrics server
print_status "Installing metrics server..."
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Wait for metrics server
print_status "Waiting for metrics server to be ready..."
sleep 30
kubectl wait --for=condition=ready pod -l k8s-app=metrics-server -n kube-system --timeout=300s || true

# Final verification
print_status "Verifying installation..."
kubectl get nodes
kubectl get pods -A

print_status "Instance setup completed successfully! 🎉"
echo
print_status "Next steps:"
echo "1. Login to Docker Hub: docker login"
echo "2. Build Docker image: docker build -t tohidazure/k8s-ecommerce:latest ."
echo "3. Push to Docker Hub: docker push tohidazure/k8s-ecommerce:latest"
echo "4. Deploy application:"
echo "   kubectl apply -f k8s/base/namespace.yaml"
echo "   kubectl apply -f k8s/base/configmap.yaml"
echo "   kubectl apply -f k8s/base/mongodb-deployment.yaml"
echo "   kubectl apply -f k8s/base/ecommerce-deployment.yaml"
echo "   kubectl apply -f k8s/base/hpa.yaml"
echo "5. Deploy monitoring:"
echo "   kubectl apply -f monitoring/grafana-deployment.yaml"
echo "   kubectl apply -f monitoring/grafana-dashboard-config.yaml"
echo "   kubectl apply -f monitoring/prometheus-deployment.yaml"
echo "6. Deploy NodePort services for external access:"
echo "   kubectl apply -f k8s/base/nodeport-services.yaml"
echo "7. Check status: kubectl get pods -n ecommerce"
echo "8. Get NodePorts: kubectl get services -n ecommerce"
echo
print_status "Access your application at: http://YOUR_INSTANCE_IP:NODEPORT"
print_status "Grafana: http://YOUR_INSTANCE_IP:GRAFANA_NODEPORT (admin/admin123)"
print_status "Prometheus: http://YOUR_INSTANCE_IP:PROMETHEUS_NODEPORT"
print_status "MongoDB: mongodb://YOUR_INSTANCE_IP:MONGODB_NODEPORT/ecommerce"
print_status "Note: NodePorts are auto-assigned by Kubernetes to avoid conflicts"
echo
print_status "Happy deploying! 🚀"
