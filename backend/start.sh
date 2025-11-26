#!/bin/bash

echo "Starting NASA APOD Explorer Backend..."

if [ ! -f .env ]; then
    echo ".env file not found! Please create one from .env.example"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Dependencies checked"
echo "NASA API Key: $(grep NASA_API_KEY .env | cut -d '=' -f2 | head -c 8)..."
echo "Starting server on port ${PORT:-3001}..."

npm run dev