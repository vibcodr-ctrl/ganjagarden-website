import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Shield } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export default function AnonymousChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to GreenLeaf Cannabis. How can we help you today? This chat is completely anonymous - no personal information is stored.',
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionId] = useState(() => `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate support response (in real implementation, this would connect to your chat system)
    setTimeout(() => {
      const responses = [
        "Thanks for your message! Someone from our team will respond shortly.",
        "We appreciate your interest in our products. What specific information can we provide?",
        "Our team is here to help with any questions about our cuttings and seedlings.",
        "Feel free to ask about our delivery options, pickup locations, or product availability."
      ];
      
      const supportMessage: Message = {
        id: `support_${Date.now()}`,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'support',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, supportMessage]);
    }, 1000 + Math.random() * 2000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-forest-green hover:bg-sage-green text-white rounded-full w-14 h-14 shadow-lg transition-all duration-300"
          data-testid="button-chat-toggle"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 z-50">
          <Card className="h-full flex flex-col shadow-2xl">
            <CardHeader className="bg-forest-green text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Anonymous Chat</h3>
                  <p className="text-xs text-green-100 flex items-center">
                    <Shield size={12} className="mr-1" />
                    Completely private & secure
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-sage-green"
                  data-testid="button-close-chat"
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.sender === 'user'
                          ? 'bg-forest-green text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                      data-testid={`message-${message.id}`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Anonymous Notice */}
              <div className="px-4 py-2 bg-mint-green border-t">
                <p className="text-xs text-forest-green">
                  🔒 Session ID: {sessionId.slice(-8)} • No personal data stored
                </p>
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                    data-testid="input-chat-message"
                  />
                  <Button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-forest-green hover:bg-sage-green text-white"
                    data-testid="button-send-message"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}