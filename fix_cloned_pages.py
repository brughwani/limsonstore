import os
import re
import json

PUBLIC_DIR = 'public'
PAGES_DIR = os.path.join(PUBLIC_DIR, 'pages')
MAPPING_FILE = 'url-mapping.json'

with open(MAPPING_FILE, 'r', encoding='utf-8') as f:
    mapping = json.load(f)

def fix_html(content, is_page=False):
    prefix = '../' if is_page else ''
    
    fixed = content

    # 1. Fix broken CSS links
    css_files = [
        'base.css',
        'component-card.css',
        'header.css',
        'footer.css',
        'section-footer.css',
        'template-collection.css'
    ]
    base_styles = '\n    '.join([f'<link href="{prefix}css/{css}" rel="stylesheet" type="text/css" media="all">' for css in css_files])

    fixed = fixed.replace('<link href="#" rel="stylesheet" type="text/css" media="all" />', base_styles)
    fixed = fixed.replace('<link href="#" rel="stylesheet" type="text/css" media="all">', base_styles)

    # 2. Fix absolute script paths
    fixed = re.sub(r'src="//www\.theindusvalley\.in/cdn/shop/t/166/assets/([^"?]+)(\?v=[^"]+)?"', 
                   rf'src="{prefix}js/\1"', fixed)
    fixed = re.sub(r'src="//www\.theindusvalley\.in/[^"]*/assets/([^"?]+)(\?v=[^"]+)?"', 
                   rf'src="{prefix}js/\1"', fixed)

    # 3. Fix CDN images
    fixed = re.sub(r'src="//www\.theindusvalley\.in/cdn/shop/files/([^"?]+)(\?v=[^"]+)?"', 
                   rf'src="{prefix}images/\1"', fixed)

    # 4. Update internal links
    for original_url, local_path in mapping.items():
        escaped_url = re.escape(original_url)
        local_href = local_path.replace('pages/', '') if is_page and local_path.startswith('pages/') else (prefix + local_path if is_page else local_path)
        
        fixed = re.sub(f'href="{escaped_url}"', f'href="{local_href}"', fixed)
        relative_url = original_url.replace('https://www.theindusvalley.in', '')
        if relative_url.startswith('/'):
            fixed = re.sub(f'href="{re.escape(relative_url)}"', f'href="{local_href}"', fixed)

    # 5. Fix logo and home links
    fixed = fixed.replace('href="https://www.theindusvalley.in/"', f'href="{prefix}index.html"')
    fixed = fixed.replace('href="https://www.theindusvalley.in"', f'href="{prefix}index.html"')
    fixed = fixed.replace('src="images/limson-logo.png"', f'src="{prefix}images/limson-logo.png"')

    # 6. Fix JS SyntaxError (Redeclarations)
    fixed = fixed.replace('let token = null;', 'var token = null;')
    fixed = fixed.replace('let isDropdownVisible = false;', 'var isDropdownVisible = false;')
    fixed = fixed.replace('let isDropdownMobileVisible = false;', 'var isDropdownMobileVisible = false;')
    fixed = fixed.replace('let isElementsWithAccountClickable = true;', 'var isElementsWithAccountClickable = true;')

    # 7. Add missing scripts/styles in head
    if 'details-disclosure.js' not in fixed and '</head>' in fixed:
        fixed = fixed.replace('</head>', f'<script src="{prefix}js/details-disclosure.js" defer="defer"></script>\n</head>')
    
    if '/* Fix dropdown visibility */' not in fixed and '</head>' in fixed:
        style_override = f'''
<style>
/* Fix dropdown visibility */
details[open] > .header__submenu {{ 
    display: block !important; 
    visibility: visible !important; 
    opacity: 1 !important;
}}
details > summary {{ cursor: pointer; }}
</style>
'''
        fixed = fixed.replace('</head>', f'{style_override}\n</head>')

    return fixed

# Process index.html
print('Processing index.html...')
index_file_path = os.path.join(PUBLIC_DIR, 'index.html')
if os.path.exists(index_file_path):
    with open(index_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    fixed_content = fix_html(content, False)
    with open(index_file_path, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    print('✓ index.html updated.')

# Process all pages
if os.path.exists(PAGES_DIR):
    pages = [f for f in os.listdir(PAGES_DIR) if f.endswith('.html')]
    print(f'Processing {len(pages)} pages in {PAGES_DIR}...')
    for page in pages:
        file_path = os.path.join(PAGES_DIR, page)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        fixed_content = fix_html(content, True)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f'✓ {page} updated.')

print('\nAll pages repaired successfully!')
