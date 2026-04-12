import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');
const PAGES_DIR = path.join(PUBLIC_DIR, 'pages');

const mapping = JSON.parse(fs.readFileSync(path.join(__dirname, 'url-mapping.json'), 'utf-8'));

function fixHtml(content, isPage = false) {
    const prefix = isPage ? '../' : '';
    
    let fixed = content;

    // 1. Fix broken CSS links (href="#")
    // Use a multi-link replacement to ensure major styles are loaded
    const baseStyles = [
        'base.css',
        'component-card.css',
        'header.css',
        'footer.css',
        'section-footer.css',
        'template-collection.css'
    ].map(css => `<link href="${prefix}css/${css}" rel="stylesheet" type="text/css" media="all">`).join('\n    ');

    // Replace href="#" CSS links
    fixed = fixed.replace(/<link href="#" rel="stylesheet" type="text\/css" media="all" \/>/g, baseStyles);
    fixed = fixed.replace(/<link href="#" rel="stylesheet" type="text\/css" media="all">/g, baseStyles);

    // 2. Fix absolute script paths to the original domain
    fixed = fixed.replace(/src="\/\/www\.theindusvalley\.in\/cdn\/shop\/t\/166\/assets\/([^"?]+)(\?v=[^"]+)?"/g, 
        `src="${prefix}js/$1"`);
    fixed = fixed.replace(/src="\/\/www\.theindusvalley\.in\/[^"]*\/assets\/([^"?]+)(\?v=[^"]+)?"/g, 
        `src="${prefix}js/$1"`);

    // 3. Fix CDN images that might be absolute
    fixed = fixed.replace(/src="\/\/www\.theindusvalley\.in\/cdn\/shop\/files\/([^"?]+)(\?v=[^"]+)?"/g, 
        `src="${prefix}images/$1"`);

    // 4. Update internal links in the menubar and body
    for (const [originalUrl, localPath] of Object.entries(mapping)) {
        const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const localHref = isPage ? (localPath.startsWith('pages/') ? localPath.replace('pages/', '') : '../' + localPath) : localPath;
        
        fixed = fixed.replace(new RegExp(`href="${escapedUrl}"`, 'g'), `href="${localHref}"`);
        const relativeUrl = originalUrl.replace('https://www.theindusvalley.in', '');
        if (relativeUrl.startsWith('/')) {
            fixed = fixed.replace(new RegExp(`href="${relativeUrl}"`, 'g'), `href="${localHref}"`);
        }
    }

    // 5. Fix logo and home links
    fixed = fixed.replace(/href="https:\/\/www\.theindusvalley\.in\/"/g, `href="${prefix}index.html"`);
    fixed = fixed.replace(/href="https:\/\/www\.theindusvalley\.in"/g, `href="${prefix}index.html"`);
    fixed = fixed.replace(/src="images\/limson-logo\.png"/g, `src="${prefix}images/limson-logo.png"`);

    // 6. Fix the JS SyntaxError (Redeclarations)
    // Find 'let token = null;' and similar and remove 'let' if it appears more than once
    // A simpler way: change all 'let' to 'var' for these specific variables to allow redeclaration
    fixed = fixed.replace(/let token = null;/g, 'var token = null;');
    fixed = fixed.replace(/let isDropdownVisible = false;/g, 'var isDropdownVisible = false;');
    fixed = fixed.replace(/let isDropdownMobileVisible = false;/g, 'var isDropdownMobileVisible = false;');
    fixed = fixed.replace(/let isElementsWithAccountClickable = true;/g, 'var isElementsWithAccountClickable = true;');

    // 7. Fix dropdown unresponsiveness (ensure scripts and styles)
    if (!fixed.includes('details-disclosure.js') && fixed.includes('</head>')) {
        fixed = fixed.replace('</head>', `<script src="${prefix}js/details-disclosure.js" defer="defer"></script>\n</head>`);
    }
    
    if (!fixed.includes('/* Fix dropdown visibility */') && fixed.includes('</head>')) {
        const styleOverride = `
<style>
/* Fix dropdown visibility */
details[open] > .header__submenu { 
    display: block !important; 
    visibility: visible !important; 
    opacity: 1 !important;
}
details > summary { cursor: pointer; }
</style>
`;
        fixed = fixed.replace('</head>', `${styleOverride}\n</head>`);
    }

    return fixed;
}

// Process index.html
console.log('Processing index.html...');
const indexFilePath = path.join(PUBLIC_DIR, 'index.html');
if (fs.existsSync(indexFilePath)) {
    const indexContent = fs.readFileSync(indexFilePath, 'utf-8');
    const fixedIndex = fixHtml(indexContent, false);
    fs.writeFileSync(indexFilePath, fixedIndex);
    console.log('✓ index.html updated.');
}

// Process all pages
if (fs.existsSync(PAGES_DIR)) {
    const pages = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));
    console.log(`Processing ${pages.length} pages in public/pages/...`);

    pages.forEach(page => {
        const filePath = path.join(PAGES_DIR, page);
        const content = fs.readFileSync(filePath, 'utf-8');
        const fixedContent = fixHtml(content, true);
        fs.writeFileSync(filePath, fixedContent);
        console.log(`✓ ${page} updated.`);
    });
}

console.log('\nAll pages repaired successfully!');
