import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Mic, MicOff, Send, User, Bot } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage, ChatSession } from '@shared/schema';

interface ShopAssistantProps {
  className?: string;
}

export default function ShopAssistant({ className }: ShopAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create new chat session
  const createSessionMutation = useMutation({
    mutationFn: () => apiRequest('/api/chat/session', 'POST', {}),
    onSuccess: (session: ChatSession) => {
      setCurrentSessionId(session.id);
      setIsOpen(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start chat session",
        variant: "destructive",
      });
    },
  });

  // Get chat messages for current session
  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/messages', currentSessionId],
    enabled: !!currentSessionId,
    refetchInterval: 2000, // Poll for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => 
      apiRequest(`/api/chat/message`, 'POST', {
        sessionId: currentSessionId,
        content,
        sender: 'customer'
      }),
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages', currentSessionId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat when component opens
  const handleOpenChat = () => {
    if (!currentSessionId) {
      createSessionMutation.mutate();
    } else {
      setIsOpen(true);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && currentSessionId) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Voice input (placeholder for future implementation)
  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    toast({
      title: "Voice Input",
      description: "Voice input feature coming soon!",
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleOpenChat}
            size="lg"
            className="rounded-full h-16 w-16 bg-green-600 hover:bg-green-700 shadow-lg"
            data-testid="button-open-chat"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Shop Assistant Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[90vw]">
          <Card className="bg-white shadow-xl border border-green-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-green-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Shop Assistant</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700">Online</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-green-700 hover:bg-green-100"
                data-testid="button-close-chat"
              >
                ✕
              </Button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-gray-600 mb-2">Welcome to GreenLeaf Cannabis!</p>
                  <p className="text-sm text-gray-500">
                    I'm here to help you find the perfect cannabis plants. 
                    Ask me about strains, growing tips, or our products!
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'customer'
                        ? 'bg-green-600 text-white'
                        : 'bg-white border shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.sender === 'ai' && <Bot className="h-4 w-4 text-green-600" />}
                      {msg.sender === 'admin' && <User className="h-4 w-4 text-blue-600" />}
                      {msg.sender === 'admin' && (
                        <Badge variant="secondary" className="text-xs">
                          Live Support
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap" data-testid={`message-${msg.id}`}>
                      {msg.content}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-white border shadow-sm p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">Assistant is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Ask about strains, growing tips, or our products..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={sendMessageMutation.isPending}
                  data-testid="input-message"
                />
                <Button
                  onClick={toggleVoiceInput}
                  variant="outline"
                  size="sm"
                  className={`p-2 ${isListening ? 'bg-red-100 border-red-300' : ''}`}
                  data-testid="button-voice-input"
                >
                  {isListening ? <MicOff className="h-4 w-4 text-red-600" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Session ID: {currentSessionId?.slice(-8)} • Private & Secure
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}