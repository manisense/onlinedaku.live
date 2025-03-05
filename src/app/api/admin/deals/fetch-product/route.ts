import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import { extractProductDataFromHtml } from '@/utils/fallbackExtraction';
import FireCrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';

const productSchema = z.object({
  product: z.object({
    title: z.string(),
    description: z.string().optional().nullable(),
    store: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    current_price: z.number().optional().nullable(),
    original_price: z.number().optional().nullable(),
    discount_percentage: z.number().optional().nullable(),
  })
});

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get URL from request
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ 
        success: false, 
        error: 'URL is required' 
      }, { status: 400 });
    }

    // Check if we can use FireCrawl API
    const apiKey = process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY;
    const useFireCrawl = apiKey && apiKey !== 'fc-demo-key';

    // Attempt to fetch product data using FireCrawl JS SDK
    if (useFireCrawl) {
      try {
        const app = new FireCrawlApp({ apiKey });
        
        const extractResult = await app.extract(
          [url], 
          {
            prompt: `Extract product details including title, description, store, category, image, 
                    current_price, original_price, and discount_percentage. 
                    The title is required. For prices, return numbers without currency symbols.`,
            schema: productSchema,
          }
        );
        
        // Check if extraction was successful
        if ('success' in extractResult && Array.isArray(extractResult) && extractResult.length > 0 && extractResult[0]?.product?.title) {
          const extractedProduct = extractResult[0];
          
          // Determine the store name
          let storeName = extractedProduct.product.store || '';
          if (!storeName) {
            try {
              const urlObject = new URL(url);
              storeName = urlObject.hostname.replace('www.', '');
            } catch (err) {
              storeName = 'Unknown Store';
            }
          }
          
          // Calculate discount percentage if not provided
          let discountPercentage = extractedProduct.product.discount_percentage || 0;
          if (!discountPercentage && 
              extractedProduct.product.original_price && 
              extractedProduct.product.current_price && 
              extractedProduct.product.original_price > extractedProduct.product.current_price) {
            discountPercentage = Math.round(
              ((extractedProduct.product.original_price - extractedProduct.product.current_price) / 
               extractedProduct.product.original_price) * 100
            );
          }
          
          // Format the extracted product data
          const productData = {
            title: extractedProduct.product.title,
            description: extractedProduct.product.description || '',
            price: extractedProduct.product.current_price || 0,
            originalPrice: extractedProduct.product.original_price || extractedProduct.product.current_price || 0,
            discountPercentage: discountPercentage,
            image: extractedProduct.product.image || '',
            store: storeName,
            category: extractedProduct.product.category || '',
            link: url
          };
          
          return NextResponse.json({
            success: true,
            productData
          });
        } else {
          console.log('FireCrawl returned insufficient data, falling back to basic extraction');
        }
      } catch (firecrawlError) {
        console.log('FireCrawl extraction failed, falling back to basic extraction:', firecrawlError);
      }
    }

    // Fallback method - Fetch the URL ourselves and parse with JSDOM
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        return NextResponse.json({
          success: false,
          error: `Failed to fetch page (HTTP ${response.status})`,
          partialData: {
            title: '',
            description: '',
            price: 0, 
            originalPrice: 0,
            discountPercentage: 0,
            image: '',
            store: new URL(url).hostname.replace('www.', ''),
            link: url
          }
        }, { status: response.status });
      }

      const html = await response.text();
      const extractedData = await extractProductDataFromHtml(url, html);

      if (!extractedData) {
        return NextResponse.json({
          success: false,
          error: 'Failed to extract product data using fallback method',
          partialData: {
            title: '',
            description: '',
            price: 0, 
            originalPrice: 0,
            discountPercentage: 0,
            image: '',
            store: new URL(url).hostname.replace('www.', ''),
            link: url
          }
        }, { status: 422 });
      }

      return NextResponse.json({
        success: true,
        productData: {
          ...extractedData,
          link: url
        }
      });
    } catch (fetchError) {
      console.error('Error in fallback extraction:', fetchError);
      
      // Return partial data with store name from URL
      try {
        const urlObj = new URL(url);
        const storeName = urlObj.hostname.replace('www.', '');
        
        return NextResponse.json({
          success: false,
          error: 'Fallback extraction failed',
          partialData: {
            title: '',
            description: '',
            price: 0,
            originalPrice: 0,
            discountPercentage: 0,
            image: '',
            store: storeName,
            link: url
          }
        }, { status: 422 });
      } catch {
        return NextResponse.json({
          success: false,
          error: 'Could not extract any product information'
        }, { status: 422 });
      }
    }
  } catch (error) {
    console.error('Error in fetch-product endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json({
      success: false,
      error: errorMessage || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
