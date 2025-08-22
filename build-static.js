import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building static version for Render...');

// Build the React app
console.log('📦 Building React app...');
execSync('npm run build', { stdio: 'inherit' });

// Create a simple server.js for static serving
const serverCode = `
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/public')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`🌐 Admin interface: http://localhost:\${PORT}/admin/login\`);
});
`;

// Write the server file
fs.writeFileSync('server-static.js', serverCode);

// Update package.json start script
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.scripts['start-static'] = 'node server-static.js';
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log('✅ Static build complete!');
console.log('📁 Files ready in dist/public/');
console.log('🔧 Use "npm run start-static" to test locally');
