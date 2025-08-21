import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';
import { db } from '../db.js';
import { knowledgeBase, apiUsage } from '@shared/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: config.gemini.model,
      generationConfig: {
        maxOutputTokens: config.gemini.maxTokens,
        temperature: config.gemini.temperature,
      },
    });
  }

  /**
   * Analyze plant image and provide diagnosis
   */
  async analyzePlantImage(imageBase64: string, userMessage: string): Promise<{
    diagnosis: string;
    confidence: number;
    recommendations: string[];
    needsSearch: boolean;
    searchQuery?: string;
  }> {
    try {
      // Get knowledge base data for context
      const knowledgeData = await this.getKnowledgeBaseContext();
      
      // Create prompt with knowledge base context
      const prompt = this.createAnalysisPrompt(userMessage, knowledgeData);
      
      // Generate image part
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg'
        }
      };

      // Generate response
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      // Parse AI response
      const analysis = this.parseAnalysisResponse(text);
      
      // Track API usage
      await this.trackApiUsage('gemini', 'analyze_image', response.usageMetadata?.totalTokenCount || 0);
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing plant image:', error);
      throw new Error('Failed to analyze image. Please try again.');
    }
  }

  /**
   * Generate chat response with context
   */
  async generateChatResponse(
    messages: Array<{ role: string; content: string; images?: string[] }>,
    knowledgeContext?: string
  ): Promise<{
    response: string;
    needsSearch: boolean;
    searchQuery?: string;
  }> {
    try {
      const prompt = this.createChatPrompt(messages, knowledgeContext);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Track API usage
      await this.trackApiUsage('gemini', 'chat_response', response.usageMetadata?.totalTokenCount || 0);
      
      // Check if AI needs to search online
      const needsSearch = this.checkIfNeedsSearch(text);
      const searchQuery = needsSearch ? this.extractSearchQuery(text) : undefined;
      
      return {
        response: text,
        needsSearch,
        searchQuery
      };
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }

  /**
   * Get knowledge base context for AI training
   */
  private async getKnowledgeBaseContext(): Promise<string> {
    try {
      const knowledge = await db.select().from(knowledgeBase).where(eq(knowledgeBase.isActive, true));
      
      if (knowledge.length === 0) {
        return 'No specific knowledge base available yet.';
      }

      return knowledge.map(k => 
        `Problem: ${k.title}\nDescription: ${k.description}\nType: ${k.problemType}\nSolutions: ${k.solutions}`
      ).join('\n\n');
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
      return 'Knowledge base unavailable.';
    }
  }

  /**
   * Create analysis prompt with knowledge base context
   */
  private createAnalysisPrompt(userMessage: string, knowledgeContext: string): string {
    return `You are an expert cannabis plant care specialist. Analyze the provided image and help diagnose any plant health issues.

KNOWLEDGE BASE CONTEXT:
${knowledgeContext}

USER MESSAGE: ${userMessage}

INSTRUCTIONS:
1. Analyze the plant image carefully
2. Identify any visible problems (pests, diseases, nutrient issues, environmental stress)
3. Provide a confidence level (0-100%) for your diagnosis
4. Give specific, actionable recommendations
5. If you're not 100% confident, suggest what additional information would help
6. Always consider cannabis-specific care requirements
7. Respond in the same language as the user's message (default to German if unclear)

RESPONSE FORMAT:
Diagnosis: [Your diagnosis]
Confidence: [0-100%]
Recommendations: [List of specific actions]
Additional Info Needed: [What would help confirm diagnosis]`;
  }

  /**
   * Create chat prompt for general conversations
   */
  private createChatPrompt(messages: Array<{ role: string; content: string }>, knowledgeContext?: string): string {
    const conversationHistory = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    return `You are a helpful cannabis plant care assistant. You have access to the following knowledge base:

${knowledgeContext || 'No specific knowledge base available yet.'}

CONVERSATION HISTORY:
${conversationHistory}

INSTRUCTIONS:
1. Provide helpful, accurate advice about cannabis plant care
2. Use the knowledge base when relevant
3. If you're unsure about something, suggest searching for more information
4. Always prioritize safety and legal compliance
5. Respond in the same language as the user's message (default to German if unclear)
6. Be friendly, professional, and educational

Assistant:`;
  }

  /**
   * Parse AI analysis response
   */
  private parseAnalysisResponse(response: string): {
    diagnosis: string;
    confidence: number;
    recommendations: string[];
    needsSearch: boolean;
    searchQuery?: string;
  } {
    // Extract confidence level
    const confidenceMatch = response.match(/Confidence:\s*(\d+)%/);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 70;
    
    // Check if AI needs more information
    const needsSearch = confidence < 90 || response.toLowerCase().includes('unsure') || response.toLowerCase().includes('need more');
    
    // Extract search query if needed
    let searchQuery: string | undefined;
    if (needsSearch) {
      const searchMatch = response.match(/search.*?for\s+(.+?)(?:\n|\.|$)/i);
      searchQuery = searchMatch ? searchMatch[1].trim() : 'cannabis plant care';
    }
    
    // Extract recommendations
    const recommendationsMatch = response.match(/Recommendations:\s*(.+?)(?:\n|$)/i);
    const recommendations = recommendationsMatch 
      ? recommendationsMatch[1].split(',').map(r => r.trim())
      : ['Please provide more context for better recommendations'];
    
    return {
      diagnosis: response,
      confidence,
      recommendations,
      needsSearch,
      searchQuery
    };
  }

  /**
   * Check if AI response indicates need for online search
   */
  private checkIfNeedsSearch(response: string): boolean {
    const searchIndicators = [
      'unsure', 'not certain', 'need more information', 'search', 'look up',
      'research', 'verify', 'confirm', 'check online'
    ];
    
    return searchIndicators.some(indicator => 
      response.toLowerCase().includes(indicator)
    );
  }

  /**
   * Extract search query from AI response
   */
  private extractSearchQuery(response: string): string {
    // Try to extract specific search terms
    const searchMatch = response.match(/search.*?for\s+(.+?)(?:\n|\.|$)/i);
    if (searchMatch) {
      return searchMatch[1].trim();
    }
    
    // Fallback to general cannabis care
    return 'cannabis plant care best practices';
  }

  /**
   * Track API usage for cost management
   */
  private async trackApiUsage(apiType: string, endpoint: string, tokensUsed: number): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await db.insert(apiUsage).values({
        apiType,
        endpoint,
        tokensUsed,
        cost: this.calculateCost(apiType, tokensUsed),
        date: today
      });
    } catch (error) {
      console.error('Error tracking API usage:', error);
    }
  }

  /**
   * Calculate estimated cost based on usage
   */
  private calculateCost(apiType: string, tokensUsed: number): number {
    // Approximate costs (you should adjust these based on actual API pricing)
    if (apiType === 'gemini') {
      return (tokensUsed / 1000) * 0.0005; // $0.0005 per 1K tokens
    }
    return 0;
  }

  /**
   * Check if daily/monthly limits are exceeded
   */
  async checkUsageLimits(): Promise<{ canUse: boolean; reason?: string }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = today.substring(0, 7);
      
      // Check daily usage
      const dailyUsage = await db.select()
        .from(apiUsage)
        .where(and(
          eq(apiUsage.apiType, 'gemini'),
          eq(apiUsage.date, today)
        ));
      
      const dailyTokens = dailyUsage.reduce((sum, usage) => sum + (usage.tokensUsed || 0), 0);
      
      if (dailyTokens > config.limits.dailyGeminiTokens) {
        return { canUse: false, reason: 'Daily token limit exceeded' };
      }
      
      // Check monthly usage
      const monthlyUsage = await db.select()
        .from(apiUsage)
        .where(and(
          eq(apiUsage.apiType, 'gemini'),
          gte(apiUsage.date, thisMonth + '-01'),
          lte(apiUsage.date, thisMonth + '-31')
        ));
      
      const monthlyTokens = monthlyUsage.reduce((sum, usage) => sum + (usage.tokensUsed || 0), 0);
      
      if (monthlyTokens > config.limits.monthlyGeminiTokens) {
        return { canUse: false, reason: 'Monthly token limit exceeded' };
      }
      
      return { canUse: true };
    } catch (error) {
      console.error('Error checking usage limits:', error);
      return { canUse: true }; // Allow usage if we can't check limits
    }
  }
}
