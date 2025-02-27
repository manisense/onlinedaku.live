import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { verifyToken } from '@/utils/auth';

interface ProductData {
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  image: string;
  store: 'amazon' | 'flipkart' | 'myntra' | 'other';
  link: string;
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    // Normalize URL and determine store
    const normalizedUrl = new URL(url);
    const hostname = normalizedUrl.hostname;
    
    let store: ProductData['store'] = 'other';
    
    if (hostname.includes('amazon')) store = 'amazon';
    else if (hostname.includes('flipkart')) store = 'flipkart';
    else if (hostname.includes('myntra')) store = 'myntra';
    
    // Fetch product page HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch product data' }, { status: 400 });
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Extract data based on store
    let productData: Partial<ProductData> = {
      store,
      link: url,
    };

    if (store === 'amazon') {
      productData = {
        ...productData,
        title: document.querySelector('#productTitle')?.textContent?.trim(),
        image: document.querySelector('#landingImage')?.getAttribute('src') || '',
        description: document.querySelector('#feature-bullets')?.textContent?.trim(),
      };

      // Price extraction for Amazon
      const priceElement = document.querySelector('.a-price .a-offscreen');
      const originalPriceElement = document.querySelector('#priceblock_ourprice, .a-text-strike');

      if (priceElement) {
        const priceText = priceElement.textContent || '';
        productData.price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      }

      if (originalPriceElement) {
        const originalPriceText = originalPriceElement.textContent || '';
        productData.originalPrice = parseFloat(originalPriceText.replace(/[^0-9.]/g, '')) || 0;
      } else {
        productData.originalPrice = productData.price || 0;
      }

    } else if (store === 'flipkart') {
      productData = {
        ...productData,
        title: document.querySelector('._35KyD6')?.textContent?.trim(),
        image: document.querySelector('._3BTv9X img')?.getAttribute('src') || '',
        description: document.querySelector('._3WHvuP')?.textContent?.trim(),
      };

      // Price extraction for Flipkart
      const priceElement = document.querySelector('._30jeq3');
      const originalPriceElement = document.querySelector('._3I9_wc');

      if (priceElement) {
        const priceText = priceElement.textContent || '';
        productData.price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      }

      if (originalPriceElement) {
        const originalPriceText = originalPriceElement.textContent || '';
        productData.originalPrice = parseFloat(originalPriceText.replace(/[^0-9.]/g, '')) || 0;
      } else {
        productData.originalPrice = productData.price || 0;
      }
    }

    // Calculate discount
    if (productData.originalPrice && productData.price) {
      const discount = productData.originalPrice - productData.price;
      productData.discountPercentage = Math.round((discount / productData.originalPrice) * 100);
    }

    // Validate required fields
    if (!productData.title || !productData.price) {
      return NextResponse.json({ 
        error: 'Could not extract product information. Try another URL or add manually.',
        partialData: productData
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      productData
    });

  } catch (error) {
    console.error('Error fetching product data:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch product data' 
    }, { status: 500 });
  }
}
