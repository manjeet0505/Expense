// https://codesandbox.io/s/react-easy-crop-with-cropped-output-lkhxj?file=/src/cropImage.js
export default function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      
      // Convert to base64
      const base64String = canvas.toDataURL('image/png');
      resolve(base64String);
    };
    image.onerror = error => {
      console.error('Error loading image:', error);
      reject(error);
    };
  });
} 