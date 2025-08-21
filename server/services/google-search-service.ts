import { google } from 'googleapis';
import { config } from '../config.js';
import { db } from '../db.js';
import { apiUsage } from '@shared/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export class GoogleSearchService {
  private customsearch: any;

  constructor() {
    this.customsearch = google.customsearch('v1');
  }

  /**
   * Search for cannabis plant care information
   */
  async searchPlantCare(query: string): Promise<{
    results: Array<{
      title: string;
      snippet: string;
      link: string;
      relevance: number;
    }>;
    summary: string;
  }> {
    try {
      // Check usage limits
      const canSearch = await this.checkUsageLimits();
      if (!canSearch.canUse) {
        throw new Error(canSearch.reason || 'Search limit exceeded');
      }

      // Perform search
      const response = await this.customsearch.cse.list({
        auth: config.googleSearch.apiKey,
        cx: config.googleSearch.searchEngineId,
        q: query,
        num: config.googleSearch.maxResults,
        dateRestrict: 'm6', // Last 6 months
        sort: 'relevance'
      });

      const items = response.data.items || [];
      
      // Process and rank results
      const results = items.map((item: any, index: number) => ({
        title: item.title || 'No title',
        snippet: item.snippet || 'No description',
        link: item.link || '#',
        relevance: this.calculateRelevance(item, query, index)
      }));

      // Sort by relevance
      results.sort((a, b) => b.relevance - a.relevance);

      // Generate summary
      const summary = this.generateSummary(results, query);

      // Track API usage
      await this.trackApiUsage('google_search', 'plant_care_search', 1);

      return { results, summary };
    } catch (error) {
      console.error('Error searching Google:', error);
      throw new Error('Failed to search online. Please try again.');
    }
  }

  /**
   * Search for specific plant problems and solutions
   */
  async searchPlantProblems(problem: string): Promise<{
    results: Array<{
      title: string;
      snippet: string;
      link: string;
      relevance: number;
    }>;
    solutions: string[];
    prevention: string[];
  }> {
    try {
      const searchQuery = `cannabis plant ${problem} treatment solution prevention`;
      const searchResult = await this.searchPlantCare(searchQuery);
      
      // Extract solutions and prevention tips
      const solutions = this.extractSolutions(searchResult.results);
      const prevention = this.extractPrevention(searchResult.results);
      
      return {
        results: searchResult.results,
        solutions,
        prevention
      };
    } catch (error) {
      console.error('Error searching plant problems:', error);
      throw new Error('Failed to search for solutions. Please try again.');
    }
  }

  /**
   * Search for product recommendations
   */
  async searchProductRecommendations(problem: string, solution: string): Promise<{
    results: Array<{
      title: string;
      snippet: string;
      link: string;
      relevance: number;
    }>;
    products: string[];
    brands: string[];
  }> {
    try {
      const searchQuery = `best cannabis plant care products ${problem} ${solution} reviews`;
      const searchResult = await this.searchPlantCare(searchQuery);
      
      // Extract product information
      const products = this.extractProducts(searchResult.results);
      const brands = this.extractBrands(searchResult.results);
      
      return {
        results: searchResult.results,
        products,
        brands
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search for products. Please try again.');
    }
  }

  /**
   * Calculate relevance score for search results
   */
  private calculateRelevance(item: any, query: string, index: number): number {
    let score = 100 - (index * 10); // Base score decreases with position
    
    const queryWords = query.toLowerCase().split(' ');
    const title = (item.title || '').toLowerCase();
    const snippet = (item.snippet || '').toLowerCase();
    
    // Boost score for exact matches
    queryWords.forEach(word => {
      if (title.includes(word)) score += 20;
      if (snippet.includes(word)) score += 10;
    });
    
    // Boost for cannabis-specific content
    const cannabisTerms = ['cannabis', 'marijuana', 'weed', 'ganja', 'hemp'];
    cannabisTerms.forEach(term => {
      if (title.includes(term) || snippet.includes(term)) score += 15;
    });
    
    // Boost for recent content
    if (item.pagemap?.metatags?.[0]?.['article:published_time']) {
      const published = new Date(item.pagemap.metatags[0]['article:published_time']);
      const now = new Date();
      const daysDiff = (now.getTime() - published.getTime()) / (1000 * 3600 * 24);
      if (daysDiff < 365) score += 10; // Boost for content less than 1 year old
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate summary of search results
   */
  private generateSummary(results: any[], query: string): string {
    if (results.length === 0) {
      return `No results found for "${query}". Please try a different search term.`;
    }
    
    const topResults = results.slice(0, 3);
    const summary = topResults.map((result, index) => 
      `${index + 1}. ${result.title}: ${result.snippet.substring(0, 100)}...`
    ).join('\n');
    
    return `Found ${results.length} results for "${query}". Top results:\n${summary}`;
  }

  /**
   * Extract solution information from search results
   */
  private extractSolutions(results: any[]): string[] {
    const solutions: string[] = [];
    const solutionKeywords = ['solution', 'treatment', 'fix', 'cure', 'remedy', 'how to'];
    
    results.forEach(result => {
      const text = `${result.title} ${result.snippet}`.toLowerCase();
      solutionKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          // Extract the sentence containing the solution
          const sentences = result.snippet.split('.');
          sentences.forEach(sentence => {
            if (sentence.toLowerCase().includes(keyword) && sentence.length > 20) {
              solutions.push(sentence.trim());
            }
          });
        }
      });
    });
    
    return [...new Set(solutions)].slice(0, 5); // Remove duplicates, limit to 5
  }

  /**
   * Extract prevention tips from search results
   */
  private extractPrevention(results: any[]): string[] {
    const prevention: string[] = [];
    const preventionKeywords = ['prevent', 'prevention', 'avoid', 'protect', 'maintain'];
    
    results.forEach(result => {
      const text = `${result.title} ${result.snippet}`.toLowerCase();
      preventionKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          const sentences = result.snippet.split('.');
          sentences.forEach(sentence => {
            if (sentence.toLowerCase().includes(keyword) && sentence.length > 20) {
              prevention.push(sentence.trim());
            }
          });
        }
      });
    });
    
    return [...new Set(prevention)].slice(0, 3); // Remove duplicates, limit to 3
  }

  /**
   * Extract product information from search results
   */
  private extractProducts(results: any[]): string[] {
    const products: string[] = [];
    const productKeywords = ['product', 'solution', 'treatment', 'fertilizer', 'pesticide'];
    
    results.forEach(result => {
      const text = `${result.title} ${result.snippet}`.toLowerCase();
      productKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          // Look for product names (usually capitalized words)
          const words = result.title.split(' ');
          words.forEach(word => {
            if (word.length > 3 && word[0] === word[0].toUpperCase() && !products.includes(word)) {
              products.push(word);
            }
          });
        }
      });
    });
    
    return products.slice(0, 5);
  }

  /**
   * Extract brand information from search results
   */
  private extractBrands(results: any[]): string[] {
    const brands: string[] = [];
    const brandKeywords = ['brand', 'company', 'manufacturer', 'by', 'from'];
    
    results.forEach(result => {
      const text = `${result.title} ${result.snippet}`.toLowerCase();
      brandKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          // Look for brand names (usually capitalized words followed by brand indicators)
          const words = result.title.split(' ');
          words.forEach((word, index) => {
            if (word.length > 2 && word[0] === word[0].toUpperCase()) {
              const nextWord = words[index + 1];
              if (nextWord && nextWord.toLowerCase().includes(keyword)) {
                brands.push(word);
              }
            }
          });
        }
      });
    });
    
    return [...new Set(brands)].slice(0, 3);
  }

  /**
   * Check if daily/monthly search limits are exceeded
   */
  private async checkUsageLimits(): Promise<{ canUse: boolean; reason?: string }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = today.substring(0, 7);
      
      // Check daily usage
      const dailyUsage = await db.select()
        .from(apiUsage)
        .where(and(
          eq(apiUsage.apiType, 'google_search'),
          eq(apiUsage.date, today)
        ));
      
      const dailySearches = dailyUsage.reduce((sum, usage) => sum + (usage.tokensUsed || 0), 0);
      
      if (dailySearches > config.limits.dailyGoogleSearches) {
        return { canUse: false, reason: 'Daily search limit exceeded' };
      }
      
      // Check monthly usage
      const monthlyUsage = await db.select()
        .from(apiUsage)
        .where(and(
          eq(apiUsage.apiType, 'google_search'),
          gte(apiUsage.date, thisMonth + '-01'),
          lte(apiUsage.date, thisMonth + '-31')
        ));
      
      const monthlySearches = monthlyUsage.reduce((sum, usage) => sum + (usage.tokensUsed || 0), 0);
      
      if (monthlySearches > config.limits.monthlyGoogleSearches) {
        return { canUse: false, reason: 'Monthly search limit exceeded' };
      }
      
      return { canUse: true };
    } catch (error) {
      console.error('Error checking search usage limits:', error);
      return { canUse: true }; // Allow search if we can't check limits
    }
  }

  /**
   * Track API usage for cost management
   */
  private async trackApiUsage(apiType: string, endpoint: string, searches: number): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await db.insert(apiUsage).values({
        apiType,
        endpoint,
        tokensUsed: searches,
        cost: this.calculateCost(searches),
        date: today
      });
    } catch (error) {
      console.error('Error tracking search API usage:', error);
    }
  }

  /**
   * Calculate estimated cost for Google searches
   */
  private calculateCost(searches: number): number {
    // Google Custom Search API costs (adjust based on actual pricing)
    // First 100 searches per day are free, then $5 per 1000 searches
    if (searches <= 100) return 0;
    return ((searches - 100) / 1000) * 5;
  }
}
