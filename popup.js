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
  
  const colors = [baseColor];
  
  // Complementary (opposite on color wheel)
  const compHsl = { h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l };
  const compRgb = hslToRgb(compHsl.h, compHsl.s, compHsl.l);
  colors.push(rgbToHex(compRgb.r, compRgb.g, compRgb.b));
  
  // Add lighter and darker variations
  colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  const lightRgb = hslToRgb(hsl.h, hsl.s, Math.min(95, hsl.l + 20));
  colors.push(rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b));
  const darkRgb = hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 20));
  colors.push(rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b));
  
  return colors;
}

function generateAnalogous(baseColor) {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const colors = [];
  const angles = [-30, -15, 0, 15, 30];
  
  angles.forEach(angle => {
    const newHsl = { h: (hsl.h + angle + 360) % 360, s: hsl.s, l: hsl.l };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  });
  
  return colors;
}

function generateTriadic(baseColor) {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const colors = [];
  const angles = [0, 120, 240];
  
  angles.forEach(angle => {
    const newHsl = { h: (hsl.h + angle) % 360, s: hsl.s, l: hsl.l };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  });
  
  // Add variations
  const light = hslToRgb(hsl.h, hsl.s, Math.min(90, hsl.l + 15));
  const dark = hslToRgb(hsl.h, hsl.s, Math.max(15, hsl.l - 15));
  colors.push(rgbToHex(light.r, light.g, light.b));
  colors.push(rgbToHex(dark.r, dark.g, dark.b));
  
  return colors;
}

function generateMonochromatic(baseColor) {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const colors = [];
  const lightnesses = [15, 35, 55, 75, 90];
  
  lightnesses.forEach(l => {
    const newRgb = hslToRgb(hsl.h, hsl.s, l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  });
  
  return colors;
}

function generateTetradic(baseColor) {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const colors = [];
  const angles = [0, 90, 180, 270];
  
  angles.forEach(angle => {
    const newHsl = { h: (hsl.h + angle) % 360, s: hsl.s, l: hsl.l };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  });
  
  // Add one more variation
  const neutralRgb = hslToRgb(hsl.h, 10, 50);
  colors.push(rgbToHex(neutralRgb.r, neutralRgb.g, neutralRgb.b));
  
  return colors;
}

// UI functions
function createPaletteCard(title, colors) {
  const card = document.createElement('div');
  card.className = 'palette-card';
  
  const titleEl = document.createElement('div');
  titleEl.className = 'palette-title';
  titleEl.textContent = title;
  
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
  
  card.appendChild(titleEl);
  card.appendChild(colorsContainer);
  
  return card;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification(`Copied ${text.toUpperCase()}!`);
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
