# Build the client
Write-Host "Building client..." -ForegroundColor Green
cd client
npm run build
cd ..

# Create a deployment branch
Write-Host "Creating deployment branch..." -ForegroundColor Green
git checkout -b gh-pages

# Remove all files except the built client
Write-Host "Preparing for deployment..." -ForegroundColor Green
git rm -rf .
git checkout main -- client/dist

# Move built files to root
Move-Item client/dist/* .
Remove-Item -Recurse -Force client

# Add all files
git add .
git commit -m "Deploy to GitHub Pages"

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push origin gh-pages

# Go back to main branch
git checkout main

Write-Host "Deployment complete! Your site should be available at:" -ForegroundColor Green
Write-Host "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME" -ForegroundColor Yellow
