import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// URL to local path mapping for submenu-link items
// Extracted from git show 067d8f4:public/index.html
function urlToLocal(originalUrl) {
  let url = originalUrl;
  // Normalize to full URL
  if (url.startsWith('/')) {
    url = 'https://www.theindusvalley.in' + url;
  }
  // Extract path part
  const urlObj = new URL(url);
  const pathPart = urlObj.pathname.replace(/^\//, '').replace(/\//g, '-');
  return `pages/${pathPart}.html`;
}

// Line number → original URL mapping from the old version
// These are the submenu-link items that still have href="#"
const submenuLinkMap = [
  [5136, 'https://www.theindusvalley.in/collections/cookware-set-combo-offer'],
  [5145, 'https://www.theindusvalley.in/collections/cast-iron-combos'],
  [5154, 'https://www.theindusvalley.in/collections/triply-stainless-steel-combo'],
  [5163, 'https://www.theindusvalley.in/collections/tri-steel-cookware-set-combo'],
  [5172, 'https://www.theindusvalley.in/collections/iron-combos'],
  [5181, 'https://www.theindusvalley.in/collections/pressure-cooker-combos'],
  [5200, 'https://www.theindusvalley.in/collections/pressure-cooker'],
  [5209, 'https://www.theindusvalley.in/collections/cookware-set-combo-offer'],
  [5218, 'https://www.theindusvalley.in/collections/tawa'],
  [5227, 'https://www.theindusvalley.in/collections/kadai'],
  [5236, 'https://www.theindusvalley.in/collections/frying-pan-skillet'],
  [5245, 'https://www.theindusvalley.in/collections/biryani-pot-stock-pot'],
  [5254, 'https://www.theindusvalley.in/collections/paniyaram-pan'],
  [5263, 'https://www.theindusvalley.in/collections/multi-pot'],
  [5272, 'https://www.theindusvalley.in/collections/sauce-pan'],
  [5281, 'https://www.theindusvalley.in/collections/grill-pans'],
  [5290, 'https://www.theindusvalley.in/collections/appam-pan'],
  [5299, 'https://www.theindusvalley.in/collections/tadka-pan'],
  [5308, 'https://www.theindusvalley.in/collections/drinkware'],
  [5317, 'https://www.theindusvalley.in/collections/kitchen-accessories'],
  [5336, '/collections/cast-iron-cookware'],
  [5345, '/collections/tri-ply-stainless-steel'],
  [5354, 'https://www.theindusvalley.in/collections/best-stainless-steel-cookware'],
  [5363, 'https://www.theindusvalley.in/collections/iron-cookware'],
  [5372, '/collections/wooden-kitchenware'],
  [5391, 'https://www.theindusvalley.in/collections/cast-iron-cookware'],
  [5400, '/collections/super-smooth-cast-iron-cookware'],
  [5409, 'https://www.theindusvalley.in/collections/cast-iron-combos'],
  [5418, '/collections/cast-iron-tawa'],
  [5427, 'https://www.theindusvalley.in/collections/cast-iron-kadai'],
  [5436, '/collections/cast-iron-fry-pan'],
  [5445, '/collections/cast-iron-grill-pan'],
  [5454, '/collections/cast-iron-paniyaram-pan'],
  [5463, '/collections/cast-iron-appam-pan'],
  [5472, 'https://www.theindusvalley.in/collections/cast-iron-dutch-oven'],
  [5481, '/collections/cast-iron-tadka-pan'],
  [5490, '/collections/kitchen-accessories'],
  [5509, 'https://www.theindusvalley.in/collections/tri-ply-stainless-steel'],
  [5518, 'https://www.theindusvalley.in/collections/triply-stainless-steel-combo'],
  [5527, 'https://www.theindusvalley.in/collections/triply-stainless-steel-kadai'],
  [5536, 'https://www.theindusvalley.in/collections/biryani-pot-stock-pot'],
  [5545, 'https://www.theindusvalley.in/collections/triply-stainless-steel-fry-pan'],
  [5554, 'https://www.theindusvalley.in/collections/triply-stainless-steel-sauce-pan'],
  [5563, 'https://www.theindusvalley.in/products/triply-tasla'],
  [5572, '/collections/tadka-pan'],
  [5591, '/collections/best-stainless-steel-cookware'],
  [5600, 'https://www.theindusvalley.in/collections/multi-pot'],
  [5609, 'https://www.theindusvalley.in/collections/tri-steel-cookware-set-combo'],
  [5618, 'https://www.theindusvalley.in/products/stainless-steel-capsule-bottom-kadai'],
  [5627, 'https://www.theindusvalley.in/products/stainless-steel-capsule-casserole-stockpot'],
  [5636, 'https://www.theindusvalley.in/collections/tri-steel-fry-pan'],
  [5645, 'https://www.theindusvalley.in/products/stainless-steel-capsule-bottom-milk-tea-pan'],
  [5654, 'https://www.theindusvalley.in/products/premium-stainless-steel-coffee-tea-milk-warmer-650-ml'],
  [5663, '/collections/drinkware'],
  [5692, 'https://www.theindusvalley.in/collections/iron-cookware'],
  [5701, 'https://www.theindusvalley.in/collections/iron-combos'],
  [5710, 'https://www.theindusvalley.in/collections/iron-tawa'],
  [5719, 'https://www.theindusvalley.in/collections/iron-kadai'],
  [5728, '/collections/cast-iron-fry-pan'], // actually sheet-iron-fry-pan in original
  [5737, 'https://www.theindusvalley.in/collections/iron-tadka-pan'],
];

const lines = html.split('\n');
let changeCount = 0;

for (const [lineNum, originalUrl] of submenuLinkMap) {
  const idx = lineNum - 1; // 0-indexed
  if (idx >= 0 && idx < lines.length) {
    const line = lines[idx];
    if (line.includes('href="#"') && line.includes('submenu-link')) {
      const localPath = urlToLocal(originalUrl);
      // Check if local file exists
      const filePath = path.join(__dirname, 'public', localPath);
      if (fs.existsSync(filePath)) {
        lines[idx] = line.replace('href="#"', `href="${localPath}"`);
        changeCount++;
        console.log(`✓ Line ${lineNum}: ${localPath}`);
      } else {
        console.log(`⚠ Line ${lineNum}: ${localPath} (file not found, keeping #)`);
      }
    } else {
      console.log(`⚠ Line ${lineNum}: Not a submenu-link with href="#" - skipping`);
    }
  }
}

// Also handle the mobile main menu links (mian-linklist class links)
// These include: Sale, Best Sellers, New Arrivals
const mainMenuLinks = [
  { text: 'sale', href: 'pages/collections-10th-anniversary-sale.html' },
  { text: 'best-sellers', href: 'pages/collections-best-sellers.html' },
  { text: 'new-arrivals', href: 'pages/collections-best-sellers.html' },
];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('href="#"') && line.includes('mian-linklist')) {
    for (const m of mainMenuLinks) {
      if (line.includes(m.text)) {
        lines[i] = line.replace('href="#"', `href="${m.href}"`);
        changeCount++;
        console.log(`✓ Line ${i+1}: mobile main menu → ${m.href}`);
        break;
      }
    }
  }
}

// Also handle the mobile drawer menu links that have class="menu-drawer__menu-item"
// and the MobileMenuList links
const mobileMenuLinks = [
  { idContains: 'MobileMenuList', text: 'Cast Iron', href: 'pages/collections-cast-iron-cookware.html' },
  { idContains: 'MobileMenuList', text: 'Tri-ply', href: 'pages/collections-tri-ply-stainless-steel.html' },
  { idContains: 'MobileMenuList', text: 'Tri-steel', href: 'pages/collections-best-stainless-steel-cookware.html' },
  { idContains: 'MobileMenuList', text: 'Sheet Iron', href: 'pages/collections-iron-cookware.html' },
];

html = lines.join('\n');

console.log(`\nTotal submenu-link changes: ${changeCount}`);

// Write the updated file
fs.writeFileSync(indexPath, html, 'utf-8');

// Final stats
const hashCount = (html.match(/href="#"/g) || []).length;
console.log(`Remaining href="#" count: ${hashCount}`);
console.log('\n✓ index.html updated successfully with submenu-link fixes!');
