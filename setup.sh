#!/bin/bash

# 🚀 Ecommerce Kubernetes Setup Script
# This script installs all necessary software for Kubernetes deployment

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
    echo -e "${BLUE}[SETUP]${NC} $1"
}

# Check if running as root
check_root() {
    # if [[ $EUID -eq 0 ]]; then
    #     print_error "This script should not be run as root"
    #     exit 1
    # fi
    print_status "Running as root - proceeding with installation..."
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/debian_version ]; then
            OS="debian"
        elif [ -f /etc/redhat-release ]; then
            OS="redhat"
        else
            OS="linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
    print_status "Detected OS: $OS"
}

# Install Docker
install_docker() {
    print_header "Installing Docker..."
    
    if command -v docker &> /dev/null; then
        print_status "Docker is already installed"
        return
    fi
    
    case $OS in
        "debian")
            sudo apt-get update
            sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io
            ;;
        "redhat")
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io
            ;;
        "macos")
            print_warning "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
            return
            ;;
    esac
    
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    print_status "Docker installed successfully"
}

# Install kubectl
install_kubectl() {
    print_header "Installing kubectl..."
    
    if command -v kubectl &> /dev/null; then
        print_status "kubectl is already installed"
        return
    fi
    
    case $OS in
        "debian"|"redhat")
            curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
            sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
            rm kubectl
            ;;
        "macos")
            curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
            sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
            rm kubectl
            ;;
    esac
    
    print_status "kubectl installed successfully"
}

# Install kustomize
install_kustomize() {
    print_header "Installing kustomize..."
    
    if command -v kustomize &> /dev/null; then
        print_status "kustomize is already installed"
        return
    fi
    
    curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
    sudo mv kustomize /usr/local/bin/
    print_status "kustomize installed successfully"
}

# Install Helm
install_helm() {
    print_header "Installing Helm..."
    
    if command -v helm &> /dev/null; then
        print_status "Helm is already installed"
        return
    fi
    
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
    print_status "Helm installed successfully"
}

# Install Istio
install_istio() {
    print_header "Installing Istio..."
    
    if command -v istioctl &> /dev/null; then
        print_status "Istio is already installed"
        return
    fi
    
    curl -L https://istio.io/downloadIstio | sh -
    sudo mv istio-*/bin/istioctl /usr/local/bin/
    rm -rf istio-*
    print_status "Istio installed successfully"
}

# Install kubeadm (for cluster setup)
install_kubeadm() {
    print_header "Installing kubeadm..."
    
    if command -v kubeadm &> /dev/null; then
        print_status "kubeadm is already installed"
        return
    fi
    
    case $OS in
        "debian")
            sudo apt-get update
            sudo apt-get install -y apt-transport-https ca-certificates curl
            sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
            echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
            sudo apt-get update
            sudo apt-get install -y kubelet kubeadm kubectl
            sudo apt-mark hold kubelet kubeadm kubectl
            ;;
        "redhat")
            cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
            sudo yum install -y kubelet kubeadm kubectl
            sudo systemctl enable kubelet
            ;;
    esac
    
    print_status "kubeadm installed successfully"
}

# Install additional Ubuntu packages
install_ubuntu_packages() {
    print_header "Installing additional Ubuntu packages..."
    
    if [ "$OS" != "debian" ]; then
        print_status "Skipping Ubuntu-specific packages (not on Ubuntu/Debian)"
        return
    fi
    
    sudo apt-get update
    sudo apt-get install -y \
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
    
    print_status "Ubuntu packages installed successfully"
}

# Install Node.js and npm
install_nodejs() {
    print_header "Installing Node.js and npm..."
    
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        print_status "Node.js and npm are already installed"
        return
    fi
    
    case $OS in
        "debian"|"redhat")
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
            ;;
        "macos")
            if command -v brew &> /dev/null; then
                brew install node
            else
                print_warning "Please install Homebrew first: https://brew.sh/"
                return
            fi
            ;;
    esac
    
    print_status "Node.js and npm installed successfully"
}

# Setup Docker Hub authentication
setup_docker_hub() {
    print_header "Setting up Docker Hub authentication..."
    
    echo "Please enter your Docker Hub credentials:"
    read -p "Docker Hub Username: " DOCKER_USERNAME
    read -s -p "Docker Hub Password: " DOCKER_PASSWORD
    echo
    
    echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin
    
    # Save credentials for later use
    echo "DOCKER_USERNAME=$DOCKER_USERNAME" > .env.docker
    echo "DOCKER_PASSWORD=$DOCKER_PASSWORD" >> .env.docker
    chmod 600 .env.docker
    
    print_status "Docker Hub authentication configured"
}

# Create cluster setup script
create_cluster_setup() {
    print_header "Creating cluster setup scripts..."
    
    # kubeadm cluster setup
    cat > scripts/setup-kubeadm-cluster.sh << 'EOF'
#!/bin/bash
# kubeadm cluster setup script for Ubuntu

set -e

print_status() {
    echo -e "\033[0;32m[INFO]\033[0m $1"
}

print_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    print_error "This script must be run as root"
    exit 1
fi

# Check Ubuntu version
if ! grep -q "Ubuntu" /etc/os-release; then
    print_warning "This script is optimized for Ubuntu. Proceeding anyway..."
fi

print_status "Starting kubeadm cluster setup on Ubuntu..."

# Run system optimization first
if [ -f "./scripts/ubuntu-optimization.sh" ]; then
    print_status "Running Ubuntu system optimization..."
    ./scripts/ubuntu-optimization.sh
else
    print_warning "Ubuntu optimization script not found, skipping..."
fi

# Initialize kubeadm cluster
print_status "Initializing kubeadm cluster..."
kubeadm init \
    --pod-network-cidr=10.244.0.0/16 \
    --apiserver-advertise-address=$(hostname -I | awk '{print $1}') \
    --control-plane-endpoint=$(hostname -I | awk '{print $1}') \
    --upload-certs \
    --kubernetes-version=stable

print_status "Setting up kubectl for non-root user..."
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config

# Install Calico CNI (better than Flannel for production)
print_status "Installing Calico CNI..."
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/tigera-operator.yaml
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/custom-resources.yaml

# Wait for CNI to be ready
print_status "Waiting for CNI to be ready..."
kubectl wait --for=condition=ready pod -l k8s-app=calico-node -n calico-system --timeout=300s

print_status "Removing taint from master node to allow scheduling..."
kubectl taint nodes --all node-role.kubernetes.io/control-plane-

# Install metrics server
print_status "Installing metrics server..."
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Install Istio
print_status "Installing Istio service mesh..."
istioctl install --set values.defaultRevision=default -y

# Install Istio addons (Prometheus, Grafana, Jaeger)
print_status "Installing Istio addons..."
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.19/samples/addons/prometheus.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.19/samples/addons/grafana.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.19/samples/addons/jaeger.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.19/samples/addons/kiali.yaml

# Wait for Istio to be ready
print_status "Waiting for Istio to be ready..."
kubectl wait --for=condition=ready pod -l app=istiod -n istio-system --timeout=300s

# Enable Istio sidecar injection for default namespace
print_status "Enabling Istio sidecar injection for default namespace..."
kubectl label namespace default istio-injection=enabled

print_status "Cluster setup completed successfully! 🎉"
echo
print_status "Cluster Information:"
kubectl cluster-info
echo
print_status "Node Status:"
kubectl get nodes
echo
print_status "System Pods:"
kubectl get pods -A
echo
print_status "Next steps:"
echo "1. Deploy the ecommerce application: ./scripts/deploy.sh deploy-staging"
echo "2. Access Istio dashboard: istioctl dashboard kiali"
echo "3. Access Grafana: istioctl dashboard grafana"
echo "4. Access Prometheus: istioctl dashboard prometheus"
EOF

    # Ubuntu system optimization
    cat > scripts/ubuntu-optimization.sh << 'EOF'
#!/bin/bash
# Ubuntu system optimization for Kubernetes

set -e

print_status() {
    echo -e "\033[0;32m[INFO]\033[0m $1"
}

print_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    print_error "This script must be run as root"
    exit 1
fi

print_status "Optimizing Ubuntu system for Kubernetes..."

# Disable swap
print_status "Disabling swap..."
swapoff -a
sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# Enable IP forwarding
print_status "Enabling IP forwarding..."
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
sysctl -p

# Load required kernel modules
print_status "Loading required kernel modules..."
cat > /etc/modules-load.d/k8s.conf << 'MODULES'
br_netfilter
ip_vs
ip_vs_rr
ip_vs_wrr
ip_vs_sh
nf_conntrack
MODULES

modprobe br_netfilter
modprobe ip_vs
modprobe ip_vs_rr
modprobe ip_vs_wrr
modprobe ip_vs_sh
modprobe nf_conntrack

# Configure kernel parameters
print_status "Configuring kernel parameters..."
cat > /etc/sysctl.d/k8s.conf << 'SYSCTL'
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
vm.swappiness = 0
vm.overcommit_memory = 1
vm.panic_on_oom = 0
fs.inotify.max_user_instances = 8192
fs.inotify.max_user_watches = 1048576
fs.file-max = 52706963
fs.nr_open = 52706963
net.netfilter.nf_conntrack_max = 2310720
SYSCTL

sysctl --system

# Set timezone
print_status "Setting timezone to UTC..."
timedatectl set-timezone UTC

# Configure firewall
print_status "Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow 6443/tcp
ufw allow 2379:2380/tcp
ufw allow 10250/tcp
ufw allow 10251/tcp
ufw allow 10252/tcp
ufw allow 10255/tcp
ufw allow 30000:32767/tcp

print_status "Ubuntu system optimization completed!"
EOF

    chmod +x scripts/setup-kubeadm-cluster.sh
    chmod +x scripts/ubuntu-optimization.sh
    
    print_status "Cluster setup scripts created"
}

# Main installation function
main() {
    print_header "Starting Ecommerce Kubernetes Setup..."
    
    check_root
    detect_os
    
    # Install core tools
    install_ubuntu_packages
    install_docker
    install_kubectl
    install_kustomize
    install_helm
    install_istio
    install_kubeadm
    install_nodejs
    
    # Setup Docker Hub
    setup_docker_hub
    
    # Create cluster setup scripts
    create_cluster_setup
    
    print_header "Setup completed successfully! 🎉"
    echo
    print_status "Next steps:"
    echo "1. Logout and login again to apply Docker group changes"
    echo "2. Setup Kubernetes cluster:"
    echo "   - Run: sudo ./scripts/setup-kubeadm-cluster.sh"
    echo "3. Deploy the application: ./scripts/deploy.sh deploy-staging"
    echo
    print_status "Happy deploying! 🚀"
}

# Run main function
main "$@"
