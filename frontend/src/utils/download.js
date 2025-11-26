export const downloadImage = async (imageUrl, filename) => {
  try {
    console.log('Starting download process...');
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = '_blank'; 
    link.rel = 'noopener noreferrer';
    
    if (imageUrl.includes('nasa.gov')) {
      link.download = filename || `nasa-apod-${new Date().toISOString().split('T')[0]}.jpg`;
    }
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Download initiated:', imageUrl);
    
  } catch (error) {
    console.error('Download failed:', error);
    window.open(imageUrl, '_blank');
  }
};

export const forceDownload = async (imageUrl, filename = 'nasa-apod.jpg') => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Force download failed:', error);
    window.open(imageUrl, '_blank');
  }
};