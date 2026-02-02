// Color manipulation utilities
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
}

// Palette generation functions
function generateComplementary(baseColor) {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const colors = [];
  
  // Slot 1: Base color
  colors.push(baseColor);
  
  // Slot 2: Lighter version of base
  const lightRgb = hslToRgb(hsl.h, Math.max(20, hsl.s - 10), Math.min(95, hsl.l + 25));
  colors.push(rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b));
  
  // Slot 3: Complementary (180° opposite)
  const compRgb = hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l);
  colors.push(rgbToHex(compRgb.r, compRgb.g, compRgb.b));
  
  // Slot 4: Darker version of base
  const darkRgb = hslToRgb(hsl.h, Math.min(100, hsl.s + 10), Math.max(15, hsl.l - 25));
  colors.push(rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b));
  
  // Slot 5: Muted version of complement
  const mutedCompRgb = hslToRgb((hsl.h + 180) % 360, Math.max(20, hsl.s - 30), hsl.l);
  colors.push(rgbToHex(mutedCompRgb.r, mutedCompRgb.g, mutedCompRgb.b));
  
  return colors;
}

function generateAnalogous(baseColor) {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const colors = [];
  
  // Slot 1: Very light background color
  const bgRgb = hslToRgb(hsl.h, Math.max(15, hsl.s - 20), 90);
  colors.push(rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b));
  
  // Slot 2: -30° with reduced saturation
  const left30Rgb = hslToRgb((hsl.h - 30 + 360) % 360, Math.max(20, hsl.s - 15), hsl.l);
  colors.push(rgbToHex(left30Rgb.r, left30Rgb.g, left30Rgb.b));
  
  // Slot 3: Base color
  colors.push(baseColor);
  
  // Slot 4: +30° with reduced saturation
  const right30Rgb = hslToRgb((hsl.h + 30) % 360, Math.max(20, hsl.s - 15), hsl.l);
  colors.push(rgbToHex(right30Rgb.r, right30Rgb.g, right30Rgb.b));
  
  // Slot 5: Very dark shade for text
  const textRgb = hslToRgb(hsl.h, Math.min(100, hsl.s + 10), 20);
  colors.push(rgbToHex(textRgb.r, textRgb.g, textRgb.b));
  
  return colors;
}

function generateTriadic(baseColor) {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const colors = [];
  
  // Slot 1: Very light neutral background
  const bgRgb = hslToRgb(hsl.h, 10, 92);
  colors.push(rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b));
  
  // Slot 2: Base color
  colors.push(baseColor);
  
  // Slot 3: +120° 
  const triad1Rgb = hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l);
  colors.push(rgbToHex(triad1Rgb.r, triad1Rgb.g, triad1Rgb.b));
  
  // Slot 4: +240°
  const triad2Rgb = hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l);
  colors.push(rgbToHex(triad2Rgb.r, triad2Rgb.g, triad2Rgb.b));
  
  // Slot 5: Very dark neutral for text
  const textRgb = hslToRgb(hsl.h, 10, 18);
  colors.push(rgbToHex(textRgb.r, textRgb.g, textRgb.b));
  
  return colors;
}

function generateMonochromatic(baseColor) {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const colors = [];
  
  // Slot 1: Base color
  colors.push(baseColor);
  
  // Slot 2: Lighter tint
  const tintRgb = hslToRgb(hsl.h, Math.max(10, hsl.s - 10), Math.min(95, hsl.l + 20));
  colors.push(rgbToHex(tintRgb.r, tintRgb.g, tintRgb.b));
  
  // Slot 3: Very light highlight
  const highlightRgb = hslToRgb(hsl.h, Math.max(10, hsl.s - 20), 88);
  colors.push(rgbToHex(highlightRgb.r, highlightRgb.g, highlightRgb.b));
  
  // Slot 4: Darker shade
  const shadeRgb = hslToRgb(hsl.h, Math.min(100, hsl.s + 10), Math.max(15, hsl.l - 20));
  colors.push(rgbToHex(shadeRgb.r, shadeRgb.g, shadeRgb.b));
  
  // Slot 5: Desaturated muted tone
  const mutedRgb = hslToRgb(hsl.h, Math.max(5, hsl.s - 40), hsl.l);
  colors.push(rgbToHex(mutedRgb.r, mutedRgb.g, mutedRgb.b));
  
  return colors;
}

function generateTetradic(baseColor) {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const colors = [];
  
  // Slot 1: Base color
  colors.push(baseColor);
  
  // Slot 2: +60° offset
  const offset60Rgb = hslToRgb((hsl.h + 60) % 360, Math.max(20, hsl.s - 10), hsl.l);
  colors.push(rgbToHex(offset60Rgb.r, offset60Rgb.g, offset60Rgb.b));
  
  // Slot 3: +180° complement
  const comp180Rgb = hslToRgb((hsl.h + 180) % 360, Math.max(20, hsl.s - 10), hsl.l);
  colors.push(rgbToHex(comp180Rgb.r, comp180Rgb.g, comp180Rgb.b));
  
  // Slot 4: +240° second complement
  const comp240Rgb = hslToRgb((hsl.h + 240) % 360, Math.max(20, hsl.s - 10), hsl.l);
  colors.push(rgbToHex(comp240Rgb.r, comp240Rgb.g, comp240Rgb.b));
  
  // Slot 5: Neutral link color (light cream or dark charcoal based on base lightness)
  const linkColor = hsl.l > 50 
    ? hslToRgb(hsl.h, 8, 22)  // Dark charcoal
    : hslToRgb(hsl.h, 8, 95); // Light cream
  colors.push(rgbToHex(linkColor.r, linkColor.g, linkColor.b));
  
  return colors;
}

function generateSplitComplementary(baseColor) {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const colors = [];
  
  // Slot 1: Base color
  colors.push(baseColor);
  
  // Slot 2: +150° (left of opposite)
  const split1Rgb = hslToRgb((hsl.h + 150) % 360, Math.max(20, hsl.s - 10), hsl.l);
  colors.push(rgbToHex(split1Rgb.r, split1Rgb.g, split1Rgb.b));
  
  // Slot 3: +210° (right of opposite)
  const split2Rgb = hslToRgb((hsl.h + 210) % 360, Math.max(20, hsl.s - 10), hsl.l);
  colors.push(rgbToHex(split2Rgb.r, split2Rgb.g, split2Rgb.b));
  
  // Slot 4: Light tint of base
  const lightRgb = hslToRgb(hsl.h, Math.max(15, hsl.s - 20), 88);
  colors.push(rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b));
  
  // Slot 5: Dark shade of base
  const darkRgb = hslToRgb(hsl.h, Math.min(100, hsl.s + 10), 22);
  colors.push(rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b));
  
  return colors;
}

// UI functions
function createPaletteCard(title, colors) {
  const card = document.createElement('div');
  card.className = 'palette-card';
  
  const header = document.createElement('div');
  header.className = 'palette-header';
  
  const titleEl = document.createElement('div');
  titleEl.className = 'palette-title';
  titleEl.textContent = title;
  
  const copyAllBtn = document.createElement('button');
  copyAllBtn.className = 'copy-all-btn';
  copyAllBtn.textContent = 'Copy All';
  copyAllBtn.addEventListener('click', () => copyAllColors(colors));
  
  header.appendChild(titleEl);
  header.appendChild(copyAllBtn);
  
  const colorsContainer = document.createElement('div');
  colorsContainer.className = 'palette-colors';
  
  colors.forEach(color => {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;
    
    const colorCode = document.createElement('div');
    colorCode.className = 'color-code';
    colorCode.textContent = color.toUpperCase();
    
    colorBox.appendChild(colorCode);
    colorBox.addEventListener('click', () => copyToClipboard(color));
    
    colorsContainer.appendChild(colorBox);
  });
  
  card.appendChild(header);
  card.appendChild(colorsContainer);
  
  return card;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification(`Copied ${text.toUpperCase()}!`);
  });
}

function copyAllColors(colors) {
  const allColors = colors.map(c => c.toUpperCase()).join(', ');
  navigator.clipboard.writeText(allColors).then(() => {
    showNotification(`Copied all ${colors.length} colors!`);
  });
}

function copyAllColors(colors) {
  const allColors = colors.map(c => c.toUpperCase()).join(', ');
  navigator.clipboard.writeText(allColors).then(() => {
    showNotification(`Copied all ${colors.length} colors!`);
  });
}

function showNotification(message) {
  let notification = document.querySelector('.copied-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'copied-notification';
    document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

function updatePalettes(color) {
  const container = document.getElementById('palettesContainer');
  container.innerHTML = '';
  
  const palettes = [
    { title: 'Complementary', colors: generateComplementary(color) },
    { title: 'Split Complementary', colors: generateSplitComplementary(color) },
    { title: 'Analogous', colors: generateAnalogous(color) },
    { title: 'Triadic', colors: generateTriadic(color) },
    { title: 'Monochromatic', colors: generateMonochromatic(color) },
    { title: 'Tetradic', colors: generateTetradic(color) }
  ];
  
  palettes.forEach(palette => {
    container.appendChild(createPaletteCard(palette.title, palette.colors));
  });
}

// Event listeners
const colorPicker = document.getElementById('colorPicker');
const colorInput = document.getElementById('colorInput');
const eyedropperBtn = document.getElementById('eyedropperBtn');

colorPicker.addEventListener('input', (e) => {
  const color = e.target.value;
  colorInput.value = color;
  updatePalettes(color);
});

colorInput.addEventListener('input', (e) => {
  let color = e.target.value.trim();
  if (!color.startsWith('#')) {
    color = '#' + color;
  }
  
  if (/^#[0-9A-F]{6}$/i.test(color)) {
    colorPicker.value = color;
    updatePalettes(color);
  }
});

// Eyedropper functionality
eyedropperBtn.addEventListener('click', async () => {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    
    if (tabs[0]) {
      // Check if we can access this tab
      const url = tabs[0].url;
      if (url.startsWith('about:') || url.startsWith('moz-extension:')) {
        showNotification('Cannot pick colors from browser pages');
        return;
      }
      
      // Capture screenshot first
      const dataUrl = await browser.tabs.captureVisibleTab(null, { format: 'png' });
      
      // Try to send screenshot to content script
      try {
        await browser.tabs.sendMessage(tabs[0].id, {
          action: 'screenshotReady',
          dataUrl: dataUrl
        });
      } catch (e) {
        // Content script might not be loaded, inject it
        await browser.tabs.executeScript(tabs[0].id, { file: 'content.js' });
        
        // Try again after injection
        await browser.tabs.sendMessage(tabs[0].id, {
          action: 'screenshotReady',
          dataUrl: dataUrl
        });
      }
      
      // Close popup after screenshot is sent
      window.close();
    }
  } catch (error) {
    console.error('Error starting color picker:', error);
    showNotification('Error: ' + error.message);
  }
});

// Listen for picked color from content script
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'colorPicked' && message.color) {
    colorPicker.value = message.color;
    colorInput.value = message.color;
    updatePalettes(message.color);
  }
});

// Check if there's a picked color from background on load
browser.runtime.sendMessage({ action: 'getPickedColor' })
  .then(response => {
    if (response && response.color) {
      colorPicker.value = response.color;
      colorInput.value = response.color;
      updatePalettes(response.color);
    }
  })
  .catch(() => {
    // No picked color, that's fine
  });

// Initialize with default color
updatePalettes(colorPicker.value);
