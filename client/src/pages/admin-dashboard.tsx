import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Image, 
  Settings, 
  LogOut,
  TrendingUp,
  DollarSign,
  Eye,
  MapPin
} from 'lucide-react';
import { useLocation } from 'wouter';

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      setLocation('/admin/login');
      return;
    }

    try {
      setAdminUser(JSON.parse(user));
      fetchDashboardStats();
    } catch (error) {
      console.error('Error parsing admin user:', error);
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (productsRes.ok && ordersRes.ok) {
        const products = await productsRes.json();
        const orders = await ordersRes.json();
        
        const totalRevenue = orders.reduce((sum: number, order: any) => 
          sum + parseFloat(order.total), 0
        );

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalCustomers: new Set(orders.map((order: any) => order.customerEmail)).size,
          totalRevenue
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setLocation('/admin/login');
  };

  const navigationItems = [
    {
      title: 'Products',
      description: 'Manage your cannabis products',
      icon: Package,
      href: '/admin/products',
      color: 'bg-blue-500'
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'bg-green-500'
    },
    {
      title: 'Content',
      description: 'Edit website content and sections',
      icon: FileText,
      href: '/admin/content',
      color: 'bg-purple-500'
    },
    {
      title: 'Locations',
      description: 'Manage pickup locations and hotspots',
      icon: MapPin,
      href: '/admin/locations',
      color: 'bg-teal-500'
    },
    {
      title: 'Knowledge Base',
      description: 'Manage AI training data and plant care information',
      icon: TrendingUp,
      href: '/admin/knowledge-base',
      color: 'bg-emerald-500'
    },
    {
      title: 'API Usage',
      description: 'Monitor AI and search API costs and limits',
      icon: DollarSign,
      href: '/admin/api-usage',
      color: 'bg-purple-500'
    },
    {
      title: 'Images',
      description: 'Manage product and website images',
      icon: Image,
      href: '/admin/images',
      color: 'bg-orange-500'
    },
    {
      title: 'Customers',
      description: 'View customer information',
      icon: Users,
      href: '/admin/customers',
      color: 'bg-indigo-500'
    },
    {
      title: 'Settings',
      description: 'Configure your business settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">GanjaGarden Admin</h1>
              <Badge variant="secondary" className="ml-3">
                {adminUser?.role}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {adminUser?.username}
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Available for sale
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Customer orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Unique customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                All time sales
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationItems.map((item) => (
              <Card 
                key={item.title}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setLocation(item.href)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-3`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Recent Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View your latest customer orders and manage fulfillment
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setLocation('/admin/orders')}
              >
                View Orders
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Website Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                See how your changes look to customers
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.open('/', '_blank')}
              >
                Preview Site
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
