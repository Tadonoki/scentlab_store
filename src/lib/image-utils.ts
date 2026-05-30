/**
 * Image compression utility for product uploads.
 * 
 * Compresses an image file to:
 * - Max width: 1200px
 * - Format: JPEG/WebP
 * - Quality: 0.75
 * - Max size: 5MB
 * Returns a base64 data URL string.
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 1200;
const QUALITY = 0.75;

export async function compressImage(file: File): Promise<string> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Hanya file gambar yang diperbolehkan");
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran gambar maksimal 5MB");
  }

  const imageBitmap = await createImageBitmap(file);
  const { width, height } = imageBitmap;

  // Calculate new dimensions maintaining aspect ratio
  let newWidth = width;
  let newHeight = height;
  if (width > MAX_WIDTH) {
    newWidth = MAX_WIDTH;
    newHeight = Math.round((height / width) * MAX_WIDTH);
  }

  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Gagal memproses gambar");
  }

  // Draw resized image
  ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);
  imageBitmap.close();

  // Convert to WebP (preferred) or JPEG
  const mimeType = "image/webp";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), mimeType, QUALITY)
  );

  if (!blob) {
    throw new Error("Gagal mengompres gambar");
  }

  // Convert blob to base64 data URL
  const base64 = await blobToBase64(blob);
  return base64;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}