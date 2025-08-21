import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Send, 
  Image as ImageIcon, 
  X, 
  Users, 
  User, 
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  Package
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'admin';
  content: string;
  timestamp: Date;
  images?: string[];
}

interface OrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  requestDetails: string;
  requestedQuantity?: number;
  requestedStrain?: string;
  requestedDate?: string;
}

interface AdminChatProps {
  onBack: () => void;
}

export default function AdminChat({ onBack }: AdminChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'admin',
      content: 'Hello! Welcome to our Direct Admin Chat. I\'m here to help you with special orders, custom requests, bulk purchases, or any questions that need personal attention. Please let me know how I can assist you today!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderRequest>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    requestDetails: ''
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  
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
      let sessionId = localStorage.getItem('adminChatSessionId');
      if (!sessionId) {
        const sessionResponse = await fetch('/api/chat/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatType: 'admin' })
        });
        
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          sessionId = sessionData.sessionId;
          localStorage.setItem('adminChatSessionId', sessionId);
        }
      }

      // Send message to admin
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('message', inputMessage.trim());
      formData.append('customerEmail', orderForm.email || '');
      formData.append('customerName', orderForm.name || '');
      
      selectedImages.forEach(image => {
        formData.append('images', image);
      });

      const response = await fetch('/api/chat/admin/message', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const adminResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'admin',
          content: 'Thank you for your message! An admin will review your request and get back to you soon. You can also use the special order form below for specific product requests.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, adminResponse]);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'admin',
        content: 'I apologize, but I\'m having trouble processing your message right now. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAdminResponse = async (message: string, images: string[]): Promise<Message> => {
    // Simulate response delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let content = '';
    
    if (message.toLowerCase().includes('order') || message.toLowerCase().includes('buy') || message.toLowerCase().includes('purchase')) {
      content = `Thank you for your interest in placing an order! I'd be happy to help you with that. 

To better assist you, could you please provide:
- What type of plants you're looking for (cuttings, seedlings, specific strains)
- Quantity needed
- Any specific requirements or preferences
- Your preferred timeline

You can also use our special order form for more detailed requests. Would you like me to show you that form?`;
    } else if (message.toLowerCase().includes('bulk') || message.toLowerCase().includes('wholesale')) {
      content = `Great question about bulk orders! We do offer wholesale pricing for larger quantities.

For bulk orders, we typically provide:
- Discounted pricing (varies by quantity)
- Custom packaging options
- Flexible delivery arrangements
- Priority customer support

Could you let me know approximately how many plants you're looking for? This will help me give you more specific pricing and availability information.`;
    } else if (images.length > 0) {
      content = `Thank you for sharing those images! I can see what you're working with. 

From what I can observe, this looks like a [describe what you see]. To provide you with the best recommendations, could you tell me:
- What specific issue or question you have?
- What you're trying to achieve?
- Any particular concerns you'd like me to address?

I'm here to help you get the best results with your plants!`;
    } else {
      content = `Thank you for your message! I understand you're looking for assistance with [paraphrase their question].

Let me help you with that. Could you provide a bit more detail about:
- What specific help you need?
- Any particular challenges you're facing?
- What you've already tried?

This will help me give you the most relevant and helpful response.`;
    }

    return {
      id: Date.now().toString(),
      role: 'admin',
      content,
      timestamp: new Date()
    };
  };

  const handleOrderFormChange = (field: keyof OrderRequest, value: string | number) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const handleOrderSubmit = async () => {
    if (!orderForm.customerName || !orderForm.customerEmail || !orderForm.requestDetails) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get or create chat session
      let sessionId = localStorage.getItem('adminChatSessionId');
      if (!sessionId) {
        const sessionResponse = await fetch('/api/chat/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatType: 'admin' })
        });
        
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          sessionId = sessionData.sessionId;
          localStorage.setItem('adminChatSessionId', sessionId);
        }
      }

      // Submit special order
      const response = await fetch('/api/chat/special-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          orderData: orderForm
        })
      });

      if (response.ok) {
        setOrderSubmitted(true);
        setShowOrderForm(false);
        
        // Add confirmation message to chat
        const confirmationMessage: Message = {
          id: Date.now().toString(),
          role: 'admin',
          content: `Perfect! I've received your special order request. Here's what I have:

**Order Summary:**
- Customer: ${orderForm.customerName}
- Email: ${orderForm.customerEmail}
- Phone: ${orderForm.customerPhone || 'Not provided'}
- Request: ${orderForm.requestDetails}
${orderForm.requestedQuantity ? `- Quantity: ${orderForm.requestedQuantity}` : ''}
${orderForm.requestedStrain ? `- Strain: ${orderForm.requestedStrain}` : ''}
${orderForm.requestedDate ? `- Requested Date: ${orderForm.requestedDate}` : ''}

Our team will review your request and contact you within 24 hours to discuss pricing, availability, and delivery options. You'll also receive a confirmation email shortly.

Is there anything else you'd like to discuss while we're here?`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, confirmationMessage]);
        
        // Reset form
        setOrderForm({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          requestDetails: ''
        });
      } else {
        throw new Error('Failed to submit order');
      }
      
    } catch (error) {
      console.error('Error submitting order:', error);
      setError('Failed to submit order. Please try again.');
    } finally {
      setIsLoading(false);
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
            <Users className="w-6 h-6 text-forest-green" />
            <h1 className="text-xl font-semibold text-gray-900">Direct Admin Chat</h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOrderForm(!showOrderForm)}
            className="bg-forest-green hover:bg-forest-green/90 text-white border-forest-green"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Special Order
          </Button>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Human Support
          </Badge>
        </div>
      </div>

      {/* Order Form */}
      {showOrderForm && (
        <div className="bg-gray-50 border-b p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-forest-green" />
                <span>Special Order Request</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={orderForm.customerName}
                    onChange={(e) => handleOrderFormChange('customerName', e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email Address *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={orderForm.customerEmail}
                    onChange={(e) => handleOrderFormChange('customerEmail', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    value={orderForm.customerPhone}
                    onChange={(e) => handleOrderFormChange('customerPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="requestedQuantity">Quantity Needed</Label>
                  <Input
                    id="requestedQuantity"
                    type="number"
                    value={orderForm.requestedQuantity || ''}
                    onChange={(e) => handleOrderFormChange('requestedQuantity', parseInt(e.target.value) || 0)}
                    placeholder="Number of plants"
                  />
                </div>
                <div>
                  <Label htmlFor="requestedStrain">Preferred Strain</Label>
                  <Input
                    id="requestedStrain"
                    value={orderForm.requestedStrain || ''}
                    onChange={(e) => handleOrderFormChange('requestedStrain', e.target.value)}
                    placeholder="e.g., OG Kush, Blue Dream"
                  />
                </div>
                <div>
                  <Label htmlFor="requestedDate">Requested Date</Label>
                  <Input
                    id="requestedDate"
                    type="date"
                    value={orderForm.requestedDate || ''}
                    onChange={(e) => handleOrderFormChange('requestedDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="requestDetails">Order Details *</Label>
                <Textarea
                  id="requestDetails"
                  value={orderForm.requestDetails}
                  onChange={(e) => handleOrderFormChange('requestDetails', e.target.value)}
                  placeholder="Please describe what you're looking for, any specific requirements, special instructions, or questions you have..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleOrderSubmit}
                  disabled={isLoading}
                  className="bg-forest-green hover:bg-forest-green/90 text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Order Request
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowOrderForm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                    : 'bg-green-600 text-white'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
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
                            alt={`Image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-white"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
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
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span className="text-gray-600">Typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

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
                placeholder="Ask about special orders, bulk pricing, custom requests, or any other questions..."
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
            You can upload up to 5 images per message. Our team will respond within 24 hours.
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
