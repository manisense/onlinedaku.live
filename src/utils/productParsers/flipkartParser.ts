import axios from 'axios';
import * as cheerio from 'cheerio';

interface FlipkartProduct {
  title: string;
  price: number;
  originalPrice?: number;
  link: string;
  image?: string;
  description?: string;
  discountPercentage?: number;
}

interface ParsedLinks {
  products: FlipkartProduct[];
  mainLink?: string;
}

export async function parseFlipkartLinks(text: string): Promise<ParsedLinks> {
  const products: FlipkartProduct[] = [];
  let mainLink: string | undefined;

  // Regular expressions for matching Flipkart links and prices 
  // eslint-disable-next-line
  const linkRegex = /https?:\/\/(?:www\.)?(?:flipkart\.com|fkrt\.cc)\/[\w\-\?\/=&%]+/gi;
  // eslint-disable-next-line
  const priceRegex = /@₹(\d+(?:\.\d{1,2})?)/i;
  const titleRegex = /([^\n]+)(?=\s+@₹|\s+https?:\/\/)/i;

  // Split text into lines
  const lines = text.split('\n').filter(line => line.trim());

  for (const line of lines) {
    const links = line.match(linkRegex);
    if (!links) continue;

    for (const link of links) {
      // Check if this is the main/master link
      if (line.toLowerCase().includes('master link') || 
          line.toLowerCase().includes('home page')) {
        mainLink = link;
        continue;
      }

      // Extract price if available
      const priceMatch = line.match(priceRegex);
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

      // Extract title if available
      const titleMatch = line.match(titleRegex);
      const title = titleMatch ? titleMatch[1].trim() : '';

      // Create product object
      const product: FlipkartProduct = {
        title,
        price,
        link,
      };

      products.push(product);
    }
  }

  // Expand short URLs and fetch additional details if needed
  for (const product of products) {
    if (product.link.includes('fkrt.cc')) {
      try {
        product.link = await expandShortUrl(product.link);
      } catch (error) {
        console.error(`Error expanding URL for ${product.title}:`, error);
      }
    }
  }

  return {
    products,
    mainLink
  };
}

// Function to expand shortened URLs (fkrt.cc)
async function expandShortUrl(shortUrl: string): Promise<string> {
  try {
    const response = await axios.head(shortUrl, { maxRedirects: 5 });
    return response.request.res.responseUrl || shortUrl;
  } catch (error) {
    console.error(`Error expanding short URL ${shortUrl}:`, error);
    return shortUrl;
  }
}

// Function to fetch additional product details from Flipkart
// Note: This would require proper handling of Flipkart's robots.txt and rate limiting
export async function fetchProductDetails(url: string): Promise<Partial<FlipkartProduct>> {
  try {
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
    const $ = cheerio.load(html);

    // Extract title - updated with latest selectors
    const titleSelectors = [
      '.B_NuCI',            // Common product title
      '.yhB1nd',            // Alternative title
      '.VU-ZEz',            // Grocery page title
      '.KalC6f',            // New title selector
      'h1[class*="title"]', // Generic title selector
      '.G6XhRU'             // Another title variant
    ];
    
    let title = '';
    for (const selector of titleSelectors) {
      const titleText = $(selector).first().text().trim();
      if (titleText) {
        title = titleText;
        break;
      }
    }

    // Extract price - updated with latest selectors
    const priceSelectors = [
      '.Nx9bqj.CxhGGd',     // Grocery page price
      '.CEmiEU',            // Regular price
      '._30jeq3._16Jk6d',   // Alternative price
      '._30jeq3',           // Another price variant
      '.a-price-whole',     // New price format
      '[class*="selling-price"]' // Generic price class
    ];

    let price = 0;
    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      if (priceText) {
        price = extractPrice(priceText);
        if (price > 0) break;
      }
    }

    // Extract original price - updated with latest selectors
    const originalPriceSelectors = [
      '.yRaY8j.A6+E6v',     // Grocery page MRP
      '._3I9_wc._2p6lqe',   // Regular MRP
      '._3I9_wc',           // Common MRP selector
      '.yRaY8j',            // Alternative MRP
      '._2p6lqe',           // Another MRP variant
      '[class*="strike"]'   // Generic strikethrough price
    ];

    let originalPrice = 0;
    for (const selector of originalPriceSelectors) {
      const originalPriceText = $(selector).first().text().trim();
      if (originalPriceText) {
        originalPrice = extractPrice(originalPriceText);
        if (originalPrice > 0) break;
      }
    }

    // Calculate discount percentage
    let discountPercentage = 0;
    if (originalPrice > price && price > 0) {
      discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    // Extract image - updated with latest selectors and srcset handling
    const imgSelectors = [
      'img._396cs4._2amPTt._3qGmMb',  // Common product image
      'img[src*="rukminim"]',         // Common Flipkart image pattern
      'img.DByuf4.IZexXJ',            // New image selector
      'img._2r_T1I',                   // Alternative image selector
      'img[class*="product-image"]',   // Generic product image
      'img._2amPTt'                    // Another common image class
    ];
    
    let image = '';
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

    // Extract description - updated with latest selectors
    const descriptionSelectors = [
      '._1mXcCf.RmoJUa',    // Product highlights
      '.X3BRps',            // Current description selector
      '.X3BRps ._2-N8zT',   // Detailed description
      '.MocXoX',            // Product specifications
      '._1AN87F',           // Old description selector
      '.RmoJUa'             // Additional description class
    ];
    
    let description = '';
    
    // Try to extract structured product details first
    const descriptionParts: string[] = [];
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

    return {
      title,
      price,
      originalPrice,
      discountPercentage,
      image,
      description
    };
  } catch (error) {
    console.error(`Error fetching product details for ${url}:`, error);
    return {};
  }
}

function extractPrice(text: string): number {
  if (!text) return 0;
  // Enhanced regex to handle different currency formats and spacing
    // eslint-disable-next-line
  const regex = /[₹$£€]?\s*([\d,]+(?:\.\d{1,2})?)\s*(?:\/\-)?/;
  const match = text.match(regex);
  if (match && match[1]) {
    const priceStr = match[1].replace(/,/g, '');
    const price = parseFloat(priceStr);
    return !isNaN(price) ? price : 0;
  }
  return 0;
}