# 🌿 GanjaGarden - Premium Cannabis Business Website

A modern, full-stack cannabis business website built with React, TypeScript, and Node.js. Features a complete admin interface, e-commerce functionality, and AI-powered customer support.

![GanjaGarden Preview](https://images.pexels.com/photos/606506/pexels-photo-606506.jpeg?auto=compress&cs=tinysrgb&w=800&h=600)

## ✨ Features

### 🛍️ **E-commerce Platform**
- **Product Catalog**: Cannabis cuttings and seedlings with detailed strain information
- **Shopping Cart**: Full cart functionality with persistent state
- **Order Management**: Complete order processing and fulfillment system
- **Pickup Locations**: Secure pickup hotspots with location management

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Built with Radix UI primitives and custom components
- **Animations**: Smooth transitions and micro-interactions with Framer Motion
- **Professional Aesthetic**: Clean, modern design perfect for cannabis businesses

### 🔐 **Admin Dashboard**
- **Content Management**: Edit website content without touching code
- **Product Management**: Add, edit, and delete products with image uploads
- **Order Tracking**: Monitor customer orders and manage fulfillment
- **Analytics**: Business insights and performance metrics
- **User Management**: Role-based access control for admin users

### 🤖 **AI Integration**
- **Customer Support**: Google Gemini AI-powered chat assistant
- **Knowledge Base**: Comprehensive product and business information
- **Smart Recommendations**: AI-driven product suggestions
- **24/7 Support**: Automated customer service capabilities

### 🚀 **Technical Features**
- **TypeScript**: Full type safety and better development experience
- **Modern Stack**: React 18, Vite, Tailwind CSS, Drizzle ORM
- **Database**: SQLite with automatic migrations
- **Authentication**: JWT-based security system
- **File Uploads**: Image management for products and content

## 🏗️ Architecture

```
GanjaGarden/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions and configurations
├── server/                 # Node.js backend API
│   ├── routes/            # API endpoint definitions
│   ├── services/          # Business logic and external services
│   ├── middleware/        # Express middleware
│   └── db.ts             # Database connection and setup
├── shared/                 # Shared types and schemas
│   └── schema.ts         # Database schema definitions
└── migrations/            # Database migration files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vibcodr-ctrl/ganjagarden-website.git
   cd ganjagarden-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   npm run setup-admin
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access your website**
   - **Frontend**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin/login
     - Username: `admin`
     - Password: `admin123`

## 📚 Available Scripts

```bash
npm run dev          # Start development server
npm run dev-db       # Start server with database
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push database schema
npm run setup-admin  # Create admin user
```

## 🎯 Use Cases

### **Cannabis Dispensaries**
- Showcase products with professional photography
- Manage inventory and track sales
- Provide customer education and support

### **Cannabis Nurseries**
- Display available cuttings and seedlings
- Share growing information and care tips
- Manage customer orders and fulfillment

### **Cannabis Consultants**
- Professional business presentation
- Knowledge base for client education
- Lead generation and contact management

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key_here
GOOGLE_API_KEY=your_google_generative_ai_key
```

### Database
The application uses SQLite by default, but can be configured for PostgreSQL:

```typescript
// server/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
```

## 🎨 Customization

### **Branding**
- Update colors in `tailwind.config.ts`
- Modify hero images and content
- Customize business information

### **Content**
- Edit website text through admin panel
- Add your own product images
- Customize pickup locations

### **Features**
- Add new product categories
- Implement additional payment methods
- Integrate with external services

## 📱 Responsive Design

The website is fully responsive and optimized for:
- 📱 Mobile devices
- 💻 Desktop computers
- 🖥️ Tablets
- 📺 Large displays

## 🔒 Security Features

- **JWT Authentication**: Secure admin access
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Drizzle ORM with parameterized queries
- **File Upload Security**: Multer middleware with file type validation
- **HTTPS Ready**: Production-ready security configurations

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

### **Netlify**
```bash
npm run build
# Upload dist/public folder to Netlify
```

### **Traditional Hosting**
```bash
npm run build
# Upload dist/ folder to your server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `ADMIN_SETUP.md` and `CONTENT_MANAGEMENT_GUIDE.md` files
- **Issues**: Report bugs and feature requests on GitHub
- **Questions**: Open a discussion for general questions

## 🙏 Acknowledgments

- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Drizzle ORM](https://orm.drizzle.team/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

**🌿 Built with ❤️ for the cannabis community**

*This project is for educational and business purposes. Please ensure compliance with local cannabis regulations.*
