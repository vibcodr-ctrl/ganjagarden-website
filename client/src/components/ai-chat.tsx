import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Send, 
  Image as ImageIcon, 
  X, 
  Bot, 
  User, 
  Search, 
  Leaf,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  images?: string[];
  metadata?: {
    confidence?: number;
    recommendations?: string[];
    needsSearch?: boolean;
    searchQuery?: string;
  };
}

interface AIChatProps {
  onBack: () => void;
}

export default function AIChat({ onBack }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Hello! I\'m your AI Plant Care Assistant. I can help you diagnose plant problems, provide care tips, and answer questions about cannabis cultivation. You can upload photos of your plants for analysis or just ask me questions!',
      timestamp: new Date(),
      metadata: {}
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length + selectedImages.length > 5) {
      setError('Maximum 5 images allowed per message');
      return;
    }

    setSelectedImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && selectedImages.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      images: imagePreviewUrls
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsLoading(true);
    setError(null);

    try {
      // Create chat session if not exists
      let sessionId = localStorage.getItem('aiChatSessionId');
      if (!sessionId) {
        const sessionResponse = await fetch('/api/chat/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatType: 'ai' })
        });
        
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          sessionId = sessionData.sessionId;
          localStorage.setItem('aiChatSessionId', sessionId);
        }
      }

      // Send message to AI
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('message', inputMessage.trim() || 'Please analyze this image');
      formData.append('language', 'de'); // Default to German
      
      selectedImages.forEach(image => {
        formData.append('images', image);
      });

      const response = await fetch('/api/chat/ai/message', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: data.aiResponse,
          timestamp: new Date(),
          metadata: data.metadata
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Show search results if available
        if (data.searchResults) {
          setSearchResults(data.searchResults.results || []);
        }
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to get AI response. Please try again.');
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (message: string, images: string[]): Promise<Message> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    let content = '';
    let confidence = 0;
    let recommendations: string[] = [];
    let needsSearch = false;
    let searchQuery = '';

    if (images.length > 0) {
      // Simulate image analysis
      content = `I've analyzed your plant image. Based on what I can see, this appears to be a healthy cannabis plant in the vegetative stage. The leaves show good color and structure.

**Analysis:**
- Plant appears healthy with no visible disease or pest issues
- Leaf color is appropriate for this growth stage
- Good spacing between nodes indicates proper lighting

**Recommendations:**
- Continue current care routine
- Ensure adequate watering (check soil moisture before watering)
- Maintain proper lighting schedule (18/6 for vegetative growth)
- Monitor for any changes in leaf color or texture

**Confidence Level:** 85%

If you have specific concerns or notice any changes, please let me know and I can provide more targeted advice.`;
      
      confidence = 85;
      recommendations = [
        'Continue current care routine',
        'Ensure adequate watering',
        'Maintain proper lighting schedule',
        'Monitor for changes'
      ];
      needsSearch = false;
    } else {
      // Simulate text-based response
      content = `Thank you for your question about cannabis plant care! I'd be happy to help you with that.

Based on your query, here are some general tips:
- Always use well-draining soil
- Monitor pH levels (6.0-7.0 for soil, 5.5-6.5 for hydroponics)
- Provide adequate ventilation
- Start with lower nutrient concentrations and increase gradually

If you have a specific problem or need more detailed advice, feel free to upload a photo of your plant or ask a more specific question. I'm here to help!`;
      
      confidence = 90;
      recommendations = [
        'Use well-draining soil',
        'Monitor pH levels',
        'Provide adequate ventilation',
        'Start with lower nutrient concentrations'
      ];
      needsSearch = false;
    }

    return {
      id: Date.now().toString(),
      role: 'ai',
      content,
      timestamp: new Date(),
      metadata: {
        confidence,
        recommendations,
        needsSearch,
        searchQuery
      }
    };
  };

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate search results
      const mockResults = [
        {
          title: 'Cannabis Plant Care Guide',
          snippet: 'Comprehensive guide to growing healthy cannabis plants...',
          link: '#',
          relevance: 95
        },
        {
          title: 'Common Cannabis Plant Problems',
          snippet: 'Learn to identify and treat common issues...',
          link: '#',
          relevance: 88
        }
      ];
      
      setSearchResults(mockResults);
    } catch (err) {
      setError('Failed to search for additional information');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <X className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">AI Plant Care Assistant</h1>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          AI Powered
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-forest-green text-white' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-forest-green text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Image Display */}
                    {message.images && message.images.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Plant image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-white"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Message Metadata */}
                  {message.metadata && (
                    <div className="mt-2 space-y-2">
                      {message.metadata.confidence && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4" />
                          <span>Confidence: {message.metadata.confidence}%</span>
                        </div>
                      )}
                      
                      {message.metadata.recommendations && message.metadata.recommendations.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h4 className="font-medium text-green-800 mb-2">Recommendations:</h4>
                          <ul className="space-y-1">
                            {message.metadata.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-green-700 flex items-center space-x-2">
                                <Leaf className="w-3 h-3" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`text-xs text-gray-400 mt-2 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Analyzing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="px-6 pb-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Search className="w-5 h-5 text-blue-600" />
                <span>Additional Information Found</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {searchResults.map((result, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-900">{result.title}</h4>
                  <p className="text-sm text-gray-600">{result.snippet}</p>
                  <a href={result.link} className="text-sm text-blue-600 hover:underline">
                    Read more →
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="px-6 pb-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t p-6">
        <div className="space-y-4">
          {/* Image Preview */}
          {imagePreviewUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Input and Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Add Photo
            </Button>
            
            <div className="flex-1 flex space-x-3">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your plant problem or ask a question..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || (!inputMessage.trim() && selectedImages.length === 0)}
                className="bg-forest-green hover:bg-forest-green/90 text-white px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            You can upload up to 5 images per message. Supported formats: JPEG, PNG, WebP (max 5MB each)
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
    </div>
  );
}
