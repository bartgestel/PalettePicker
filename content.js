// Content script for color picking
let isPickingColor = false;
let overlay = null;
let colorPreview = null;
let screenshotDataUrl = null;
let screenshotImg = null;

// Listen for messages from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'screenshotReady' && message.dataUrl) {
    screenshotDataUrl = message.dataUrl;
    loadScreenshotAndStart();
    sendResponse({ status: 'loaded' });
  } else if (message.action === 'colorPicked' && message.color) {
    // This gets sent back to popup when a color is picked
    sendResponse({ status: 'received' });
  }
  return true;
});

function loadScreenshotAndStart() {
  screenshotImg = new Image();
  screenshotImg.onload = () => {
    startColorPicking();
  };
  screenshotImg.onerror = (e) => {
    console.error('Failed to load screenshot:', e);
  };
  screenshotImg.src = screenshotDataUrl;
}

function createOverlay() {
  overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: crosshair;
    z-index: 2147483647;
    background: transparent;
  `;
  
  colorPreview = document.createElement('div');
  colorPreview.style.cssText = `
    position: fixed;
    width: 50px;
    height: 50px;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(0,0,0,0.2);
    pointer-events: none;
    z-index: 2147483648;
    display: none;
  `;
  
  document.documentElement.appendChild(overlay);
  document.documentElement.appendChild(colorPreview);
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

function getColorAtPoint(x, y) {
  if (!screenshotImg) return null;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = screenshotImg.width;
    canvas.height = screenshotImg.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(screenshotImg, 0, 0);
    
    const pixelRatio = window.devicePixelRatio || 1;
    const scaledX = Math.floor(x * pixelRatio);
    const scaledY = Math.floor(y * pixelRatio);
    
    const imageData = ctx.getImageData(scaledX, scaledY, 1, 1);
    const pixel = imageData.data;
    return rgbToHex(pixel[0], pixel[1], pixel[2]);
  } catch (e) {
    console.error('Error getting pixel color:', e);
    return null;
  }
}

function handleMouseMove(e) {
  if (!isPickingColor) return;
  
  const previewOffset = 25;
  let previewX = e.clientX + previewOffset;
  let previewY = e.clientY + previewOffset;
  
  if (previewX + 60 > window.innerWidth) previewX = e.clientX - 60 - previewOffset;
  if (previewY + 60 > window.innerHeight) previewY = e.clientY - 60 - previewOffset;
  
  colorPreview.style.left = previewX + 'px';
  colorPreview.style.top = previewY + 'px';
  colorPreview.style.display = 'block';
  
  const color = getColorAtPoint(e.clientX, e.clientY);
  if (color) {
    colorPreview.style.backgroundColor = color;
  }
}

function handleClick(e) {
  if (!isPickingColor) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const color = getColorAtPoint(e.clientX, e.clientY);
  if (color) {
    // Send color to background script
    browser.runtime.sendMessage({
      action: 'colorPicked',
      color: color
    }).then(() => {
      stopColorPicking();
      // Show notification
      showNotification(`Color ${color.toUpperCase()} saved! Click the extension icon.`);
    });
  } else {
    stopColorPicking();
  }
}

function handleEscape(e) {
  if (e.key === 'Escape' && isPickingColor) {
    stopColorPicking();
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: #1a1a1a;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-weight: 500;
    font-size: 14px;
    z-index: 2147483647;
    max-width: 320px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease-out;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add icon
  const icon = document.createElement('div');
  icon.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  `;
  icon.style.cssText = 'flex-shrink: 0; display: flex;';
  
  const text = document.createElement('div');
  text.textContent = message;
  text.style.cssText = 'line-height: 1.5;';
  
  notification.appendChild(icon);
  notification.appendChild(text);
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.2s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 200);
  }, 4000);
}

function startColorPicking() {
  if (isPickingColor) return;
  if (!screenshotImg) {
    console.error('No screenshot available');
    return;
  }
  
  isPickingColor = true;
  createOverlay();
  
  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('click', handleClick, true);
  document.addEventListener('keydown', handleEscape, true);
}

function stopColorPicking() {
  if (!isPickingColor) return;
  
  isPickingColor = false;
  
  document.removeEventListener('mousemove', handleMouseMove, true);
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('keydown', handleEscape, true);
  
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
  if (colorPreview && colorPreview.parentNode) {
    colorPreview.parentNode.removeChild(colorPreview);
  }
  
  overlay = null;
  colorPreview = null;
  screenshotDataUrl = null;
  screenshotImg = null;
}
