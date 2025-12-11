const { gotScraping } = require('got-scraping');
const cheerio = require('cheerio');

/**
 * Scrape text content from a URL
 * @param {string} url - URL to scrape
 * @returns {Promise<string>} Cleaned text content
 */
async function scrapeWebPage(url) {
  try {
    // Fetch the HTML using got-scraping (handles headers, cookies, etc.)
    const response = await gotScraping({
      url,
      headerGeneratorOptions: {
        browsers: ['chrome', 'firefox'],
        devices: ['desktop'],
        locales: ['en-US']
      }
    });

    const html = response.body;
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('header').remove();
    $('footer').remove();
    $('iframe').remove();
    $('noscript').remove();
    $('.advertisement').remove();
    $('.ad').remove();
    $('.ads').remove();
    $('.sidebar').remove();
    $('.navigation').remove();
    $('.cookie-banner').remove();
    $('.popup').remove();
    $('.modal').remove();

    // Extract main content - prioritize article/main tags
    let text = '';
    
    if ($('article').length > 0) {
      text = $('article').text();
    } else if ($('main').length > 0) {
      text = $('main').text();
    } else if ($('.content').length > 0) {
      text = $('.content').text();
    } else if ($('#content').length > 0) {
      text = $('#content').text();
    } else {
      text = $('body').text();
    }

    // Clean up whitespace
    text = text
      .replace(/\s+/g, ' ')           // Multiple spaces to single space
      .replace(/\n+/g, '\n')          // Multiple newlines to single newline
      .trim();

    return text;
  } catch (error) {
    console.error('Error scraping webpage:', error);
    throw new Error(`Failed to scrape URL: ${error.message}`);
  }
}

/**
 * Scrape multiple URLs
 * @param {Array<string>} urls - Array of URLs to scrape
 * @returns {Promise<Array<{url: string, text: string, error?: string}>>}
 */
async function scrapeMultiplePages(urls) {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const text = await scrapeWebPage(url);
        return { url, text };
      } catch (error) {
        return { url, text: '', error: error.message };
      }
    })
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return { 
        url: urls[index], 
        text: '', 
        error: result.reason.message 
      };
    }
  });
}

/**
 * Validate if a string is a valid URL
 * @param {string} url - URL string to validate
 * @returns {boolean}
 */
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

module.exports = {
  scrapeWebPage,
  scrapeMultiplePages,
  isValidUrl
};
