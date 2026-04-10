import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the URL mapping
const mapping = JSON.parse(fs.readFileSync(path.join(__dirname, 'url-mapping.json'), 'utf-8'));

// Read index.html
const indexPath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Build specific replacements from the git diff data
// These are the exact id→URL mappings from the original file
const headerMenuMappings = {
  // Cast Iron submenu
  'HeaderMenu-cast-iron-cookware-all-cast-iron-cookware': '/collections/cast-iron-cookware',
  'HeaderMenu-cast-iron-cookware-super-smooth-cookware': '/collections/super-smooth-cast-iron-cookware',
  'HeaderMenu-cast-iron-cookware-cookware-sets': '/collections/cast-iron-combos',
  'HeaderMenu-cast-iron-cookware-tawa': '/collections/cast-iron-tawa',
  'HeaderMenu-cast-iron-cookware-kadai': '/collections/cast-iron-kadai',
  'HeaderMenu-cast-iron-cookware-fry-pan': '/collections/cast-iron-fry-pan',
  'HeaderMenu-cast-iron-cookware-grill-pan': '/collections/cast-iron-grill-pan',
  'HeaderMenu-cast-iron-cookware-paniyaram-pan': '/collections/cast-iron-paniyaram-pan',
  'HeaderMenu-cast-iron-cookware-appam-pan': '/collections/cast-iron-appam-pan',
  'HeaderMenu-cast-iron-cookware-dutch-oven': '/collections/cast-iron-dutch-oven',
  'HeaderMenu-cast-iron-cookware-tadka-pan': '/collections/cast-iron-tadka-pan',
  'HeaderMenu-cast-iron-cookware-accessories': '/collections/kitchen-accessories',
  
  // Tri-ply submenu
  'HeaderMenu-tri-ply-cookware-all-triply-stainless-steel-cookware': '/collections/tri-ply-stainless-steel',
  'HeaderMenu-tri-ply-cookware-cookware-sets': '/collections/triply-stainless-steel-combo',
  'HeaderMenu-tri-ply-cookware-kadai': '/collections/triply-stainless-steel-kadai',
  'HeaderMenu-tri-ply-cookware-casserole-biryani-pot': '/collections/triply-stainless-steel-biryani-pot',
  'HeaderMenu-tri-ply-cookware-fry-pan-skillet': '/collections/triply-stainless-steel-fry-pan',
  'HeaderMenu-tri-ply-cookware-saucepan': '/collections/triply-stainless-steel-sauce-pan',
  'HeaderMenu-tri-ply-cookware-tasla': '/products/triply-tasla',
  'HeaderMenu-tri-ply-cookware-tope': '/products/triply-tope-with-lid',
  'HeaderMenu-tri-ply-cookware-tadka-pan': '/collections/tadka-pan',
  
  // Tri-steel submenu
  'HeaderMenu-tri-steel-cookware-all-stainless-steel-cookware': '/collections/best-stainless-steel-cookware',
  'HeaderMenu-tri-steel-cookware-cookware-sets': '/collections/tri-steel-cookware-set-combo',
  'HeaderMenu-tri-steel-cookware-idli-maker-steamer': '/collections/multi-pot',
  'HeaderMenu-tri-steel-cookware-kadai': '/products/stainless-steel-capsule-bottom-kadai',
  'HeaderMenu-tri-steel-cookware-casserole-biryani-pot': '/products/stainless-steel-capsule-casserole-stockpot',
  'HeaderMenu-tri-steel-cookware-fry-pan-skillet': '/collections/tri-steel-fry-pan',
  'HeaderMenu-tri-steel-cookware-saucepan': '/products/stainless-steel-capsule-bottom-milk-tea-pan',
  'HeaderMenu-tri-steel-cookware-milk-warmer': '/products/premium-stainless-steel-coffee-tea-milk-warmer-650-ml',
  'HeaderMenu-tri-steel-cookware-drinkware': '/collections/drinkware',
  
  // Direct links
  'HeaderMenu-pressure-cooker': '/collections/pressure-cooker',
  'HeaderMenu-drinkware': '/collections/drinkware',
  'HeaderMenu-bestsellers': '/collections/best-sellers',
  'HeaderMenu-10th-anniversary-sale': '/collections/10th-anniversary-sale',
  
  // Cookware Sets submenu
  'HeaderMenu-cookware-sets-all-cookware-combos': '/collections/cookware-set-combo-offer',
  'HeaderMenu-cookware-sets-pressure-cooker': '/collections/pressure-cooker-combos',
  'HeaderMenu-cookware-sets-cast-iron': '/collections/cast-iron-combos',
  'HeaderMenu-cookware-sets-tri-ply-stainless-steel': '/collections/triply-stainless-steel-combo',
  'HeaderMenu-cookware-sets-tri-steel-stainless-steel': '/collections/tri-steel-cookware-set-combo',
  'HeaderMenu-cookware-sets-sheet-iron': '/collections/iron-combos',
  
  // Sheet Iron submenu
  'HeaderMenu-sheet-iron-cookware-all-sheet-iron-cookware': '/collections/iron-cookware',
  'HeaderMenu-sheet-iron-cookware-cookware-sets': '/collections/iron-combos',
  'HeaderMenu-sheet-iron-cookware-tawa': '/collections/iron-tawa',
  'HeaderMenu-sheet-iron-cookware-kadai-wok': '/collections/iron-kadai',
  'HeaderMenu-sheet-iron-cookware-fry-pan': '/collections/sheet-iron-fry-pan',
  'HeaderMenu-sheet-iron-cookware-tadka-pan': '/collections/iron-tadka-pan',
};

// Convert path to local page file
function pathToLocalHref(originalPath) {
  const fullUrl = `https://www.theindusvalley.in${originalPath}`;
  if (mapping[fullUrl]) {
    return mapping[fullUrl];
  }
  if (mapping[originalPath]) {
    return mapping[originalPath];
  }
  // Construct from path
  const pathPart = originalPath.replace(/^\//, '').replace(/\//g, '-');
  const localFile = `pages/${pathPart}.html`;
  // Check if the file actually exists
  if (fs.existsSync(path.join(__dirname, 'public', localFile))) {
    return localFile;
  }
  return '#'; // fallback
}

let changeCount = 0;

// 1. Update HeaderMenu links by ID
for (const [id, originalPath] of Object.entries(headerMenuMappings)) {
  const localHref = pathToLocalHref(originalPath);
  if (localHref === '#') continue;
  
  // Match: id="HeaderMenu-xxx" ... href="#"
  // The id and href may not be adjacent, so we need a flexible regex
  const regex = new RegExp(
    `(id="${id}"[^>]*?)href="#"`,
    'g'
  );
  
  const newHtml = html.replace(regex, `$1href="${localHref}"`);
  if (newHtml !== html) {
    changeCount++;
    console.log(`✓ ${id} → ${localHref}`);
    html = newHtml;
  } else {
    console.log(`⚠ ${id} - no match found (may have different format)`);
  }
}

// 2. Also update links that use href="#" with class="submenu-link" 
// These are in the mobile mega menu / drawer
// We need to find them by context. Let's use the original URL mapping from the git diff.
const submenuLinkMappings = {
  // These use class="submenu-link" format: href="original-url" class="submenu-link"
  '/collections/cookware-set-combo-offer': 'pages/collections-cookware-set-combo-offer.html',
  '/collections/cast-iron-combos': 'pages/collections-cast-iron-combos.html',
  '/collections/triply-stainless-steel-combo': 'pages/collections-triply-stainless-steel-combo.html',
  '/collections/tri-steel-cookware-set-combo': 'pages/collections-tri-steel-cookware-set-combo.html',
  '/collections/iron-combos': 'pages/collections-iron-combos.html',
  '/collections/pressure-cooker-combos': 'pages/collections-pressure-cooker-combos.html',
  '/collections/pressure-cooker': 'pages/collections-pressure-cooker.html',
  '/collections/tawa': 'pages/collections-tawa.html',
  '/collections/kadai': 'pages/collections-kadai.html',
  '/collections/frying-pan-skillet': 'pages/collections-frying-pan-skillet.html',
  '/collections/biryani-pot-stock-pot': 'pages/collections-biryani-pot-stock-pot.html',
  '/collections/paniyaram-pan': 'pages/collections-paniyaram-pan.html',
  '/collections/multi-pot': 'pages/collections-multi-pot.html',
  '/collections/sauce-pan': 'pages/collections-sauce-pan.html',
  '/collections/grill-pans': 'pages/collections-grill-pans.html',
  '/collections/appam-pan': 'pages/collections-appam-pan.html',
  '/collections/tadka-pan': 'pages/collections-tadka-pan.html',
  '/collections/drinkware': 'pages/collections-drinkware.html',
  '/collections/kitchen-accessories': 'pages/collections-kitchen-accessories.html',
  '/collections/cast-iron-cookware': 'pages/collections-cast-iron-cookware.html',
  '/collections/tri-ply-stainless-steel': 'pages/collections-tri-ply-stainless-steel.html',
  '/collections/best-stainless-steel-cookware': 'pages/collections-best-stainless-steel-cookware.html',
  '/collections/iron-cookware': 'pages/collections-iron-cookware.html',
  '/collections/wooden-kitchenware': 'pages/collections-wooden-kitchenware.html',
  '/collections/super-smooth-cast-iron-cookware': 'pages/collections-super-smooth-cast-iron-cookware.html',
  '/collections/cast-iron-tawa': 'pages/collections-cast-iron-tawa.html',
  '/collections/cast-iron-kadai': 'pages/collections-cast-iron-kadai.html',
  '/collections/cast-iron-fry-pan': 'pages/collections-cast-iron-fry-pan.html',
  '/collections/cast-iron-grill-pan': 'pages/collections-cast-iron-grill-pan.html',
  '/collections/cast-iron-paniyaram-pan': 'pages/collections-cast-iron-paniyaram-pan.html',
  '/collections/cast-iron-appam-pan': 'pages/collections-cast-iron-appam-pan.html',
  '/collections/cast-iron-dutch-oven': 'pages/collections-cast-iron-dutch-oven.html',
  '/collections/cast-iron-tadka-pan': 'pages/collections-cast-iron-tadka-pan.html',
  '/collections/triply-stainless-steel-kadai': 'pages/collections-triply-stainless-steel-kadai.html',
  '/collections/triply-stainless-steel-biryani-pot': 'pages/collections-triply-stainless-steel-biryani-pot.html',
  '/collections/triply-stainless-steel-fry-pan': 'pages/collections-triply-stainless-steel-fry-pan.html',
  '/collections/triply-stainless-steel-sauce-pan': 'pages/collections-triply-stainless-steel-sauce-pan.html',
  '/collections/tri-steel-fry-pan': 'pages/collections-tri-steel-fry-pan.html',
  '/collections/iron-tawa': 'pages/collections-iron-tawa.html',
  '/collections/iron-kadai': 'pages/collections-iron-kadai.html',
  '/collections/iron-tadka-pan': 'pages/collections-iron-tadka-pan.html',
  '/collections/sheet-iron-fry-pan': 'pages/collections-sheet-iron-fry-pan.html',
  '/collections/best-sellers': 'pages/collections-best-sellers.html',
  '/collections/10th-anniversary-sale': 'pages/collections-10th-anniversary-sale.html',
  '/collections/new-arrivals': 'pages/collections-best-sellers.html', // fallback to best sellers
};

// Replace all href="#" that are for submenu-link class items
// These were changed from specific URLs to "#"
// We need to match them by nearby context (class name, text, etc.)
// The safest approach is a global search-and-replace by class="submenu-link" context

// Let's also do a broad replacement: any href="#" that has class containing "submenu-link"
// Pattern: href="#" class="submenu-link" or class="submenu-link" href="#"
// But since these were ALL changed to "#", we need to restore them differently.

// Actually, the submenu links in the mobile drawer were ALSO changed to href="#".
// We need to look at the full git diff to get the exact mapping.
// Let's just restore ALL known collection/product links throughout the file.

// Strategy: For each known local page, find all anchor tags throughout index.html
// that SHOULD link to it based on their context (text content, id, class)

// A simpler approach: do a second pass replacing any remaining 
// theindusvalley.in references and known collection paths

// First, let's count the remaining href="#" instances
const hashCount = (html.match(/href="#"/g) || []).length;
console.log(`\nRemaining href="#" count: ${hashCount}`);

// Now let's handle the mobile drawer and mega menu submenu-link items
// These items still have href="#" after our ID-based replacement
// The drawer menu duplicates use the same class patterns

// Let's look at the structure of the remaining href="#" links
// and try to match them by their surrounding text content

// We'll do a targeted regex replacement where we look for
// href="#" class="submenu-link" patterns and try to determine the right link
// by the subsequent text content

const submenuTextToUrl = {
  'Combos & Sets': 'pages/collections-cookware-set-combo-offer.html',
  'Cast Iron Combos': 'pages/collections-cast-iron-combos.html',
  'Triply Stainless Steel Combos': 'pages/collections-triply-stainless-steel-combo.html',
  'Tri-steel Combos': 'pages/collections-tri-steel-cookware-set-combo.html',
  'Iron Combos': 'pages/collections-iron-combos.html',
  'Pressure Cooker Combos': 'pages/collections-pressure-cooker-combos.html',
  'Pressure Cooker': 'pages/collections-pressure-cooker.html',
  'Cookware Combos': 'pages/collections-cookware-set-combo-offer.html',
  'Tawa': 'pages/collections-tawa.html',
  'Kadai': 'pages/collections-kadai.html',
  'Frying Pan & Skillet': 'pages/collections-frying-pan-skillet.html',
  'Biryani Pot & Stock Pot': 'pages/collections-biryani-pot-stock-pot.html',
  'Paniyaram Pan': 'pages/collections-paniyaram-pan.html',
  'Multi Pot': 'pages/collections-multi-pot.html',
  'Sauce Pan': 'pages/collections-sauce-pan.html',
  'Grill Pans': 'pages/collections-grill-pans.html',
  'Appam Pan': 'pages/collections-appam-pan.html',
  'Tadka Pan': 'pages/collections-tadka-pan.html',
  'Drinkware': 'pages/collections-drinkware.html',
  'Kitchen Accessories': 'pages/collections-kitchen-accessories.html',
  'Cast Iron Cookware': 'pages/collections-cast-iron-cookware.html',
  'Tri-ply Stainless Steel': 'pages/collections-tri-ply-stainless-steel.html',
  'Stainless Steel Cookware': 'pages/collections-best-stainless-steel-cookware.html',
  'Iron Cookware': 'pages/collections-iron-cookware.html',
  'Wooden Kitchenware': 'pages/collections-wooden-kitchenware.html',
  'Super Smooth Cookware': 'pages/collections-super-smooth-cast-iron-cookware.html',
  'Cast Iron Tawa': 'pages/collections-cast-iron-tawa.html',
  'Cast Iron Kadai': 'pages/collections-cast-iron-kadai.html',
  'Cast Iron Fry Pan': 'pages/collections-cast-iron-fry-pan.html',
  'Cast Iron Grill Pan': 'pages/collections-cast-iron-grill-pan.html',
  'Cast Iron Paniyaram Pan': 'pages/collections-cast-iron-paniyaram-pan.html',
  'Cast Iron Appam Pan': 'pages/collections-cast-iron-appam-pan.html',
  'Dutch Oven': 'pages/collections-cast-iron-dutch-oven.html',
  'Cast Iron Tadka Pan': 'pages/collections-cast-iron-tadka-pan.html',
  'Best Sellers': 'pages/collections-best-sellers.html',
  'Bestsellers': 'pages/collections-best-sellers.html',
  'New Arrivals': 'pages/collections-best-sellers.html',
  '10th Anniversary Sale': 'pages/collections-10th-anniversary-sale.html',
};

// Also replace links in mobile menu drawer area
// Pattern: href="#" class="submenu-link">...<img...alt="Text">
// or href="#" class="... submenu-link ...">Text
html = html.replace(
  /href="#"(\s+class="submenu-link"[^>]*>)/g,
  (match, rest) => {
    // Try to find text after the tag to determine which link this should be
    return match; // We'll handle these differently
  }
);

// More targeted: replace by line-by-line analysis
const lines = html.split('\n');
let submenuChangeCount = 0;

for (let i = 0; i < lines.length; i++) {
  // Look for submenu-link with href="#"
  if (lines[i].includes('href="#"') && lines[i].includes('class="submenu-link"')) {
    // Check the next few lines for the link text
    const contextLines = lines.slice(i, i + 5).join(' ');
    
    // Try to extract alt text or link text
    let matched = false;
    for (const [text, localPath] of Object.entries(submenuTextToUrl)) {
      if (contextLines.includes(`alt="${text}"`) || 
          contextLines.includes(`>${text}<`) ||
          contextLines.includes(`> ${text} <`)) {
        lines[i] = lines[i].replace('href="#"', `href="${localPath}"`);
        submenuChangeCount++;
        matched = true;
        break;
      }
    }
  }
  
  // Also handle links with mian-linklist class (mobile main menu)
  if (lines[i].includes('href="#"') && 
      (lines[i].includes('mian-linklist') || lines[i].includes('mainmenublock-list'))) {
    const contextLines = lines.slice(i, i + 3).join(' ');
    
    if (contextLines.includes('sale') || contextLines.includes('Sale')) {
      lines[i] = lines[i].replace('href="#"', 'href="pages/collections-10th-anniversary-sale.html"');
      submenuChangeCount++;
    } else if (contextLines.includes('best-sellers') || contextLines.includes('Best Seller')) {
      lines[i] = lines[i].replace('href="#"', 'href="pages/collections-best-sellers.html"');
      submenuChangeCount++;
    } else if (contextLines.includes('new-arrivals') || contextLines.includes('New Arrival')) {
      lines[i] = lines[i].replace('href="#"', 'href="pages/collections-best-sellers.html"');
      submenuChangeCount++;
    }
  }
}

html = lines.join('\n');
console.log(`Updated ${submenuChangeCount} submenu-link entries`);

// Final count
const finalHashCount = (html.match(/href="#"/g) || []).length;
console.log(`Final href="#" count: ${finalHashCount} (was ${hashCount})`);
console.log(`Total HeaderMenu changes: ${changeCount}`);

// Write the updated file
fs.writeFileSync(indexPath, html, 'utf-8');
console.log('\n✓ index.html updated successfully!');
