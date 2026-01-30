// Background script to handle color storage
let pickedColor = null;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'colorPicked' && message.color) {
    // Store the picked color
    pickedColor = message.color;
    
    // Update badge to indicate a color was picked
    browser.browserAction.setBadgeText({ text: '●' });
    browser.browserAction.setBadgeBackgroundColor({ color: message.color });
    
    // Try to open popup - this works in some contexts
    browser.browserAction.openPopup().catch(() => {
      // If openPopup fails, the badge will still indicate a color is ready
      console.log('Color saved, click extension icon to see palettes');
    });
    
    sendResponse({ status: 'received' });
  } else if (message.action === 'getPickedColor') {
    // Send back the picked color and clear it
    const color = pickedColor;
    pickedColor = null;
    
    // Clear badge
    browser.browserAction.setBadgeText({ text: '' });
    
    sendResponse({ color: color });
  }
  return true;
});
