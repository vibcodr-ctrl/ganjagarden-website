import nodemailer from 'nodemailer';
import { config } from '../config.js';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: config.email.auth,
    });
  }

  /**
   * Send notification to admin about new chat request
   */
  async notifyAdminOfChatRequest(adminEmail: string, customerInfo: {
    email?: string;
    name?: string;
    message: string;
    chatType: 'ai' | 'admin';
  }): Promise<boolean> {
    try {
      const subject = `New ${customerInfo.chatType.toUpperCase()} Chat Request - GanjaGarden`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🌿 New Chat Request</h1>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Chat Details</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #22c55e;">
              <p><strong>Type:</strong> ${customerInfo.chatType === 'ai' ? 'AI Plant Care Assistant' : 'Direct Admin Chat'}</p>
              ${customerInfo.name ? `<p><strong>Customer Name:</strong> ${customerInfo.name}</p>` : ''}
              ${customerInfo.email ? `<p><strong>Customer Email:</strong> ${customerInfo.email}</p>` : ''}
              <p><strong>Message:</strong> ${customerInfo.message}</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.ADMIN_URL || 'http://localhost:5000/admin'}" 
                 style="background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Go to Admin Panel
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
              This is an automated notification from GanjaGarden Virtual Dispensary
            </p>
          </div>
        </div>
      `;

      await this.transporter.sendMail({
        from: config.email.auth.user,
        to: adminEmail,
        subject,
        html: htmlContent,
      });

      return true;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return false;
    }
  }

  /**
   * Send confirmation email to customer about special order
   */
  async sendOrderConfirmation(customerEmail: string, orderDetails: {
    orderId: string;
    customerName: string;
    requestDetails: string;
    requestedQuantity?: number;
    requestedStrain?: string;
    requestedDate?: string;
    adminNotes?: string;
  }): Promise<boolean> {
    try {
      const subject = `Special Order Confirmation - GanjaGarden`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🌿 Order Confirmation</h1>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${orderDetails.customerName},</h2>
            
            <p>Thank you for your special order request. We have received your request and our team is reviewing it.</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #22c55e;">
              <h3 style="color: #1f2937; margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Request Details:</strong> ${orderDetails.requestDetails}</p>
              ${orderDetails.requestedQuantity ? `<p><strong>Quantity:</strong> ${orderDetails.requestedQuantity}</p>` : ''}
              ${orderDetails.requestedStrain ? `<p><strong>Strain:</strong> ${orderDetails.requestedStrain}</p>` : ''}
              ${orderDetails.requestedDate ? `<p><strong>Requested Date:</strong> ${orderDetails.requestedDate}</p>` : ''}
            </div>
            
            ${orderDetails.adminNotes ? `
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
                <h4 style="color: #92400e; margin-top: 0;">Admin Notes</h4>
                <p style="color: #92400e;">${orderDetails.adminNotes}</p>
              </div>
            ` : ''}
            
            <p>Our team will contact you within 24 hours to discuss the details and confirm your order.</p>
            
            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #10b981;">
              <h4 style="color: #065f46; margin-top: 0;">What's Next?</h4>
              <ul style="color: #065f46; margin: 10px 0; padding-left: 20px;">
                <li>We'll review your request and check availability</li>
                <li>We'll contact you to discuss pricing and delivery options</li>
                <li>Once confirmed, we'll set up the order in our system</li>
                <li>You'll receive updates on your order status</li>
              </ul>
            </div>
            
            <p>If you have any questions, please don't hesitate to reach out to us.</p>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
              Thank you for choosing GanjaGarden! 🌱
            </p>
          </div>
        </div>
      `;

      await this.transporter.sendMail({
        from: config.email.auth.user,
        to: customerEmail,
        subject,
        html: htmlContent,
      });

      return true;
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      return false;
    }
  }

  /**
   * Send order status update to customer
   */
  async sendOrderStatusUpdate(customerEmail: string, orderDetails: {
    orderId: string;
    customerName: string;
    status: string;
    adminNotes?: string;
    nextSteps?: string[];
  }): Promise<boolean> {
    try {
      const subject = `Order Status Update - GanjaGarden`;
      
      const statusColors = {
        'confirmed': '#10b981',
        'pending': '#f59e0b',
        'rejected': '#ef4444',
        'completed': '#22c55e'
      };
      
      const statusColor = statusColors[orderDetails.status as keyof typeof statusColors] || '#6b7280';
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🌿 Order Status Update</h1>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${orderDetails.customerName},</h2>
            
            <p>Your special order status has been updated.</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid ${statusColor};">
              <h3 style="color: #1f2937; margin-top: 0;">Order Status</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold; text-transform: capitalize;">${orderDetails.status}</span></p>
            </div>
            
            ${orderDetails.adminNotes ? `
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
                <h4 style="color: #92400e; margin-top: 0;">Admin Notes</h4>
                <p style="color: #92400e;">${orderDetails.adminNotes}</p>
              </div>
            ` : ''}
            
            ${orderDetails.nextSteps && orderDetails.nextSteps.length > 0 ? `
              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #10b981;">
                <h4 style="color: #065f46; margin-top: 0;">Next Steps</h4>
                <ul style="color: #065f46; margin: 10px 0; padding-left: 20px;">
                  ${orderDetails.nextSteps.map(step => `<li>${step}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            
            <p>If you have any questions about your order, please contact us.</p>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
              Thank you for choosing GanjaGarden! 🌱
            </p>
          </div>
        </div>
      `;

      await this.transporter.sendMail({
        from: config.email.auth.user,
        to: customerEmail,
        subject,
        html: htmlContent,
      });

      return true;
    } catch (error) {
      console.error('Error sending order status update:', error);
      return false;
    }
  }

  /**
   * Send daily usage report to admin
   */
  async sendDailyUsageReport(adminEmail: string, usageData: {
    date: string;
    geminiTokens: number;
    googleSearches: number;
    estimatedCost: number;
    activeChats: number;
  }): Promise<boolean> {
    try {
      const subject = `Daily API Usage Report - GanjaGarden`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">📊 Daily Usage Report</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">${usageData.date}</p>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">API Usage Summary</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
              <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #3b82f6;">
                <h3 style="color: #1e40af; margin: 0; font-size: 18px;">Gemini AI</h3>
                <p style="color: #1e40af; font-size: 24px; font-weight: bold; margin: 10px 0;">${usageData.geminiTokens.toLocaleString()}</p>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">Tokens Used</p>
              </div>
              
              <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #8b5cf6;">
                <h3 style="color: #5b21b6; margin: 0; font-size: 18px;">Google Search</h3>
                <p style="color: #5b21b6; font-size: 24px; font-weight: bold; margin: 10px 0;">${usageData.googleSearches}</p>
                <p style="color: #6b7280; margin: 0; font-size: 14px;">Searches</p>
              </div>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0;">Cost Analysis</h3>
              <p><strong>Estimated Daily Cost:</strong> $${usageData.estimatedCost.toFixed(4)}</p>
              <p><strong>Active Chat Sessions:</strong> ${usageData.activeChats}</p>
            </div>
            
            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #10b981;">
              <h4 style="color: #065f46; margin-top: 0;">Usage Insights</h4>
              <ul style="color: #065f46; margin: 10px 0; padding-left: 20px;">
                <li>Daily Gemini limit: ${config.limits.dailyGeminiTokens.toLocaleString()} tokens</li>
                <li>Daily Google limit: ${config.limits.dailyGoogleSearches} searches</li>
                <li>Monthly Gemini limit: ${config.limits.monthlyGeminiTokens.toLocaleString()} tokens</li>
                <li>Monthly Google limit: ${config.limits.monthlyGoogleSearches} searches</li>
              </ul>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
              This is an automated daily report from GanjaGarden Virtual Dispensary
            </p>
          </div>
        </div>
      `;

      await this.transporter.sendMail({
        from: config.email.auth.user,
        to: adminEmail,
        subject,
        html: htmlContent,
      });

      return true;
    } catch (error) {
      console.error('Error sending daily usage report:', error);
      return false;
    }
  }

  /**
   * Test email service connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection test failed:', error);
      return false;
    }
  }
}
