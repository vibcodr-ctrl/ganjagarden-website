import bcrypt from 'bcrypt';

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    
    // Create admin user with hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Hashed password:', hashedPassword);
    console.log('');
    console.log('⚠️  IMPORTANT: This is for testing only!');
    console.log('⚠️  In production, you need a real database connection.');
    console.log('');
    console.log('To test the admin interface:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Go to: http://localhost:3000/admin/login');
    console.log('3. Login with admin/admin123');
    console.log('');
    console.log('Note: You may need to set up a database connection first.');
    console.log('Check ADMIN_SETUP.md for detailed instructions.');
    
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
}

setupAdmin();
