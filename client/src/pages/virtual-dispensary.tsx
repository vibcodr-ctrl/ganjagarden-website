import React, { useState, useEffect } from 'react';
import ChatSelection from '../components/chat-selection';
import AIChat from '../components/ai-chat';
import AdminChat from '../components/admin-chat';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useLocation } from 'wouter';

type ChatMode = 'selection' | 'ai' | 'admin';

export default function VirtualDispensary() {
  const [chatMode, setChatMode] = useState<ChatMode>('selection');
  const [location, setLocation] = useLocation();

  // Check URL parameters for chat type
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatType = urlParams.get('chat');
    if (chatType === 'ai' || chatType === 'admin') {
      setChatMode(chatType);
    }
  }, []);

  const handleSelectChat = (chatType: 'ai' | 'admin') => {
    setChatMode(chatType);
  };

  const handleBackToSelection = () => {
    setChatMode('selection');
    // Remove the chat parameter from URL
    setLocation('/virtual-dispensary');
  };

  const handleBackToHome = () => {
    setLocation('/');
  };

  const renderContent = () => {
    switch (chatMode) {
      case 'selection':
        return <ChatSelection onSelectChat={handleSelectChat} />;
      case 'ai':
        return <AIChat onBack={handleBackToSelection} />;
      case 'admin':
        return <AdminChat onBack={handleBackToSelection} />;
      default:
        return <ChatSelection onSelectChat={handleSelectChat} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToHome}
                className="flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
              
              {chatMode !== 'selection' && (
                <Button
                  variant="ghost"
                  onClick={handleBackToSelection}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Chat Selection</span>
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                {chatMode === 'selection' && 'Choose Your Chat'}
                {chatMode === 'ai' && 'AI Plant Care Assistant'}
                {chatMode === 'admin' && 'Direct Admin Chat'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>🌿 GanjaGarden Virtual Dispensary - Professional Cannabis Plant Care Support</p>
            <p className="mt-1">
              {chatMode === 'ai' && 'Powered by advanced AI technology for instant plant diagnosis and care advice'}
              {chatMode === 'admin' && 'Direct human support for special orders and personalized assistance'}
              {chatMode === 'selection' && 'Choose between AI-powered assistance or direct human support'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
