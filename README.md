# Palette Picker

A Firefox extension that generates beautiful color palettes based on colors you pick from any webpage!

## Features

- **Eyedropper Tool**: Click the eyedropper button to pick colors directly from any webpage (like Paint!)
- **Interactive Color Picker**: Or choose any color using a visual picker or by entering a hex code
- **5 Palette Types**: Get instant suggestions for:
  - Complementary (opposite colors on the color wheel)
  - Analogous (neighboring colors)
  - Triadic (evenly spaced colors)
  - Monochromatic (variations of one hue)
  - Tetradic (four harmonious colors)
- **One-Click Copy**: Click any color to copy its hex code to clipboard
- **Beautiful UI**: Clean, modern interface with smooth animations

## Installation

### For Development

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to this directory and select the `manifest.json` file
5. The extension icon will appear in your toolbar!

### How to Use

1. Click the extension icon in your Firefox toolbar
2. **Use the eyedropper**: Click the eyedropper button (pipette icon) and then click anywhere on the webpage to pick that color!
3. Or pick a color using the color picker or type a hex code manually
4. Browse through 5 different palette suggestions
5. Hover over any color to see its hex code
6. Click any color to copy it to your clipboard

## Files

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup UI
- `popup.js` - Color palette generation logic
- `styles.css` - Styling and animations
- `icons/` - Extension icons

## Color Theory

The extension uses color theory to generate harmonious palettes:
- **Complementary**: High contrast pairs
- **Analogous**: Smooth color transitions
- **Triadic**: Vibrant, balanced combinations
- **Monochromatic**: Subtle, cohesive schemes
- **Tetradic**: Rich, complex palettes

Enjoy creating beautiful color schemes!
