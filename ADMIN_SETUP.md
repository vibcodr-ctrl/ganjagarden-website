# GanjaGarden Admin Interface Setup Guide

## Overview
This admin interface allows you to manage your cannabis business website without touching any code. You can:
- Add, edit, and delete products
- Manage website content (hero text, about sections, etc.)
- Upload and manage product images
- View customer orders and manage fulfillment
- Monitor business analytics

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- Environment variables configured

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key_here
```

### 3. Set Up Database
```bash
# Push the database schema
npm run db:push

# Create the initial admin user
npm run setup-admin
```

### 4. Start the Development Server
```bash
npm run dev
```

## Admin Access

### Default Login Credentials
- **Username:** `admin`
- **Password:** `admin123`
- **URL:** `http://localhost:5000/admin/login`

⚠️ **IMPORTANT:** Change the default password after first login!

## Features

### 🛍️ Product Management
- **Add Products:** Create new cannabis cuttings and seedlings
- **Edit Products:** Update product details, prices, and stock
- **Delete Products:** Remove products from your catalog
- **Image Management:** Upload and manage product images
- **Inventory Control:** Track stock levels and availability

### 📝 Content Management
- **Hero Section:** Edit main headline and subtitle
- **About Section:** Update company information and value propositions
- **Contact Information:** Modify contact details and messaging
- **Footer Content:** Customize footer text and links
- **Real-time Preview:** See changes immediately on your website

### 📊 Order Management
- **View Orders:** See all customer orders in one place
- **Order Status:** Update order status (pending, confirmed, delivered)
- **Customer Information:** Access customer details and contact info
- **Revenue Tracking:** Monitor sales and business performance

### 🔐 Security Features
- **JWT Authentication:** Secure admin access
- **Role-based Access:** Different permission levels for users
- **Session Management:** Automatic logout and token refresh
- **Audit Trail:** Track admin actions and changes

## Usage Guide

### Adding a New Product
1. Navigate to **Products** in the admin dashboard
2. Click **Add Product** button
3. Fill in product details:
   - Name and description
   - Price and stock quantity
   - Category (seedling or cutting)
   - Strain and genetics information
   - Product image URL
4. Click **Create Product**

### Editing Website Content
1. Go to **Content** in the admin dashboard
2. Find the content section you want to edit
3. Click **Edit** button
4. Modify the text or HTML content
5. Toggle **Active** status if needed
6. Click **Update Content**

### Managing Orders
1. Navigate to **Orders** in the admin dashboard
2. View order details and customer information
3. Update order status as needed
4. Monitor revenue and customer metrics

## File Structure
```
client/src/pages/
├── admin-login.tsx      # Admin login page
├── admin-dashboard.tsx  # Main admin dashboard
├── admin-products.tsx   # Product management
└── admin-content.tsx    # Content management

server/
├── routes.ts            # API endpoints
├── storage.ts           # Database operations
└── setup-admin.ts       # Admin user setup

shared/
└── schema.ts            # Database schema
```

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login

### Products
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Content
- `GET /api/admin/content` - List all content sections
- `POST /api/admin/content` - Create new content
- `PUT /api/admin/content/:id` - Update content

### Orders
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## Customization

### Adding New Content Sections
1. Edit `admin-content.tsx`
2. Add new content keys to `DEFAULT_CONTENT_SECTIONS`
3. Update your website components to use the new content

### Styling
- The admin interface uses Tailwind CSS
- Customize colors and styling in `tailwind.config.js`
- Modify component styles in individual page files

### Adding New Features
- Create new admin pages in `client/src/pages/`
- Add corresponding API endpoints in `server/routes.ts`
- Update the database schema in `shared/schema.ts`

## Troubleshooting

### Common Issues

**Admin login not working:**
- Check if admin user was created: `npm run setup-admin`
- Verify JWT_SECRET is set in environment variables
- Check database connection

**Products not loading:**
- Verify database schema is up to date: `npm run db:push`
- Check server logs for database errors
- Ensure products table has data

**Content changes not visible:**
- Check if content is marked as "Active"
- Verify content keys match between admin and website
- Clear browser cache

### Getting Help
- Check server console for error messages
- Verify database connection and schema
- Ensure all environment variables are set
- Check browser console for frontend errors

## Security Best Practices

1. **Change Default Password:** Immediately change admin123 after setup
2. **Use Strong JWT Secret:** Generate a secure random string for JWT_SECRET
3. **HTTPS in Production:** Always use HTTPS for admin access
4. **Regular Backups:** Backup your database regularly
5. **Monitor Access:** Check admin login logs for suspicious activity
6. **Update Dependencies:** Keep npm packages updated

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
```

### Build Commands
```bash
npm run build
npm start
```

### Database Setup
```bash
npm run db:push
npm run setup-admin
```

## Support
For technical support or feature requests, please contact your development team or create an issue in the project repository.

---

**Happy Growing! 🌱** Your cannabis business is now fully manageable through this powerful admin interface.
