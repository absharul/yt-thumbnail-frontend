// content.js

function extractThumbnailUrl() {
    // Extract the video ID from the YouTube URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("v");
  
    // Construct the thumbnail URL if video ID is found
    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      return thumbnailUrl;
    }
    return null;
  }
  
  // Listen for a request from the popup to get the thumbnail URL
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getThumbnailUrl") {
      const thumbnailUrl = extractThumbnailUrl();
      sendResponse({ thumbnailUrl });
    }
  });
  