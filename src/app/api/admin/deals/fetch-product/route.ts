import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
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

    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    // Normalize URL and determine store
    try {
      const normalizedUrl = new URL(url);
      const hostname = normalizedUrl.hostname;
      
      let store: ProductData['store'] = 'other';
      if (hostname.includes('amazon')) store = 'amazon';
      else if (hostname.includes('flipkart')) store = 'flipkart';
      else if (hostname.includes('myntra')) store = 'myntra';
      
      // Fetch product page HTML
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Cache-Control': 'no-cache'
        },
        timeout: 10000
      });

      const html = response.data;
      const productData = parseProductData(html, store, url);

      return NextResponse.json({ 
        success: true, 
        productData 
      });

    } catch (error) {
      console.error('Product extraction error:', error);
      return NextResponse.json({
        error: 'Could not extract product information. Try another URL or add manually.',
      }, { status: 422 });
    }
  } catch (error) {
    console.error('Error in fetch-product API:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch product data' 
    }, { status: 500 });
  }
}

function parseProductData(html: string, store: ProductData['store'], url: string): ProductData {
  const $ = cheerio.load(html);
  
  let title = '';
  let price = 0;
  let originalPrice = 0;
  let description = '';
  let image = '';
  
  if (store === 'flipkart') {
    // Title selectors
    title = $('.VU-ZEz').first().text().trim() || 
            $('.B_NuCI').first().text().trim();
    
    // Price selectors - try all known Flipkart price selectors
    const priceSelectors = [
      '.Nx9bqj',             // New price selector
      '._30jeq3._16Jk6d',    // Old price selector
      '._16Jk6d'             // Another price variant
    ];
    
    // Original price selectors - try all known Flipkart MRP selectors
    const originalPriceSelectors = [
      '.yRaY8j',             // New MRP selector
      '._3I9_wc._2p6lqe',    // Old MRP selector
      '._2p6lqe'             // Another MRP variant
    ];

    // Try each price selector
    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      if (priceText) {
        price = extractPrice(priceText);
        if (price > 0) break;
      }
    }
    
    // Try each original price selector
    for (const selector of originalPriceSelectors) {
      const originalPriceText = $(selector).first().text().trim();
      if (originalPriceText) {
        originalPrice = extractPrice(originalPriceText);
        if (originalPrice > 0) break;
      }
    }
    
    // Image selectors
    const imgSelectors = [
      '._53J4C-',                // New image selector
      'img[src*="rukminim"]',    // Common Flipkart image pattern
      '.CXW8mj ._396cs4'         // Another image selector
    ];
    
    for (const selector of imgSelectors) {
      const imgEl = $(selector).first();
      if (imgEl.length) {
        image = imgEl.attr('src') || '';
        if (image) break;
      }
    }
    
    // Description selectors - including the new one
    const descriptionSelectors = [
      '._5Pmv5S ._1IK+Dg',      // New detailed description
      '.sBVJqn',                // Product specifications
      '._1mXcCf',               // Old description
      '.RmoJUa',                // Another description variant
      '._1AN87F'                // Yet another description variant
    ];
    
    const descriptionParts: string[] = [];
    
    // Try to extract structured product details
    if ($('._5Pmv5S').length) {
      $('.sBVJqn .row').each((_, row) => {
        const label = $(row).find('._9NUIO9').text().trim();
        const value = $(row).find('.-gXFvC').text().trim();
        if (label && value) {
          descriptionParts.push(`${label}: ${value}`);
        }
      });
    }
    
    // If we found structured details, use those
    if (descriptionParts.length > 0) {
      description = descriptionParts.join('\n');
    } else {
      // Otherwise try each description selector
      for (const selector of descriptionSelectors) {
        const text = $(selector).text().trim();
        if (text && text.length > 10) {
          description = text;
          break;
        }
      }
    }
  } else if (store === 'amazon') {
    title = $('#productTitle').text().trim();
    
    const priceElement = $('.a-price .a-offscreen').first();
    const priceText = priceElement.text().trim();
    price = extractPrice(priceText);
    
    const originalPriceElement = $('.a-price.a-text-price .a-offscreen').first();
    const originalPriceText = originalPriceElement.text().trim();
    originalPrice = extractPrice(originalPriceText) || price;
    
    image = $('#landingImage').attr('src') || '';
    description = $('#feature-bullets').text().trim();
  } else if (store === 'myntra') {
    title = $('.pdp-name').text().trim();
    
    const priceText = $('.pdp-price strong').text().trim();
    price = extractPrice(priceText);
    
    const originalPriceText = $('.pdp-mrp s').text().trim();
    originalPrice = extractPrice(originalPriceText) || price;
    
    image = $('.image-grid-image').first().attr('src') || '';
    description = $('.pdp-product-description-content').text().trim();
  } else {
    // Generic selectors for other sites
    title = $('h1').first().text().trim() || $('title').text().trim();
    
    // Look for price elements with currency symbols
    $('[class*="price"]:not([class*="original"]):not([class*="old"]):not([class*="strike"])').each((i, el) => {
      const text = $(el).text().trim();
      if (text.match(/[\$\£\€\₹]\s*\d+/)) {
        price = extractPrice(text);
        return false; // break
      }
    });
    
    // Look for images
    image = $('meta[property="og:image"]').attr('content') || 
           $('img[id*="main"]').first().attr('src') || 
           $('img[src*="product"]').first().attr('src') || '';
           
    description = $('meta[name="description"]').attr('content') || 
                 $('[class*="description"]').first().text().trim() || '';
  }
  
  // Make sure we have an originalPrice even if not explicitly found
  if (originalPrice === 0 && price > 0) {
    originalPrice = price;
  }
  
  // Calculate discount percentage
  let discountPercentage = 0;
  if (originalPrice > price && price > 0) {
    discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  }
  
  // If image is a relative URL, make it absolute
  if (image && !image.startsWith('http')) {
    const baseUrl = new URL(url);
    if (image.startsWith('//')) {
      image = `https:${image}`;
    } else if (image.startsWith('/')) {
      image = `${baseUrl.protocol}//${baseUrl.host}${image}`;
    }
  }
  
  // Basic validation - we need at least a title
  // But even if price is missing, we'll return what we have
  if (!title) {
    throw new Error('Could not extract product title');
  }
  
  return {
    title,
    description: description || 'No description available',
    price: price || 0,
    originalPrice: originalPrice || 0,
    discountPercentage,
    image,
    store,
    link: url
  };
}

function extractPrice(text: string): number {
  if (!text) return 0;
  
  // Handle different currency symbols with more specificity for ₹
  const regex = /[₹\$\£\€]?\s*([\d,]+(?:\.\d+)?)/;
  const match = text.match(regex);
  
  if (match && match[1]) {
    const priceStr = match[1].replace(/,/g, '');
    const price = parseFloat(priceStr);
    return !isNaN(price) ? price : 0;
  }
  
  return 0;
}
