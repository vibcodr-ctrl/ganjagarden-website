export const config = {
  // Gemini AI Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key-here',
    model: 'gemini-1.5-flash',
    maxTokens: 1000,
    temperature: 0.7,
  },
  
  // Google Custom Search Configuration
  googleSearch: {
    apiKey: process.env.GOOGLE_SEARCH_API_KEY || 'your-google-search-api-key-here',
    searchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID || 'your-search-engine-id-here',
    maxResults: 5,
  },
  
  // Email Configuration
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password',
    },
  },
  
  // API Usage Limits
  limits: {
    dailyGeminiTokens: parseInt(process.env.DAILY_GEMINI_LIMIT || '100000'),
    monthlyGeminiTokens: parseInt(process.env.MONTHLY_GEMINI_LIMIT || '3000000'),
    dailyGoogleSearches: parseInt(process.env.DAILY_GOOGLE_SEARCH_LIMIT || '100'),
    monthlyGoogleSearches: parseInt(process.env.MONTHLY_GOOGLE_SEARCH_LIMIT || '3000'),
  },
  
  // File Upload Configuration
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    uploadDir: 'uploads/',
  },
  
  // Chat Configuration
  chat: {
    maxMessageLength: 2000,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxImagesPerMessage: 5,
  },
};
