import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, User, MessageCircle, Clock, Shield } from 'lucide-react';

interface ShopSceneProps {
  className?: string;
}

export default function ShopScene({ className }: ShopSceneProps) {
  return (
    <section className={`py-16 bg-gradient-to-b from-green-50 to-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-900 mb-4">
            Welcome to Our Virtual Dispensary
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized advice from our expert budtender. Ask about strains, growing tips, 
            or get recommendations tailored to your needs.
          </p>
        </div>

        {/* Shop Scene Visualization */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-xl overflow-hidden">
            {/* Shop Interior */}
            <div className="relative">
              {/* Background Scene */}
              <div className="h-80 bg-gradient-to-b from-green-100 to-green-200 relative overflow-hidden">
                {/* Shop Counter */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-800 to-green-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700 via-green-600 to-green-700 opacity-50"></div>
                </div>
                
                {/* Cannabis Plants in Background */}
                <div className="absolute top-8 left-8 w-16 h-20 opacity-30">
                  <img 
                    src="https://images.pexels.com/photos/606506/pexels-photo-606506.jpeg?auto=compress&cs=tinysrgb&w=64&h=80" 
                    alt="Cannabis plant" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="absolute top-12 right-12 w-20 h-24 opacity-20">
                  <img 
                    src="https://images.pexels.com/photos/3536257/pexels-photo-3536257.jpeg?auto=compress&cs=tinysrgb&w=80&h=96" 
                    alt="Cannabis plant" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Assistant Character */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    {/* Assistant Avatar */}
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    
                    {/* Online Status */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Name Tag */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <Badge className="bg-white text-green-900 border border-green-200 shadow-sm">
                        <Store className="h-3 w-3 mr-1" />
                        Cannabis Expert
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Floating Chat Bubble */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-green-100 max-w-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Live Assistant</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      "Hi! I'm here to help you find the perfect cannabis plants. What are you looking for today?"
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Available 24/7
                      </span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                    {/* Chat bubble tail */}
                    <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-r border-b border-green-100 transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Bar */}
            <div className="bg-green-50 p-6 border-t">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">AI + Human Support</h4>
                    <p className="text-sm text-gray-600">Smart AI with expert human backup</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">100% Anonymous</h4>
                    <p className="text-sm text-gray-600">No personal data required</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">Instant Responses</h4>
                    <p className="text-sm text-gray-600">Get help when you need it</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}