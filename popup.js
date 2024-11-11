document.getElementById("fetchThumbnailBtn").addEventListener("click", function() {
  const urlInput = document.getElementById("urlInput").value;
  const videoId = getYouTubeVideoId(urlInput);

  if (videoId) {
    const thumbnailUrl = `http://localhost:3000/thumbnail?videoId=${videoId}`;
    
    // Fetch the thumbnail via the proxy server
    fetch(thumbnailUrl)
      .then(response => response.blob())
      .then(imageBlob => {
        // Create an object URL for the image blob
        const imageObjectUrl = URL.createObjectURL(imageBlob);

        // Display the image
        const thumbnailImage = document.getElementById("thumbnailImage");
        thumbnailImage.src = imageObjectUrl;
        thumbnailImage.style.display = "block";

        // Show format select and download button
        const formatSelect = document.getElementById("formatSelect");
        const downloadBtn = document.getElementById("downloadBtn");

        formatSelect.style.display = "block";
        downloadBtn.style.display = "block";

        // When download button is clicked
        downloadBtn.onclick = function() {
          const selectedFormat = formatSelect.value;
          downloadThumbnail(imageObjectUrl, selectedFormat);
        };
      })
      .catch(error => {
        console.error('Error fetching thumbnail:', error);
        alert('Failed to fetch thumbnail');
      });
  } else {
    alert("Please enter a valid YouTube video URL.");
  }
});

// Function to extract video ID from YouTube URL
function getYouTubeVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Function to download the thumbnail in the selected format
function downloadThumbnail(imageUrl, format) {
  // Create a temporary image element to load the thumbnail
  const img = new Image();
  img.src = imageUrl;

  img.onload = function() {
    // Create a canvas to convert the image to the desired format
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Convert the image to the selected format (JPEG or PNG)
    const dataUrl = canvas.toDataURL(`image/${format}`);

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = `thumbnail.${format}`;  // Use the selected format for the filename
    downloadLink.click();
  };
}
