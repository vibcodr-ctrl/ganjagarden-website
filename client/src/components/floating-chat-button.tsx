import React, { useState } from 'react';
import { Button } from './ui/button';
import { MessageCircle, X, Bot, Users } from 'lucide-react';
import { useLocation } from 'wouter';

export default function FloatingChatButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [, setLocation] = useLocation();

  const handleChatTypeSelect = (chatType: 'ai' | 'admin') => {
    setLocation(`/virtual-dispensary?chat=${chatType}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="rounded-full h-16 w-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl p-4 w-80 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">🌿 Virtual Dispensary</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => handleChatTypeSelect('ai')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 justify-start"
            >
              <Bot className="w-5 h-5 mr-3" />
              AI Plant Care Assistant
            </Button>
            
            <Button
              onClick={() => handleChatTypeSelect('admin')}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 justify-start"
            >
              <Users className="w-5 h-5 mr-3" />
              Chat with Admin
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Get instant help with your cannabis plants
          </p>
        </div>
      )}
    </div>
  );
}
