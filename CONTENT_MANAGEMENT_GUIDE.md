# 🌿 GanjaGarden Content Management Guide

## 🎯 Overview
Your GanjaGarden website now has a comprehensive content management system that allows you to easily edit all text content, manage pickup locations, and customize your business messaging without touching any code.

## 🚀 Accessing the Content Management System

1. **Login to Admin Panel**: Go to `http://localhost:5000/admin/login`
2. **Credentials**: Username: `admin`, Password: `admin123`
3. **Navigate to Content**: Click on the **"Content"** tab in the admin dashboard

## 📝 Content Sections You Can Edit

### 🏠 **Hero Section**
- **Hero Title**: Main headline on your homepage
- **Hero Subtitle**: Description below the main headline

### 🌱 **Plant Selection Section**
- **Title**: "Choose Your Plants" section heading
- **Description**: Text explaining your plant categories

### ✂️ **Featured Cuttings Section**
- **Title**: "Featured Cuttings" section heading
- **Description**: Text describing your cutting varieties

### 🌱 **Premium Seedlings Section**
- **Title**: "Premium Seedlings" section heading
- **Description**: Text describing your seedling varieties

### 🏆 **Why Choose GreenLeaf Section**
- **Main Title**: "Why Choose GreenLeaf?" heading
- **Subtitle**: Professional quality, reliable delivery, expert support
- **Feature 1**: Premium Genetics title and description
- **Feature 2**: Safe & Flexible Delivery title and description
- **Feature 3**: Expert Support title and description

### 🛡️ **Safety Section**
- **Main Title**: "Your Safety is Our Priority"
- **Description**: Overview of safety measures
- **Choose Location**: Title and description for location flexibility
- **Pickup Hotspots**: Title and description for secure locations
- **Professional**: Title and description for professional conduct

### 🚚 **Delivery Options Section**
- **Title**: "Delivery Options" heading
- **Safe Location Delivery**: Title and description
- **Pickup Hotspots**: Title and description
- **Location List**: Bullet points of pickup locations
- **Priority Message**: Safety commitment message

### 📍 **Pickup Locations Section**
- **Title**: "Secure Pickup Locations" heading
- **Description**: Overview of pickup network
- **Location List**: **Special Editor** - See below for details

### 🔄 **Location Flexibility Section**
- **Title**: "Need a Different Location?" heading
- **Description**: Flexibility explanation
- **Button Text**: "Suggest a Location" button
- **Message**: Safety commitment
- **Benefits**: Three benefit titles and descriptions

## 🗺️ **Special: Pickup Locations Editor**

The pickup locations section has a special editor that allows you to:

### **Access the Editor**
- Look for the **"Edit Locations"** button on the `pickup_locations_list` content item
- Or use the **"Manage Pickup Locations"** button in the header

### **What You Can Edit**
For each location, you can modify:
- **Location Name**: e.g., "Downtown Mall Plaza"
- **District**: e.g., "Downtown"
- **Specific Spot**: e.g., "Level 2 Parking - West Side"
- **Hours**: e.g., "9AM - 9PM"
- **Notes**: e.g., "Near the main entrance, well-lit area with security cameras"
- **Popular Badge**: Toggle to mark locations as popular

### **Adding New Locations**
- Click **"Add New Location"** button
- Fill in all the details
- Save to add to your network

### **Removing Locations**
- Click **"Remove Location"** button on any location card
- Confirm the removal

## ✏️ **How to Edit Content**

### **Basic Text Editing**
1. Find the content section you want to edit
2. Click the **"Edit"** button
3. Modify the content in the form
4. Click **"Update Content"** to save

### **Content Types**
- **Text**: Plain text content
- **HTML**: HTML-formatted content (for advanced users)
- **JSON**: Structured data (used for pickup locations)

### **Content Status**
- **Active**: Content is visible on your website
- **Inactive**: Content is hidden from your website
- Toggle using the switch on each content card

## 🎨 **Content Organization**

### **Order Index**
- Each content section has an order number
- Lower numbers appear first on your website
- You can adjust the order by changing the order index

### **Content Keys**
- Each section has a unique key (e.g., `hero_title`, `about_content`)
- These keys are used by the website to display content
- **Don't change the keys** unless you know what you're doing

## 🔍 **Preview Your Changes**

### **Live Preview**
- Click **"Preview"** button on any content section
- Opens your website in a new tab
- See how your changes look in real-time

### **Real-time Updates**
- Changes are saved immediately to the database
- Refresh your website to see updates
- No need to restart the server

## 💡 **Best Practices**

### **Content Guidelines**
- Keep titles concise and engaging
- Descriptions should be clear and informative
- Use consistent tone and branding
- Test content length on different screen sizes

### **Pickup Location Tips**
- Use clear, recognizable location names
- Provide specific pickup spots
- Include relevant safety information in notes
- Mark popular locations appropriately

### **Safety & Trust**
- Emphasize safety and discretion
- Use professional, trustworthy language
- Highlight your commitment to customer privacy
- Be specific about security measures

## 🚨 **Troubleshooting**

### **Content Not Updating**
- Check if the content is marked as "Active"
- Verify the order index is correct
- Refresh your website after making changes

### **Pickup Locations Not Saving**
- Ensure you're editing the correct content section
- Check that the content type is "JSON"
- Verify all required fields are filled

### **Admin Access Issues**
- Clear browser cache and cookies
- Check if you're logged in with correct credentials
- Restart the server if needed

## 📞 **Need Help?**

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your admin login credentials
3. Ensure the server is running on port 5000
4. Check that the database is properly set up

## 🎉 **Getting Started**

1. **Login** to your admin panel
2. **Browse** the content sections to see what's available
3. **Start editing** with the hero section to get familiar
4. **Customize** your pickup locations using the special editor
5. **Preview** your changes to see the results
6. **Save** and publish your updated content

Your website will now reflect all your customizations and business messaging! 🌿✨
