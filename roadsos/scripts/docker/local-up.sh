#!/bin/bash
# Team Name: Divine coder
# Team Lead: Praveen kumar
# Project: RoadSoS (IIT Madras Hackathon)

echo "🐋 Spinning up RoadSoS Local Stack..."

# Load .env if exists
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

docker-compose up --build -d

echo "🚀 Stack is coming online:"
echo "Dashboard: http://localhost:3000"
echo "Gateway:   http://localhost:5000"
