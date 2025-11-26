#!/bin/bash

echo "Starting NASA APOD Explorer Frontend..."

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Dependencies checked"
echo "Starting development server on port 5173..."

npm run dev