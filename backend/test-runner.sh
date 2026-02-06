#!/bin/bash

# Eventia Backend Test Runner
echo "🚀 Running Eventia Backend Tests..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run unit tests
echo "🧪 Running unit tests..."
npm run test:unit

# Run integration tests
echo "🔗 Running integration tests..."
npm run test:integration

# Run e2e tests
echo "🎭 Running end-to-end tests..."
npm run test:e2e

# Generate coverage report
echo "📊 Generating coverage report..."
npm run test:cov

echo "✅ All tests completed!"
echo "📁 Coverage report available in: coverage/lcov-report/index.html"
