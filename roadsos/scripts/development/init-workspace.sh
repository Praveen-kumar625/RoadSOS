#!/bin/bash
# Team Name: Divine coder
# Team Lead: Praveen kumar
# Project: RoadSoS (IIT Madras Hackathon)

echo "🚀 Initializing RoadSoS Workspace..."

# Ensure Node.js and npm are available
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    exit 1
fi

# Install dependencies at root
echo "📦 Installing root dependencies..."
npm install

# Build all local libraries
echo "🏗️ Building shared libraries..."
npm run build --workspace=@roadsos/core-types
npm run build --workspace=@roadsos/ai-local-models

echo "✅ Workspace Initialized. Run 'npm run dev' to start the system."
