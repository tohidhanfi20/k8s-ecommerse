#!/bin/bash

# 🚀 Local Development Setup Script
# This script sets up the e-commerce app for local development

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[LOCAL-DEV]${NC} $1"
}

print_header "Setting up local development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    print_status "Installing MongoDB..."
    wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
fi

# Navigate to app directory
cd ecommerce-app

# Install dependencies
print_status "Installing dependencies..."
npm install

# Create environment file
print_status "Creating environment file..."
cat > .env.local << EOF
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=0TKLooBw+GM3z8vh9YDF+StDicONjHzJ01tod2XKb4U=
MONGODB_URI=mongodb://localhost:27017/ecommerce
NODE_ENV=development
EOF

# Start MongoDB
print_status "Starting MongoDB..."
sudo systemctl start mongod

# Start development server
print_status "Starting development server..."
print_status "App will be available at: http://localhost:3000"
npm run dev
