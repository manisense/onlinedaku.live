import { z } from "zod";

// Define interfaces for FireCrawl API
interface ScrapeOptions<T = unknown> {
  formats?: string[];
  jsonOptions?: {
    schema: z.ZodType<T>;
  };
}

interface ScrapeResponse {
  success: boolean;
  extract?: { product: z.infer<typeof productSchema>['product'] }[];
  error?: string;
}

// Define the FireCrawl API client interface
class FirecrawlApp {
  private apiKey: string;

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  async scrapeUrl(url: string, options: ScrapeOptions): Promise<ScrapeResponse> {
    try {
      // Fixed API endpoint - changed from /scrape/url to /extract
      const response = await fetch('https://api.firecrawl.dev/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          url,
          ...options
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        return {
          success: false,
          error: `API returned ${response.status}: ${errorText}`
        };
      }

      const data = await response.json();
      console.log("FireCrawl API response:", data);
      return {
        success: true,
        extract: data.extract
      };
    } catch (error) {
      console.error("FireCrawl API error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Define schema for product extraction
const productSchema = z.object({
  product: z.object({
    image: z.string().url().optional(),
    store: z.string().optional(),
    title: z.string(),
    category: z.string().optional(),
    description: z.string().optional(),
    current_price: z.number(),
    original_price: z.number().optional()
  })
});

// Type for the extracted product data
export type ExtractedProduct = z.infer<typeof productSchema>;

/**
 * Scrape product details from a URL using FireCrawl API
 */
export async function scrapeProductWithFirecrawl(url: string): Promise<{ 
  success: boolean; 
  product?: {
    image: string;
    store: string;
    title: string;
    category: string;
    description: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
  };
  error?: string;
}> {
  try {
    // Log the attempt for debugging
    console.log(`Attempting to scrape product from URL: ${url}`);
    
    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY || '';
    
    if (!apiKey || apiKey === 'fc-demo-key') {
      console.warn("Using demo API key or missing API key for FireCrawl");
    }
    
    const app = new FirecrawlApp({ apiKey });

    // Try using the correct API endpoint with proper parameters
    const scrapeResult = await app.scrapeUrl(url, {
      formats: ["json"],
      jsonOptions: { 
        schema: productSchema 
      }
    });

    if (!scrapeResult.success) {
      console.error("FireCrawl scraping failed:", scrapeResult.error);
      return { 
        success: false, 
        error: `Failed to scrape: ${scrapeResult.error}`
      };
    }

    const extractedData = scrapeResult.extract?.[0]?.product;
    
    if (!extractedData) {
      console.error("No product data in FireCrawl response");
      return {
        success: false,
        error: "Could not extract product data from the page"
      };
    }

    console.log("Successfully extracted product data:", extractedData);

    // Calculate discount percentage
    const price = extractedData.current_price;
    const originalPrice = extractedData.original_price || price;
    const discountPercentage = originalPrice > price 
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    // If store is not detected, use domain name as fallback
    const store = extractedData.store || new URL(url).hostname.replace('www.', '');

    return {
      success: true,
      product: {
        image: extractedData.image || '',
        store,
        title: extractedData.title,
        category: extractedData.category || 'General',
        description: extractedData.description || '',
        price,
        originalPrice,
        discountPercentage
      }
    };
  } catch (error) {
    console.error("Error in scrapeProductWithFirecrawl:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during scraping'
    };
  }
}
