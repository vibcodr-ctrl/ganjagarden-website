import { db } from './db';
import { products, adminUsers, siteContent, orders } from '@shared/schema';
import bcrypt from 'bcrypt';

async function setupDatabase() {
  try {
    console.log('🚀 Setting up GanjaGarden SQLite database...');
    
    // Create tables
    console.log('📋 Creating database tables...');
    
    // Note: Drizzle will create tables automatically when we insert data
    // But we can also create them explicitly if needed
    
    // Insert default admin user
    console.log('👤 Creating default admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.insert(adminUsers).values({
      username: 'admin',
      email: 'admin@ganjagarden.com',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true
    }).onConflictDoNothing();
    
    // Products will be added through the admin interface
    console.log('🛍️ No sample products added - use admin interface to add products');
    
    // Insert default site content
    console.log('📝 Adding default site content...');
    await db.insert(siteContent).values([
      // Hero Section
      {
        key: 'hero_title',
        title: 'Hero Section Title',
        content: 'Premium Cannabis Plants & Cuttings',
        contentType: 'text',
        isActive: true,
        orderIndex: 0
      },
      {
        key: 'hero_subtitle',
        title: 'Hero Section Subtitle',
        content: 'Professional-grade cannabis cuttings and seedlings grown with care. Perfect genetics, healthy plants, delivered to your chosen safe location or available at our secure pickup hotspots.',
        contentType: 'text',
        isActive: true,
        orderIndex: 1
      },
      
      // Plant Selection Section
      {
        key: 'plant_selection_title',
        title: 'Plant Selection Title',
        content: 'Choose Your Plants',
        contentType: 'text',
        isActive: true,
        orderIndex: 2
      },
      {
        key: 'plant_selection_description',
        title: 'Plant Selection Description',
        content: 'We specialize in two types of premium cannabis plants, each carefully cultivated for optimal growth and genetics.',
        contentType: 'text',
        isActive: true,
        orderIndex: 3
      },
      
      // Featured Cuttings Section
      {
        key: 'featured_cuttings_title',
        title: 'Featured Cuttings Title',
        content: 'Featured Cuttings',
        contentType: 'text',
        isActive: true,
        orderIndex: 4
      },
      {
        key: 'featured_cuttings_description',
        title: 'Featured Cuttings Description',
        content: 'Our most popular and highest-quality cutting varieties',
        contentType: 'text',
        isActive: true,
        orderIndex: 5
      },
      
      // Premium Seedlings Section
      {
        key: 'premium_seedlings_title',
        title: 'Premium Seedlings Title',
        content: 'Premium Seedlings',
        contentType: 'text',
        isActive: true,
        orderIndex: 6
      },
      {
        key: 'premium_seedlings_description',
        title: 'Premium Seedlings Description',
        content: 'Fresh seedlings from top-tier genetics',
        contentType: 'text',
        isActive: true,
        orderIndex: 7
      },
      
      // Why Choose GreenLeaf Section
      {
        key: 'why_choose_title',
        title: 'Why Choose GreenLeaf Title',
        content: 'Why Choose GreenLeaf?',
        contentType: 'text',
        isActive: true,
        orderIndex: 8
      },
      {
        key: 'why_choose_subtitle',
        title: 'Why Choose GreenLeaf Subtitle',
        content: 'Professional quality, reliable delivery, expert support',
        contentType: 'text',
        isActive: true,
        orderIndex: 9
      },
      {
        key: 'why_choose_feature_1_title',
        title: 'Why Choose Feature 1 Title',
        content: 'Premium Genetics',
        contentType: 'text',
        isActive: true,
        orderIndex: 10
      },
      {
        key: 'why_choose_feature_1_description',
        title: 'Why Choose Feature 1 Description',
        content: 'All our plants come from carefully selected mother plants and premium seeds, ensuring superior genetics and consistent quality.',
        contentType: 'text',
        isActive: true,
        orderIndex: 11
      },
      {
        key: 'why_choose_feature_2_title',
        title: 'Why Choose Feature 2 Title',
        content: 'Safe & Flexible Delivery',
        contentType: 'text',
        isActive: true,
        orderIndex: 12
      },
      {
        key: 'why_choose_feature_2_description',
        title: 'Why Choose Feature 2 Description',
        content: 'Choose your preferred safe meeting location - whether it\'s your home, a parking lot, or one of our secure pickup hotspots. We prioritize your safety and discretion while ensuring your plants arrive healthy.',
        contentType: 'text',
        isActive: true,
        orderIndex: 13
      },
      {
        key: 'why_choose_feature_3_title',
        title: 'Why Choose Feature 3 Title',
        content: 'Expert Support',
        contentType: 'text',
        isActive: true,
        orderIndex: 14
      },
      {
        key: 'why_choose_feature_3_description',
        title: 'Why Choose Feature 3 Description',
        content: 'Our experienced team provides ongoing support and growing tips to help you achieve the best results with your plants.',
        contentType: 'text',
        isActive: true,
        orderIndex: 15
      },
      
      // Safety Section
      {
        key: 'safety_title',
        title: 'Safety Section Title',
        content: 'Your Safety is Our Priority',
        contentType: 'text',
        isActive: true,
        orderIndex: 16
      },
      {
        key: 'safety_description',
        title: 'Safety Section Description',
        content: 'We offer flexible and secure delivery options to ensure you feel completely safe when receiving your plants.',
        contentType: 'text',
        isActive: true,
        orderIndex: 17
      },
      {
        key: 'safety_choose_location_title',
        title: 'Safety Choose Location Title',
        content: 'Choose Any Safe Location',
        contentType: 'text',
        isActive: true,
        orderIndex: 18
      },
      {
        key: 'safety_choose_location_description',
        title: 'Safety Choose Location Description',
        content: 'Select any location where you feel secure - your home, a parking lot, shopping center, or any public place that works for you. We adapt to your comfort level.',
        contentType: 'text',
        isActive: true,
        orderIndex: 19
      },
      {
        key: 'safety_pickup_hotspots_title',
        title: 'Safety Pickup Hotspots Title',
        content: 'Secure Pickup Hotspots',
        contentType: 'text',
        isActive: true,
        orderIndex: 20
      },
      {
        key: 'safety_pickup_hotspots_description',
        title: 'Safety Pickup Hotspots Description',
        content: 'We maintain a network of trusted pickup locations throughout the area. These are safe, discreet spots where you can meet our team with complete confidence.',
        contentType: 'text',
        isActive: true,
        orderIndex: 21
      },
      {
        key: 'safety_professional_title',
        title: 'Safety Professional Title',
        content: 'Professional & Discreet',
        contentType: 'text',
        isActive: true,
        orderIndex: 22
      },
      {
        key: 'safety_professional_description',
        title: 'Safety Professional Description',
        content: 'Our team is trained to conduct all meetings professionally and discreetly. Your privacy and safety are always our top concerns.',
        contentType: 'text',
        isActive: true,
        orderIndex: 23
      },
      {
        key: 'delivery_options_title',
        title: 'Delivery Options Title',
        content: 'Delivery Options',
        contentType: 'text',
        isActive: true,
        orderIndex: 24
      },
      {
        key: 'delivery_safe_location_title',
        title: 'Delivery Safe Location Title',
        content: 'Safe Location Delivery',
        contentType: 'text',
        isActive: true,
        orderIndex: 25
      },
      {
        key: 'delivery_safe_location_description',
        title: 'Delivery Safe Location Description',
        content: 'We deliver to any address or location you specify - whether it\'s your home, workplace, or a public meeting spot like a parking lot or cafe.',
        contentType: 'text',
        isActive: true,
        orderIndex: 26
      },
      {
        key: 'delivery_pickup_hotspots_title',
        title: 'Delivery Pickup Hotspots Title',
        content: 'Secure Pickup Hotspots',
        contentType: 'text',
        isActive: true,
        orderIndex: 27
      },
      {
        key: 'delivery_pickup_hotspots_description',
        title: 'Delivery Pickup Hotspots Description',
        content: 'Choose from our established network of secure pickup locations:',
        contentType: 'text',
        isActive: true,
        orderIndex: 28
      },
      {
        key: 'delivery_pickup_locations',
        title: 'Delivery Pickup Locations List',
        content: '• Downtown Mall Parking - Level 2 (West Side)\n• Riverside Park - Main Entrance Lot\n• Metro Station Plaza - Coffee Shop Area\n• Shopping Center - Food Court Parking\n• Community Center - Back Parking Lot\n+ More locations available upon request',
        contentType: 'text',
        isActive: true,
        orderIndex: 29
      },
      {
        key: 'delivery_priority_message',
        title: 'Delivery Priority Message',
        content: 'All meetings are conducted safely with your security and privacy as our highest priority.',
        contentType: 'text',
        isActive: true,
        orderIndex: 30
      },
      
      // Pickup Locations Section
      {
        key: 'pickup_locations_title',
        title: 'Pickup Locations Title',
        content: 'Secure Pickup Locations',
        contentType: 'text',
        isActive: true,
        orderIndex: 31
      },
      {
        key: 'pickup_locations_description',
        title: 'Pickup Locations Description',
        content: 'Choose from our network of safe, convenient pickup hotspots throughout the area. All locations are carefully selected for your safety and privacy.',
        contentType: 'text',
        isActive: true,
        orderIndex: 32
      },
      {
        key: 'pickup_locations_list',
        title: 'Pickup Locations List',
        content: JSON.stringify([
          {
            name: 'Downtown Mall Plaza',
            district: 'Downtown',
            spot: 'Level 2 Parking - West Side',
            hours: '9AM - 9PM',
            notes: 'Near the main entrance, well-lit area with security cameras',
            isPopular: true
          },
          {
            name: 'Riverside Park',
            district: 'Riverside',
            spot: 'Main Entrance Parking Lot',
            hours: '8AM - 8PM',
            notes: 'Spacious parking with easy access, family-friendly area',
            isPopular: true
          },
          {
            name: 'Metro Station Plaza',
            district: 'Metro District',
            spot: 'Coffee Shop Area - North Side',
            hours: '7AM - 10PM',
            notes: 'High traffic area, multiple exit routes for convenience'
          },
          {
            name: 'Westside Shopping Center',
            district: 'West Side',
            spot: 'Food Court Parking Section B',
            hours: '10AM - 9PM',
            notes: 'Covered parking available, close to multiple businesses',
            isPopular: true
          },
          {
            name: 'Community Recreation Center',
            district: 'North End',
            spot: 'Back Parking Lot - Staff Entrance',
            hours: '6AM - 10PM',
            notes: 'Quiet location with regular security patrols'
          },
          {
            name: 'University Campus',
            district: 'University District',
            spot: 'Visitor Parking - Building C',
            hours: '8AM - 6PM',
            notes: 'Academic area with consistent foot traffic'
          }
        ]),
        contentType: 'json',
        isActive: true,
        orderIndex: 33
      },
      
      // Location Flexibility Section
      {
        key: 'location_flexibility_title',
        title: 'Location Flexibility Title',
        content: 'Need a Different Location?',
        contentType: 'text',
        isActive: true,
        orderIndex: 34
      },
      {
        key: 'location_flexibility_description',
        title: 'Location Flexibility Description',
        content: 'These are our established pickup hotspots, but we\'re flexible! If you have a preferred safe meeting location that\'s not listed, just let us know. We can arrange pickups at parking lots, shopping centers, or any public place where you feel comfortable.',
        contentType: 'text',
        isActive: true,
        orderIndex: 35
      },
      {
        key: 'location_flexibility_button',
        title: 'Location Flexibility Button',
        content: 'Suggest a Location',
        contentType: 'text',
        isActive: true,
        orderIndex: 36
      },
      {
        key: 'location_flexibility_message',
        title: 'Location Flexibility Message',
        content: 'All meetings are safe, discreet, and professional',
        contentType: 'text',
        isActive: true,
        orderIndex: 37
      },
      {
        key: 'location_benefits_title_1',
        title: 'Location Benefits Title 1',
        content: 'Vetted Locations',
        contentType: 'text',
        isActive: true,
        orderIndex: 38
      },
      {
        key: 'location_benefits_description_1',
        title: 'Location Benefits Description 1',
        content: 'All pickup spots are carefully selected for safety and convenience',
        contentType: 'text',
        isActive: true,
        orderIndex: 39
      },
      {
        key: 'location_benefits_title_2',
        title: 'Location Benefits Title 2',
        content: 'Flexible Hours',
        contentType: 'text',
        isActive: true,
        orderIndex: 40
      },
      {
        key: 'location_benefits_description_2',
        title: 'Location Benefits Description 2',
        content: 'Most locations available during extended hours for your convenience',
        contentType: 'text',
        isActive: true,
        orderIndex: 41
      },
      {
        key: 'location_benefits_title_3',
        title: 'Location Benefits Title 3',
        content: 'Wide Coverage',
        contentType: 'text',
        isActive: true,
        orderIndex: 42
      },
      {
        key: 'location_benefits_description_3',
        title: 'Location Benefits Description 3',
        content: 'Pickup points across different areas to minimize your travel time',
        contentType: 'text',
        isActive: true,
        orderIndex: 43
      }
    ]).onConflictDoNothing();
    
    // Orders will be created when customers make purchases
    console.log('📦 No sample orders added - orders will be created through customer purchases');
    
    console.log('✅ Database setup completed successfully!');
    console.log('🌐 Admin interface: http://localhost:5000/admin/login');
    console.log('👤 Username: admin, Password: admin123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
