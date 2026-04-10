import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All unique URLs from both header menu and mobile/drawer menu
const URLS_TO_CLONE = [
  // Collections - Cast Iron
  'https://www.theindusvalley.in/collections/cast-iron-cookware',
  'https://www.theindusvalley.in/collections/super-smooth-cast-iron-cookware',
  'https://www.theindusvalley.in/collections/cast-iron-combos',
  'https://www.theindusvalley.in/collections/cast-iron-tawa',
  'https://www.theindusvalley.in/collections/cast-iron-kadai',
  'https://www.theindusvalley.in/collections/cast-iron-fry-pan',
  'https://www.theindusvalley.in/collections/cast-iron-grill-pan',
  'https://www.theindusvalley.in/collections/cast-iron-paniyaram-pan',
  'https://www.theindusvalley.in/collections/cast-iron-appam-pan',
  'https://www.theindusvalley.in/collections/cast-iron-dutch-oven',
  'https://www.theindusvalley.in/collections/cast-iron-tadka-pan',
  
  // Collections - Tri-ply
  'https://www.theindusvalley.in/collections/tri-ply-stainless-steel',
  'https://www.theindusvalley.in/collections/triply-stainless-steel-combo',
  'https://www.theindusvalley.in/collections/triply-stainless-steel-kadai',
  'https://www.theindusvalley.in/collections/triply-stainless-steel-biryani-pot',
  'https://www.theindusvalley.in/collections/triply-stainless-steel-fry-pan',
  'https://www.theindusvalley.in/collections/triply-stainless-steel-sauce-pan',
  
  // Collections - Tri-steel
  'https://www.theindusvalley.in/collections/best-stainless-steel-cookware',
  'https://www.theindusvalley.in/collections/tri-steel-cookware-set-combo',
  'https://www.theindusvalley.in/collections/multi-pot',
  'https://www.theindusvalley.in/collections/tri-steel-fry-pan',
  
  // Collections - Pressure Cooker
  'https://www.theindusvalley.in/collections/pressure-cooker',
  'https://www.theindusvalley.in/collections/pressure-cooker-combos',
  
  // Collections - Sheet Iron
  'https://www.theindusvalley.in/collections/iron-cookware',
  'https://www.theindusvalley.in/collections/iron-combos',
  'https://www.theindusvalley.in/collections/iron-tawa',
  'https://www.theindusvalley.in/collections/iron-kadai',
  'https://www.theindusvalley.in/collections/iron-tadka-pan',
  'https://www.theindusvalley.in/collections/sheet-iron-fry-pan',
  
  // Collections - Drinkware
  'https://www.theindusvalley.in/collections/drinkware',
  
  // Collections - Cookware Sets
  'https://www.theindusvalley.in/collections/cookware-set-combo-offer',
  
  // Collections - Other Menu Items
  'https://www.theindusvalley.in/collections/best-sellers',
  'https://www.theindusvalley.in/collections/10th-anniversary-sale',
  'https://www.theindusvalley.in/collections/kitchen-accessories',
  'https://www.theindusvalley.in/collections/tadka-pan',
  
  // Collections - Additional from submenu-link class
  'https://www.theindusvalley.in/collections/tawa',
  'https://www.theindusvalley.in/collections/kadai',
  'https://www.theindusvalley.in/collections/frying-pan-skillet',
  'https://www.theindusvalley.in/collections/biryani-pot-stock-pot',
  'https://www.theindusvalley.in/collections/paniyaram-pan',
  'https://www.theindusvalley.in/collections/sauce-pan',
  'https://www.theindusvalley.in/collections/grill-pans',
  'https://www.theindusvalley.in/collections/appam-pan',
  'https://www.theindusvalley.in/collections/wooden-kitchenware',
  
  // Products (from menu links)
  'https://www.theindusvalley.in/products/triply-tasla',
  'https://www.theindusvalley.in/products/triply-tope-with-lid',
  'https://www.theindusvalley.in/products/stainless-steel-capsule-casserole-stockpot',
  'https://www.theindusvalley.in/products/stainless-steel-capsule-bottom-kadai',
  'https://www.theindusvalley.in/products/premium-stainless-steel-coffee-tea-milk-warmer-650-ml',
  'https://www.theindusvalley.in/products/stainless-steel-capsule-bottom-milk-tea-pan',
];

const OUTPUT_DIR = path.join(__dirname, 'public', 'pages');

// Convert URL to local filename
function urlToFilename(url) {
  const urlObj = new URL(url);
  // /collections/cast-iron-cookware -> collections-cast-iron-cookware.html
  const pathPart = urlObj.pathname.replace(/^\//, '').replace(/\//g, '-');
  return pathPart + '.html';
}

// Convert URL to the local href path (relative from public/)
function urlToLocalHref(url) {
  const filename = urlToFilename(url);
  return 'pages/' + filename;
}

// Fetch a URL and return HTML content
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http') 
          ? res.headers.location 
          : new URL(res.headers.location, url).href;
        console.log(`  ↳ Redirecting to: ${redirectUrl}`);
        fetchUrl(redirectUrl).then(resolve).catch(reject);
        return;
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error(`Timeout for ${url}`));
    });
  });
}

// Localize HTML content - replace all theindusvalley.in references
function localizeHtml(html, currentUrl) {
  let result = html;
  
  // Build URL mapping for pages we're cloning
  const urlMap = {};
  for (const url of URLS_TO_CLONE) {
    const urlObj = new URL(url);
    const localPath = '../' + urlToLocalHref(url);
    // Map both absolute and relative forms
    urlMap[url] = localPath;
    urlMap[urlObj.pathname] = localPath;
  }
  
  // Replace known URLs with local paths (longest first to avoid partial matches)
  const sortedUrls = Object.keys(urlMap).sort((a, b) => b.length - a.length);
  for (const originalUrl of sortedUrls) {
    const localPath = urlMap[originalUrl];
    // Replace in href attributes
    result = result.replace(
      new RegExp(`href="${originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
      `href="${localPath}"`
    );
  }
  
  // Replace remaining absolute theindusvalley.in links with #
  result = result.replace(/href="https:\/\/www\.theindusvalley\.in\/([^"]*)"/g, (match, path) => {
    // Check if this path matches any known local page
    const fullUrl = `https://www.theindusvalley.in/${path}`;
    if (urlMap[fullUrl]) {
      return `href="${urlMap[fullUrl]}"`;
    }
    return 'href="#"';
  });
  
  // Replace remaining relative /collections/ and /products/ links
  result = result.replace(/href="\/([^"]*)"/g, (match, path) => {
    const fullUrl = `https://www.theindusvalley.in/${path}`;
    if (urlMap[fullUrl] || urlMap['/' + path]) {
      return `href="${urlMap[fullUrl] || urlMap['/' + path]}"`;
    }
    return 'href="#"';
  });
  
  // Fix CSS/JS/font/image paths - make them relative to ../
  // These are assets that exist in the public/ directory
  result = result.replace(/href="css\//g, 'href="../css/');
  result = result.replace(/src="js\//g, 'src="../js/');
  result = result.replace(/src="images\//g, 'src="../images/');
  result = result.replace(/url\(fonts\//g, 'url(../fonts/');
  result = result.replace(/url\("fonts\//g, 'url("../fonts/');
  result = result.replace(/href="fonts\//g, 'href="../fonts/');
  result = result.replace(/src="fonts\//g, 'src="../fonts/');
  
  // Replace references to the domain in meta tags, scripts, etc
  result = result.replace(/https:\/\/www\.theindusvalley\.in/g, '');
  
  // Replace the logo link to go to main index
  result = result.replace(/href="\/"/g, 'href="../index.html"');
  result = result.replace(/href=""\s/g, 'href="../index.html" ');
  
  return result;
}

// Download images from CDN that are referenced in the page
async function downloadImages(html, pageUrl) {
  const imgDir = path.join(__dirname, 'public', 'images');
  
  // Find all Shopify CDN image URLs in the HTML
  const cdnPattern = /https:\/\/www\.theindusvalley\.in\/cdn\/shop\/(?:files|products|collections)\/([^"'\s)]+)/g;
  const matches = [...html.matchAll(cdnPattern)];
  const uniqueUrls = [...new Set(matches.map(m => m[0]))];
  
  // Download each image (limited set)
  let downloaded = 0;
  for (const imgUrl of uniqueUrls.slice(0, 30)) { // Limit to 30 images per page
    try {
      const filename = imgUrl.split('/').pop().split('?')[0];
      const filepath = path.join(imgDir, filename);
      if (!fs.existsSync(filepath)) {
        // Skip downloading for now - the images will load from CDN
        // We just need the HTML structure
      }
    } catch (e) {
      // Skip image download errors
    }
  }
}

async function main() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log(`\nCloning ${URLS_TO_CLONE.length} pages...\n`);
  
  const results = { success: [], failed: [] };
  
  for (let i = 0; i < URLS_TO_CLONE.length; i++) {
    const url = URLS_TO_CLONE[i];
    const filename = urlToFilename(url);
    const filepath = path.join(OUTPUT_DIR, filename);
    
    console.log(`[${i + 1}/${URLS_TO_CLONE.length}] ${url}`);
    console.log(`  → ${filename}`);
    
    try {
      const html = await fetchUrl(url);
      const localizedHtml = localizeHtml(html, url);
      fs.writeFileSync(filepath, localizedHtml, 'utf-8');
      console.log(`  ✓ Saved (${Math.round(localizedHtml.length / 1024)}KB)\n`);
      results.success.push({ url, filename });
      
      // Small delay to be respectful
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.log(`  ✗ FAILED: ${error.message}\n`);
      results.failed.push({ url, filename, error: error.message });
    }
  }
  
  // Write mapping file for use by the index.html updater
  const mapping = {};
  for (const url of URLS_TO_CLONE) {
    const urlObj = new URL(url);
    mapping[url] = urlToLocalHref(url);
    mapping[urlObj.pathname] = urlToLocalHref(url);
  }
  fs.writeFileSync(
    path.join(__dirname, 'url-mapping.json'),
    JSON.stringify(mapping, null, 2)
  );
  
  console.log('\n=== SUMMARY ===');
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed:  ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.log('\nFailed pages:');
    results.failed.forEach(f => console.log(`  - ${f.url}: ${f.error}`));
  }
  console.log('\nURL mapping saved to url-mapping.json');
}

main().catch(console.error);
