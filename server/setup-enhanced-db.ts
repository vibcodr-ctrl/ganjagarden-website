import { db } from './db';
import { products, adminUsers, siteContent, orders } from '@shared/schema';
import bcrypt from 'bcrypt';

async function setupEnhancedDatabase() {
  try {
    console.log('🚀 Setting up Enhanced GanjaGarden SQLite database...');
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(adminUsers).values({
      username: 'admin',
      email: 'admin@ganjagarden.com',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true
    }).onConflictDoNothing();

    // Enhanced products will be added through the admin interface
    console.log('🛍️ No enhanced sample products added - use admin interface to add products');
    
    // Insert default site content
    console.log('📝 Adding default site content...');
    await db.insert(siteContent).values([
      {
        key: 'hero_title',
        title: 'Hero Title',
        content: 'Premium Cannabis Plants for Serious Growers',
        contentType: 'text',
        isActive: true
      },
      {
        key: 'hero_subtitle',
        title: 'Hero Subtitle',
        content: 'Hand-selected cuttings and premium seedlings from the finest genetics',
        contentType: 'text',
        isActive: true
      }
    ]).onConflictDoNothing();

    // Orders will be created when customers make purchases
    console.log('📦 No sample orders added - orders will be created through customer purchases');

    console.log('✅ Enhanced database setup completed successfully!');
    console.log('🌱 Products now include detailed information for popup windows');
    console.log('👤 Admin login: admin / admin123');
    console.log('💾 Database: ganjagarden.db');
  } catch (error) {
    console.error('❌ Enhanced database setup failed:', error);
    process.exit(1);
  }
}

setupEnhancedDatabase();
