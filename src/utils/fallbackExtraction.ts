import { JSDOM } from 'jsdom';

/**
 * Basic utility to extract product information from HTML when FireCrawl fails
 */
export async function extractProductDataFromHtml(url: string, html: string) {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Try different meta tags and selectors to find product data
    const extractMeta = (name: string) => {
      const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      return meta?.getAttribute('content') || null;
    };

    // Extract title
    const title = 
      extractMeta('og:title') || 
      extractMeta('twitter:title') || 
      document.title || 
      document.querySelector('h1')?.textContent?.trim() || 
      'Unknown Product';

    // Extract description
    const description = 
      extractMeta('og:description') || 
      extractMeta('twitter:description') || 
      extractMeta('description') || 
      '';

    // Extract image
    const image = 
      extractMeta('og:image') || 
      extractMeta('twitter:image') || 
      document.querySelector('img[itemprop="image"]')?.getAttribute('src') || 
      '';

    // Try to determine store name from URL
    let storeName = '';
    try {
      const urlObject = new URL(url);
      storeName = urlObject.hostname.replace('www.', '');
    } catch (err) {
      storeName = 'Unknown Store';
    }

    // Partial extraction result
    return {
      title,
      description,
      image: image || '',
      store: storeName,
      price: 0,  // Unable to reliably extract price without specific selectors
      originalPrice: 0,
      discountPercentage: 0
    };
  } catch (error) {
    console.error('Error in fallback HTML extraction:', error);
    return null;
  }
}
