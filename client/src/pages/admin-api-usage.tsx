import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Bot,
  Search,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useLocation } from 'wouter';

interface ApiUsage {
  daily: {
    tokens: number;
    cost: number;
    searches: number;
  };
  monthly: {
    tokens: number;
    cost: number;
    searches: number;
  };
  limits: {
    dailyTokens: number;
    monthlyTokens: number;
    dailySearches: number;
    monthlySearches: number;
  };
}

export default function AdminApiUsage() {
  const [usage, setUsage] = useState<ApiUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    checkAuth();
    fetchApiUsage();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/admin/login');
    }
  };

  const fetchApiUsage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/api-usage', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsage(data);
        setLastUpdated(new Date());
      } else {
        setError('Failed to fetch API usage data');
      }
    } catch (error) {
      setError('Error fetching API usage data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('de-DE').format(num);
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return 'Critical';
    if (percentage >= 75) return 'High';
    if (percentage >= 50) return 'Moderate';
    return 'Low';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API usage data...</p>
        </div>
      </div>
    );
  }

  if (!usage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load data</h3>
          <p className="text-gray-600 mb-4">
            {error || 'Unable to fetch API usage information'}
          </p>
          <Button onClick={fetchApiUsage}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
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
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/admin')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">API Usage Monitoring</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={fetchApiUsage} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Daily Tokens */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily AI Tokens</CardTitle>
              <Bot className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(usage.daily.tokens)}
              </div>
              <p className="text-xs text-muted-foreground">
                of {formatNumber(usage.limits.dailyTokens)} limit
              </p>
              <Progress 
                value={getUsagePercentage(usage.daily.tokens, usage.limits.dailyTokens)} 
                className="mt-2"
              />
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs font-medium ${getUsageColor(getUsagePercentage(usage.daily.tokens, usage.limits.dailyTokens))}`}>
                  {getUsageStatus(getUsagePercentage(usage.daily.tokens, usage.limits.dailyTokens))}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(getUsagePercentage(usage.daily.tokens, usage.limits.dailyTokens))}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Tokens */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly AI Tokens</CardTitle>
              <Bot className="w-4 h-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {formatNumber(usage.monthly.tokens)}
              </div>
              <p className="text-xs text-muted-foreground">
                of {formatNumber(usage.limits.monthlyTokens)} limit
              </p>
              <Progress 
                value={getUsagePercentage(usage.monthly.tokens, usage.limits.monthlyTokens)} 
                className="mt-2"
              />
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs font-medium ${getUsageColor(getUsagePercentage(usage.monthly.tokens, usage.limits.monthlyTokens))}`}>
                  {getUsageStatus(getUsagePercentage(usage.monthly.tokens, usage.limits.monthlyTokens))}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(getUsagePercentage(usage.monthly.tokens, usage.limits.monthlyTokens))}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Daily Searches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Searches</CardTitle>
              <Search className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {usage.daily.searches}
              </div>
              <p className="text-xs text-muted-foreground">
                of {usage.limits.dailySearches} limit
              </p>
              <Progress 
                value={getUsagePercentage(usage.daily.searches, usage.limits.dailySearches)} 
                className="mt-2"
              />
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs font-medium ${getUsageColor(getUsagePercentage(usage.daily.searches, usage.limits.dailySearches))}`}>
                  {getUsageStatus(getUsagePercentage(usage.daily.searches, usage.limits.dailySearches))}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(getUsagePercentage(usage.daily.searches, usage.limits.dailySearches))}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Searches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Searches</CardTitle>
              <Search className="w-4 h-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">
                {usage.monthly.searches}
              </div>
              <p className="text-xs text-muted-foreground">
                of {usage.limits.monthlySearches} limit
              </p>
              <Progress 
                value={getUsagePercentage(usage.monthly.searches, usage.limits.monthlySearches)} 
                className="mt-2"
              />
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs font-medium ${getUsageColor(getUsagePercentage(usage.monthly.searches, usage.limits.monthlySearches))}`}>
                  {getUsageStatus(getUsagePercentage(usage.monthly.searches, usage.limits.monthlySearches))}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(getUsagePercentage(usage.monthly.searches, usage.limits.monthlySearches))}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Daily Costs</span>
              </CardTitle>
              <CardDescription>
                AI and search API costs for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AI Processing</span>
                  <span className="font-medium">
                    {formatCurrency(usage.daily.cost * 0.8)} {/* Estimate 80% of cost is AI */}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Search Queries</span>
                  <span className="font-medium">
                    {formatCurrency(usage.daily.cost * 0.2)} {/* Estimate 20% of cost is search */}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Daily Cost</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(usage.daily.cost)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Monthly Costs</span>
              </CardTitle>
              <CardDescription>
                AI and search API costs for this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AI Processing</span>
                  <span className="font-medium">
                    {formatCurrency(usage.monthly.cost * 0.8)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Search Queries</span>
                  <span className="font-medium">
                    {formatCurrency(usage.monthly.cost * 0.2)}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Monthly Cost</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(usage.monthly.cost)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Alerts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Usage Alerts</h2>
          
          {/* Daily Token Alert */}
          {getUsagePercentage(usage.daily.tokens, usage.limits.dailyTokens) >= 75 && (
            <Alert className={getUsagePercentage(usage.daily.tokens, usage.limits.dailyTokens) >= 90 ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Daily AI Token Usage:</strong> You've used {Math.round(getUsagePercentage(usage.daily.tokens, usage.limits.dailyTokens))}% of your daily limit. 
                {getUsagePercentage(usage.daily.tokens, usage.limits.dailyTokens) >= 90 && ' Consider upgrading your plan or reducing usage.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Monthly Token Alert */}
          {getUsagePercentage(usage.monthly.tokens, usage.limits.monthlyTokens) >= 75 && (
            <Alert className={getUsagePercentage(usage.monthly.tokens, usage.limits.monthlyTokens) >= 90 ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Monthly AI Token Usage:</strong> You've used {Math.round(getUsagePercentage(usage.monthly.tokens, usage.limits.monthlyTokens))}% of your monthly limit.
                {getUsagePercentage(usage.monthly.tokens, usage.limits.monthlyTokens) >= 90 && ' Consider upgrading your plan or reducing usage.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Search Usage Alerts */}
          {getUsagePercentage(usage.daily.searches, usage.limits.dailySearches) >= 75 && (
            <Alert className={getUsagePercentage(usage.daily.searches, usage.limits.dailySearches) >= 90 ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Daily Search Usage:</strong> You've used {Math.round(getUsagePercentage(usage.daily.searches, usage.limits.dailySearches))}% of your daily search limit.
                {getUsagePercentage(usage.daily.searches, usage.limits.dailySearches) >= 90 && ' Consider reducing search frequency.'}
              </AlertDescription>
            </Alert>
          )}

          {/* All Good Alert */}
          {getUsagePercentage(usage.daily.tokens, usage.limits.dailyTokens) < 50 && 
           getUsagePercentage(usage.monthly.tokens, usage.limits.monthlyTokens) < 50 &&
           getUsagePercentage(usage.daily.searches, usage.limits.dailySearches) < 50 && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>All Systems Normal:</strong> Your API usage is well within limits. All services are operating normally.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Recommendations */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Usage Recommendations</CardTitle>
              <CardDescription>
                Tips to optimize your API usage and costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">AI Token Optimization</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use specific, concise questions to reduce token usage</li>
                    <li>• Upload clear, focused images for better analysis</li>
                    <li>• Consider batch processing for multiple queries</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Search Optimization</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use targeted search queries</li>
                    <li>• Implement result caching when possible</li>
                    <li>• Monitor search frequency during peak hours</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
