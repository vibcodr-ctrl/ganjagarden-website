# Overview

This is a cannabis e-commerce application called "GreenLeaf Cannabis" that specializes in selling premium cannabis cuttings and seedlings. The application is built as a full-stack web application with a React frontend and Node.js/Express backend, designed for professional growers looking to purchase high-quality cannabis plants with delivery or pickup options.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: React Context for cart functionality and React Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **UI Components**: Radix UI primitives with custom styling for accessible, professional interface

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with endpoints for products, orders, and contact forms
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Validation**: Zod schemas shared between frontend and backend for consistent data validation
- **Development**: Hot reloading with Vite integration for seamless development experience

## Database Schema Design
The application uses Drizzle ORM with PostgreSQL dialect and includes tables for:
- **Products**: Cannabis cuttings and seedlings with details like strain, genetics, pricing, and inventory
- **Orders**: Customer orders with delivery/pickup options and status tracking
- **Order Items**: Individual products within orders with quantities and pricing
- **Users**: Basic user management structure
- **Contacts**: Customer inquiries and contact form submissions

## Key Features
- **Product Catalog**: Separate categories for cuttings and seedlings with detailed product information
- **Shopping Cart**: Persistent cart with quantity management and stock validation
- **Checkout Process**: Form-based ordering with safe delivery/pickup options
- **Pickup Locations**: Comprehensive list of secure pickup hotspots with detailed location information
- **Anonymous Chat**: Real-time customer support chat with complete anonymity and privacy protection
- **Contact System**: Customer inquiry forms with order type specification
- **Safety-Focused Design**: Emphasis on safe meeting locations and customer security
- **Responsive Design**: Mobile-first design with smooth scrolling navigation

# External Dependencies

## Database & ORM
- **Neon Database**: PostgreSQL hosting service configured via DATABASE_URL
- **Drizzle ORM**: Type-safe database operations with code-first schema definition
- **Drizzle Kit**: Database migrations and schema management tools

## UI & Styling
- **Radix UI**: Comprehensive component library for accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom color scheme
- **Lucide React**: Icon library for consistent iconography throughout the application

## Development & Build Tools
- **Vite**: Frontend build tool with React plugin and development server
- **TypeScript**: Static typing for both frontend and backend code
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment plugins for Replit platform

## Form & Validation
- **React Hook Form**: Performance-focused form library with validation
- **Zod**: TypeScript-first schema validation library
- **@hookform/resolvers**: Integration layer between React Hook Form and Zod

## Additional Services
- **TanStack React Query**: Server state management and caching
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Utility for creating variant-based component APIs