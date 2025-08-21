#!/bin/bash

# Build the client
echo "Building client..."
cd client
npm run build
cd ..

# Create a deployment branch
echo "Creating deployment branch..."
git checkout -b gh-pages

# Remove all files except the built client
echo "Preparing for deployment..."
git rm -rf .
git checkout main -- client/dist

# Move built files to root
mv client/dist/* .
rm -rf client

# Add all files
git add .
git commit -m "Deploy to GitHub Pages"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin gh-pages

# Go back to main branch
git checkout main

echo "Deployment complete! Your site should be available at:"
echo "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
