# PWA Icon Generation Guide

The PWA manifest requires icons in multiple sizes. Here's how to generate them:

## Required Icon Sizes

- 72x72 (icon-72.png)
- 96x96 (icon-96.png)
- 128x128 (icon-128.png)
- 144x144 (icon-144.png)
- 152x152 (icon-152.png)
- 192x192 (icon-192.png)
- 384x384 (icon-384.png)
- 512x512 (icon-512.png)

## Methods to Generate Icons

### Option 1: Using Online Tools (Easiest)

1. Visit https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload your logo (ideally 512x512 or larger)
3. Download the generated icon pack
4. Place all icons in the `public/` directory

### Option 2: Using ImageMagick (Command Line)

If you have a source icon (e.g., `logo.svg` or `logo.png`), run:

```bash
# Install ImageMagick first
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Generate all sizes
convert logo.png -resize 72x72 public/icon-72.png
convert logo.png -resize 96x96 public/icon-96.png
convert logo.png -resize 128x128 public/icon-128.png
convert logo.png -resize 144x144 public/icon-144.png
convert logo.png -resize 152x152 public/icon-152.png
convert logo.png -resize 192x192 public/icon-192.png
convert logo.png -resize 384x384 public/icon-384.png
convert logo.png -resize 512x512 public/icon-512.png
```

### Option 3: Using Node.js with Sharp

Create a script:

```bash
npm install sharp --save-dev
```

Then create `scripts/generate-icons.js`:

```javascript
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const sourceIcon = 'logo.png' // Your source icon

async function generateIcons() {
  for (const size of sizes) {
    await sharp(sourceIcon)
      .resize(size, size)
      .toFile(path.join('public', `icon-${size}.png`))
    console.log(`Generated icon-${size}.png`)
  }
}

generateIcons()
```

Run with:
```bash
node scripts/generate-icons.js
```

## Design Recommendations

- Use a simple, recognizable logo
- Ensure good contrast with the background color (#FAF7F2)
- Test on both light and dark device backgrounds
- Consider adding padding (safe area) for maskable icons
- Use your brand colors (clay #A6452E, gold #F3C65D)

## Screenshots for PWA

The manifest also references screenshots. Create these:

1. **Mobile Screenshot** (390x844):
   - Take a screenshot on mobile or use browser dev tools
   - Capture the home page or resources page
   - Save as `public/screenshot-mobile.png`

2. **Desktop Screenshot** (1280x720):
   - Capture the home page at desktop resolution
   - Save as `public/screenshot-desktop.png`

## Testing Your PWA

After adding icons:

1. Build and deploy: `npm run build && npm start`
2. Open in Chrome
3. Open DevTools > Application > Manifest
4. Verify all icons are listed
5. Test "Add to Home Screen" functionality

## Current Status

✅ Manifest configured
✅ Service worker created
✅ Meta tags added
⏳ Icons need to be generated (follow steps above)
⏳ Screenshots need to be captured

Once icons are created, your PWA will be fully functional!
