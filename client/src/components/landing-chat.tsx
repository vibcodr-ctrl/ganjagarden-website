import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Bot, MessageCircle, Users, Shield, Clock, Leaf, ShoppingCart, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

interface LandingChatProps {
  className?: string;
}

export default function LandingChat({ className }: LandingChatProps) {
  const [selectedChatType, setSelectedChatType] = useState<'ai' | 'admin' | null>(null);
  const [, setLocation] = useLocation();

  const handleStartChat = (chatType: 'ai' | 'admin') => {
    setSelectedChatType(chatType);
    // Navigate to virtual dispensary with the selected chat type
    setLocation(`/virtual-dispensary?chat=${chatType}`);
  };

  return (
    <section className={`py-16 bg-gradient-to-b from-green-50 to-white ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-900 mb-4">
            🌿 Welcome to Our Virtual Dispensary
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Get personalized advice from our expert budtender. Ask about strains, growing tips, or get recommendations tailored to your needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* AI Plant Care Assistant */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">AI Plant Care Assistant</CardTitle>
              <CardDescription className="text-gray-600">
                Get instant help with plant problems, care tips, and expert advice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Upload photos for plant diagnosis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Get instant care recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Bot className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">AI-powered problem solving</span>
                </div>
              </div>
              <Button 
                onClick={() => handleStartChat('ai')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg font-semibold"
              >
                Start AI Chat <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Direct Admin Chat */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Direct Admin Chat</CardTitle>
              <CardDescription className="text-gray-600">
                Chat directly with our team for special orders and personalized service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Place special orders (bulk, custom strains)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-cyan-600" />
                  <span className="text-gray-700">Get personalized recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Direct human support</span>
                </div>
              </div>
              <Button 
                onClick={() => handleStartChat('admin')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 text-lg font-semibold"
              >
                Chat with Admin <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-900 mb-8">
            Why Choose Our Virtual Dispensary?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-green-900 mb-2">Expert Knowledge</h4>
              <p className="text-gray-700">AI trained on cannabis-specific care and our expert knowledge base.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-green-900 mb-2">24/7 Support</h4>
              <p className="text-gray-700">Get help anytime with our AI assistant or schedule admin consultations.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-green-900 mb-2">Custom Orders</h4>
              <p className="text-gray-700">Special requests, bulk orders, and custom strain requirements.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
