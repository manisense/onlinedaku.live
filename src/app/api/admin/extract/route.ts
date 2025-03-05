import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import FireCrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';

// Define schema for product data validation
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
    // Verify the admin token
    const admin = await verifyToken(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get the URL from the request body
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY;
    if (!apiKey || apiKey === 'fc-demo-key') {
      return NextResponse.json(
        { success: false, error: 'FireCrawl API key is not configured' },
        { status: 500 }
      );
    }

    // Create FireCrawl app instance
    const app = new FireCrawlApp({ apiKey });

    console.log(`Extracting data from URL: ${url}`);
    
    try {
      // Extract data using FireCrawl
      const extractResult = await app.extract(
        [url], 
        {
          prompt: `Extract product details including title, description, store, category, image, 
                  current_price, original_price, and discount_percentage. 
                  The title is required. For prices, return numbers without currency symbols.`,
          schema: productSchema,
        }
      );
      
      console.log("FireCrawl response:", JSON.stringify(extractResult, null, 2));
      
      // Handle the new FireCrawl SDK response format which returns { success: true, data: { product: {...} } }
      let productData;
      
      // Check if the response has the expected structure with data property
      if (extractResult && extractResult.success && extractResult.data && extractResult.data.product) {
        const extractedProduct = extractResult.data.product;
        
        // Determine the store name from extracted data or URL
        let storeName = extractedProduct.store || '';
        if (!storeName) {
          try {
            const urlObject = new URL(url);
            storeName = urlObject.hostname.replace('www.', '');
          } catch (err) {
            storeName = 'Unknown Store';
          }
        }
        
        // Calculate discount percentage if not provided
        let discountPercentage = extractedProduct.discount_percentage || 0;
        if (!discountPercentage && 
            extractedProduct.original_price && 
            extractedProduct.current_price && 
            extractedProduct.original_price > extractedProduct.current_price) {
          discountPercentage = Math.round(
            ((extractedProduct.original_price - extractedProduct.current_price) / 
             extractedProduct.original_price) * 100
          );
        }
        
        // Format the extracted product data
        productData = {
          title: extractedProduct.title,
          description: extractedProduct.description || '',
          price: extractedProduct.current_price || 0,
          originalPrice: extractedProduct.original_price || extractedProduct.current_price || 0,
          discountPercentage: discountPercentage,
          image: extractedProduct.image || '',
          store: storeName,
          category: extractedProduct.category || '',
        };

        console.log('Successfully extracted product data:', productData);
        
        return NextResponse.json({
          success: true,
          result: {
            product: productData
          }
        });
      } else {
        // If we couldn't find the product data in the expected structure
        return NextResponse.json(
          { 
            success: false, 
            error: 'Could not extract product data in the expected format',
            details: extractResult
          },
          { status: 422 }
        );
      }
      
    } catch (extractError) {
      console.error('Error during FireCrawl extraction:', extractError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error during data extraction',
          details: extractError instanceof Error ? extractError.message : String(extractError)
        },
        { status: 502 }
      );
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in extract endpoint:', errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage || 'An error occurred during extraction' },
      { status: 500 }
    );
  }
}
