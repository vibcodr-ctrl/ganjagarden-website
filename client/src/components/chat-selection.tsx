import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Bot, Users, MessageCircle, Leaf, ShoppingCart } from 'lucide-react';

interface ChatSelectionProps {
  onSelectChat: (chatType: 'ai' | 'admin') => void;
}

export default function ChatSelection({ onSelectChat }: ChatSelectionProps) {
  const [selectedType, setSelectedType] = useState<'ai' | 'admin' | null>(null);

  const handleSelect = (chatType: 'ai' | 'admin') => {
    setSelectedType(chatType);
    onSelectChat(chatType);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🌿 Virtual Dispensary Chat
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose how you'd like to get help with your cannabis plants or place special orders
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* AI Plant Care Assistant */}
        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedType === 'ai' ? 'ring-2 ring-forest-green ring-opacity-50' : ''
          }`}
          onClick={() => handleSelect('ai')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-900">AI Plant Care Assistant</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Get instant help with plant problems, care tips, and expert advice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Leaf className="w-5 h-5 text-forest-green" />
                <span className="text-gray-700">Upload photos for plant diagnosis</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-forest-green" />
                <span className="text-gray-700">Get instant care recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <Bot className="w-5 h-5 text-forest-green" />
                <span className="text-gray-700">AI-powered problem solving</span>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg"
                onClick={() => handleSelect('ai')}
              >
                Start AI Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Direct Admin Chat */}
        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedType === 'admin' ? 'ring-2 ring-forest-green ring-opacity-50' : ''
          }`}
          onClick={() => handleSelect('admin')}
        >
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-forest-green to-sage-green rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-900">Direct Admin Chat</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Chat directly with our team for special orders and personalized service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-5 h-5 text-forest-green" />
                <span className="text-gray-700">Place special orders (bulk, custom strains)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-forest-green" />
                <span className="text-gray-700">Get personalized recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-forest-green" />
                <span className="text-gray-700">Direct human support</span>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-forest-green to-sage-green hover:from-forest-green/90 hover:to-sage-green/90 text-white py-3 text-lg"
                onClick={() => handleSelect('admin')}
              >
                Chat with Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Why Choose Our Virtual Dispensary?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Expert Knowledge</h3>
            <p className="text-gray-600 text-sm">
              AI trained on cannabis-specific care and our expert knowledge base
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">
              Get help anytime with our AI assistant or schedule admin consultations
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Custom Orders</h3>
            <p className="text-gray-600 text-sm">
              Special requests, bulk orders, and custom strain requirements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
