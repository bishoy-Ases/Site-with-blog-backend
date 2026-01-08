#!/bin/bash

# Script to package Lambda function for deployment
# This creates a deployment package with all dependencies

set -e

echo "📦 Building Lambda deployment package..."

# Create temporary build directory
BUILD_DIR="lambda-build"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Copy Lambda source files
echo "📋 Copying source files..."
cp lambda/index.js $BUILD_DIR/
cp lambda/schema.js $BUILD_DIR/
cp lambda/package.json $BUILD_DIR/

# Install production dependencies
echo "📥 Installing dependencies..."
cd $BUILD_DIR
npm install --production --omit=dev

# Create deployment package
echo "🗜️  Creating ZIP package..."
zip -r ../lambda-package.zip . -x "*.git*"

# Cleanup
cd ..
rm -rf $BUILD_DIR

echo "✅ Lambda package created: lambda-package.zip"
echo "📊 Package size: $(du -h lambda-package.zip | cut -f1)"
