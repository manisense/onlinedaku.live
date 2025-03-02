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
  category?: string;
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
    let html = '';
    let store: ProductData['store'] = 'other';
    
    try {
      const normalizedUrl = new URL(url);
      const hostname = normalizedUrl.hostname;
      
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

      html = response.data;
      const productData = parseProductData(html, store, url);

      return NextResponse.json({ 
        success: true, 
        productData 
      });

    } catch (error) {
      console.error('Product extraction error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Detailed extraction error:', errorMessage);
      // Try to extract partial data even if there was an error
      try {
        if (!html) {
          throw new Error('No HTML content available');
        }
        
        const $ = cheerio.load(html);
        const partialData: Partial<ProductData> = {
          title: $('title').text().trim() || '',
          description: $('meta[name="description"]').attr('content') || '',
          store,
          link: url
        };
        
        // Try to get image from og:image
        const ogImage = $('meta[property="og:image"]').attr('content');
        if (ogImage) partialData.image = ogImage;
        
        // Return partial data if we have at least some information
        if (partialData.title || partialData.description || partialData.image) {
          return NextResponse.json({
            error: 'Could not extract complete product information.',
            partialData
          }, { status: 422 });
        }
      } catch (partialError) {
        console.error('Failed to extract partial data:', partialError);
      }
      
      return NextResponse.json({
        error: 'Could not extract product information. Please verify the URL is correct and the product page is accessible.',
        details: errorMessage
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
  let category = '';
  
  if (store === 'flipkart') {
    // Title selectors - updated for latest Flipkart structure with more robust selectors
    const titleSelectors = [
      '.VU-ZEz',
      '.B_NuCI',
      'h1.yhB1nd',
      '._35KyD6',
      'span[class*="title"]',
      'h1',                    // Generic h1 tag
      '.G6XhRU',               // Another Flipkart title class
      '._29OxBi',              // Alternative title class
      'meta[property="og:title"]', // Meta title as fallback
      '.Yn2Ei5'                // Flipkart grocery title class
    ];
    
    // Try each title selector
    for (const selector of titleSelectors) {
      if (selector.startsWith('meta')) {
        // Handle meta tags differently
        const metaContent = $(selector).attr('content');
        if (metaContent && metaContent.trim()) {
          title = metaContent.trim();
          break;
        }
      } else {
        const titleText = $(selector).first().text().trim();
        if (titleText) {
          title = titleText;
          break;
        }
      }
    }
            
    // Extract category from Flipkart breadcrumb
    const breadcrumbSelectors = [
      '._3GIHBu',  // Common breadcrumb container
      '._1MR4o5',  // Alternative breadcrumb
      '.V_ZJxz',   // Another breadcrumb variant
      '[class*="breadcrumb"]', // Generic breadcrumb class
      '._1MbXnE'   // Flipkart grocery breadcrumb
    ];
    
    for (const selector of breadcrumbSelectors) {
      const breadcrumbContainer = $(selector);
      if (breadcrumbContainer.length) {
        // Get the second-to-last breadcrumb item (usually the category)
        const breadcrumbItems = breadcrumbContainer.find('a');
        if (breadcrumbItems.length >= 2) {
          category = $(breadcrumbItems[breadcrumbItems.length - 2]).text().trim();
        }
        break;
      }
    }
    
    // Price selectors - updated for latest Flipkart structure
    const priceSelectors = [
      '.Nx9bqj.CxhGGd',     // Latest price selector
      '._30jeq3',           // Current price selector
      '._30jeq3._16Jk6d',   // Alternative price selector
      '.CEmiEU',            // New price selector
      '[class*="selling-price"]', // Generic price class
      '.a-price-whole',     // Alternative price format
      '._2tDhp2'            // Flipkart grocery price
    ];
    
    // Original price selectors - updated for latest Flipkart structure
    const originalPriceSelectors = [
      '._3I9_wc',           // Current MRP selector
      '._3I9_wc._2p6lqe',   // Alternative MRP selector
      '.yRaY8j',            // New MRP selector
      '._2p6lqe',           // Another MRP variant
      '._27UcVY'            // Flipkart grocery MRP
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
    
    // Image selectors - updated for latest Flipkart structure
    const imgSelectors = [
      'img.DByuf4.IZexXJ',            // Latest image selector
      'img._396cs4',                  // Current primary image selector
      'img[src*="rukminim"]',         // Common Flipkart image pattern
      '._2r_T1I',                     // New image selector
      '._396cs4._2amPTt._3qGmMb',    // Alternative image selector
      '._3exPp9',                     // Another image variant
      'img[class*="product-image"]',  // Generic product image
      'img._2amPTt',                  // Another common image class
      '.CXW8mj img'                   // Flipkart grocery image
    ];
    
    // Try each image selector
    for (const selector of imgSelectors) {
      const imgEl = $(selector).first();
      if (imgEl.length) {
        // Try to get high-res image from srcset first
        const srcset = imgEl.attr('srcset');
        if (srcset) {
          // Parse srcset and get the highest resolution image
          const srcsetParts = srcset.split(',').map(part => {
            const [url, descriptor] = part.trim().split(' ');
            const dpr = descriptor ? parseFloat(descriptor.replace('x', '')) : 1;
            return { url, dpr };
          });
          const highestRes = srcsetParts.reduce((prev, curr) => 
            curr.dpr > prev.dpr ? curr : prev
          );
          image = highestRes.url;
        } else {
          // Fallback to src attribute if no srcset
          image = imgEl.attr('src') || '';
        }
        
        // If we found an image, try to get the highest resolution version
        if (image) {
          // Replace resolution in image URL to get highest quality
          image = image.replace(/\d+x\d+/g, '832x832');
          break;
        }
      }
    }
    
    // Description selectors - updated for latest Flipkart structure
    const descriptionSelectors = [
      '.X3BRps',                // Current description selector
      '._1mXcCf.RmoJUa',        // Product highlights
      '.X3BRps ._2-N8zT',       // Detailed description
      '.MocXoX',                // Product specifications
      '._2418kt',               // Another description variant
      '.RmoJUa',                // Additional description class
      '._1AN87F'                // Flipkart grocery description
    ];
    
    const descriptionParts: string[] = [];
    
    // Try to extract structured product details
    $('._14cfVK').each((_, row) => {
      const label = $(row).find('._1hKmbr').text().trim();
      const value = $(row).find('._21lJbe').text().trim();
      if (label && value) {
        descriptionParts.push(`${label}: ${value}`);
      }
    });
    
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
    // More robust title extraction for Amazon
    const titleSelectors = [
      '#productTitle',
      '#title',
      '.product-title',
      '.a-size-large.product-title-word-break',
      'h1.a-size-large',
      'meta[property="og:title"]',
      'meta[name="title"]'
    ];
    
    // Try each title selector
    for (const selector of titleSelectors) {
      if (selector.startsWith('meta')) {
        // Handle meta tags differently
        const metaContent = $(selector).attr('content');
        if (metaContent && metaContent.trim()) {
          title = metaContent.trim();
          break;
        }
      } else {
        const titleText = $(selector).first().text().trim();
        if (titleText) {
          title = titleText;
          break;
        }
      }
    }
    
    // If still no title, try to extract from page title
    if (!title) {
      const pageTitle = $('title').text().trim();
      if (pageTitle) {
        // Remove common Amazon suffixes from page title
        title = pageTitle.replace(/: Amazon.in.*$/, '').trim();
      }
    }
    
    const priceElement = $('.a-price .a-offscreen').first();
    const priceText = priceElement.text().trim();
    price = extractPrice(priceText);
    
    const originalPriceElement = $('.a-price.a-text-price .a-offscreen').first();
    const originalPriceText = originalPriceElement.text().trim();
    originalPrice = extractPrice(originalPriceText) || price;
    
    image = $('#landingImage').attr('src') || '';
    description = $('#feature-bullets').text().trim();
    
    // Extract category from Amazon breadcrumb
    const breadcrumbSelectors = [
      '#wayfinding-breadcrumbs_feature_div',  // Common breadcrumb container
      '.a-breadcrumb',                       // Alternative breadcrumb
      '#nav-subnav',                         // Department navigation
      '[class*="breadcrumb"]'               // Generic breadcrumb class
    ];
    
    for (const selector of breadcrumbSelectors) {
      const breadcrumbContainer = $(selector);
      if (breadcrumbContainer.length) {
        // Get the second breadcrumb item (usually the category)
        const breadcrumbItems = breadcrumbContainer.find('a');
        if (breadcrumbItems.length >= 2) {
          category = $(breadcrumbItems[1]).text().trim();
        }
        break;
      }
    }
    
    // If breadcrumb not found, try to get from product details
    if (!category) {
      $('#detailBullets_feature_div .a-list-item').each((_, el) => {
        const text = $(el).text().trim();
        if (text.includes('Best Sellers Rank') || text.includes('Category')) {
          const match = text.match(/in\s+([^(\n]+)/i);
          if (match && match[1]) {
            category = match[1].trim();
            return false; // break
          }
        }
      });
    }
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
      if (text.match(/[$£€₹]\s*\d+/)) {
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
  
  // Fallback for title if still not found
  if (!title) {
    // Try to get title from URL
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      // Get the last non-empty segment
      for (let i = pathSegments.length - 1; i >= 0; i--) {
        if (pathSegments[i]) {
          // Convert slug to readable title
          title = pathSegments[i]
            .replace(/-|_/g, ' ')
            .replace(/\.(html|htm|php|aspx)$/i, '')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          break;
        }
      }
    } catch (e) {
      console.error('Error extracting title from URL:', e);
    }
  }
  
  // If still no title, use a generic one
  if (!title) {
    title = `Product from ${store.charAt(0).toUpperCase() + store.slice(1)}`;
  }
  
  return {
    title,
    description: description || 'No description available',
    price: price || 0,
    originalPrice: originalPrice || 0,
    discountPercentage,
    image,
    store,
    link: url,
    category
  };
}

function extractPrice(text: string): number {
  if (!text) return 0;
  
  // Handle different currency symbols with more specificity for ₹
  const regex = /[₹$£€]?\s*([\d,]+(?:\.\d+)?)/;
  const match = text.match(regex);
  
  if (match && match[1]) {
    const priceStr = match[1].replace(/,/g, '');
    const price = parseFloat(priceStr);
    return !isNaN(price) ? price : 0;
  }
  
  return 0;
}
