import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import bcrypt from 'bcrypt';
import * as schema from '../shared/schema';
import { eq } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.username, 'admin'));
    
    if (existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.insert(schema.adminUsers).values({
      username: 'admin',
      email: 'admin@ganjagarden.com',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true
    });

    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');
    
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    await pool.end();
  }
}

setupAdmin();
