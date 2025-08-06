import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import type { InsertOrder } from "@shared/schema";

const checkoutSchema = insertOrderSchema.extend({
  deliveryType: z.enum(['delivery', 'pickup']),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CartOverlay() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryAddress: "",
      pickupLocation: "",
      deliveryType: "delivery",
      total: "0",
      status: "pending",
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const orderData = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        deliveryAddress: data.deliveryType === 'delivery' ? data.deliveryAddress : "",
        pickupLocation: data.deliveryType === 'pickup' ? data.pickupLocation : "",
        deliveryType: data.deliveryType,
        total: total.toString(),
        status: "pending",
      };

      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await apiRequest('POST', '/api/orders', {
        order: orderData,
        items: orderItems,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order placed successfully!",
        description: `Order #${data.order.id} has been created. We'll contact you soon.`,
      });
      clearCart();
      setShowCheckout(false);
      closeCart();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    orderMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={(e) => e.target === e.currentTarget && closeCart()}
      data-testid="cart-overlay"
    >
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">
              {showCheckout ? "Checkout" : "Shopping Cart"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeCart}
              data-testid="button-close-cart"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {!showCheckout ? (
          <>
            <div className="p-6 flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
              {items.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                      data-testid={`cart-item-${item.id}`}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold" data-testid={`text-item-name-${item.id}`}>
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {item.category}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus size={12} />
                          </Button>
                          <span data-testid={`text-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus size={12} />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" data-testid={`text-item-price-${item.id}`}>
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t p-6">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span 
                  className="font-bold text-xl text-forest-green"
                  data-testid="text-cart-total"
                >
                  ${total.toFixed(2)}
                </span>
              </div>
              {items.length > 0 && (
                <>
                  <Button 
                    className="w-full bg-forest-green text-white py-3 rounded-lg font-semibold hover:bg-sage-green transition-colors mb-3"
                    onClick={() => setShowCheckout(true)}
                    data-testid="button-checkout"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-forest-green text-forest-green py-3 rounded-lg font-semibold hover:bg-forest-green hover:text-white transition-colors"
                    onClick={closeCart}
                    data-testid="button-continue-shopping"
                  >
                    Continue Shopping
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 100px)' }}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your full name" 
                          {...field} 
                          data-testid="input-checkout-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your@email.com" 
                          {...field} 
                          data-testid="input-checkout-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="Your phone number" 
                          {...field} 
                          data-testid="input-checkout-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Option</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-delivery-type">
                            <SelectValue placeholder="Choose delivery option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="delivery">Safe Location Delivery</SelectItem>
                          <SelectItem value="pickup">Secure Pickup Hotspot</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('deliveryType') === 'delivery' && (
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Safe Meeting Location</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any safe location - your home address, parking lot, shopping center, etc. We prioritize your safety and discretion."
                            {...field}
                            data-testid="textarea-delivery-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch('deliveryType') === 'pickup' && (
                  <FormField
                    control={form.control}
                    name="pickupLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Pickup Hotspot</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Choose from our secure pickup hotspots (list will be provided) or suggest a safe meeting location"
                            {...field}
                            data-testid="input-pickup-location"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Order Total:</span>
                    <span className="font-bold text-xl text-forest-green">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      type="submit"
                      className="w-full bg-forest-green text-white py-3 rounded-lg font-semibold hover:bg-sage-green transition-colors"
                      disabled={orderMutation.isPending}
                      data-testid="button-place-order"
                    >
                      {orderMutation.isPending ? "Placing Order..." : "Place Order"}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowCheckout(false)}
                      data-testid="button-back-to-cart"
                    >
                      Back to Cart
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
