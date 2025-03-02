import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use remote models
env.allowLocalModels = false;
env.useBrowserCache = true;

// Maximum dimension for image processing
const MAX_IMAGE_DIMENSION = 1024;

/**
 * Resizes an image if it exceeds the maximum dimension while maintaining aspect ratio
 */
function resizeImageIfNeeded(
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D, 
  image: HTMLImageElement
): boolean {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

/**
 * Removes the background from an image
 */
export const removeBackground = async (
  imageElement: HTMLImageElement, 
  onProgress?: (status: string, progress?: number) => void
): Promise<Blob> => {
  try {
    onProgress?.('Initializing segmentation model...', 0.1);
    
    // Initialize the segmentation model with webgpu device for better performance
    const segmenter = await pipeline(
      'image-segmentation', 
      'Xenova/segformer-b0-finetuned-ade-512-512',
      { device: 'cpu' } // Use CPU for better compatibility
    );
    
    onProgress?.('Processing image...', 0.3);
    
    // Convert image to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image if needed and draw to canvas
    resizeImageIfNeeded(canvas, ctx, imageElement);
    
    onProgress?.('Applying segmentation...', 0.5);
    
    // Convert to base64 for processing
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Process with segmentation model
    const result = await segmenter(imageData);
    console.log('Segmentation result:', result);
    
    onProgress?.('Finalizing image...', 0.8);
    
    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error('Invalid segmentation result');
    }
    
    // Create output canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply the mask to the alpha channel
    const outputImageData = outputCtx.getImageData(
      0, 0, outputCanvas.width, outputCanvas.height
    );
    const data = outputImageData.data;
    
    // Apply first mask from result to alpha channel
    // The key fix here is using the first mask unconditionally instead of trying to find a specific one
    if (result[0].mask) {
      for (let i = 0; i < result[0].mask.data.length; i++) {
        // Invert the mask value to keep the foreground instead of background
        const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
        data[i * 4 + 3] = alpha;
      }
    } else {
      throw new Error('No mask found in segmentation result');
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    
    onProgress?.('Done!', 1);
    
    // Convert to blob and return
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

/**
 * Loads an image from a file or blob
 */
export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Loads an image from a URL
 */
export const loadImageFromUrl = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};
