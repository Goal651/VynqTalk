import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// src/utils/base64ToFile.ts
export function base64ToFile(dataUrl: string, filename: string): File {
  // Extract the base64 data (remove "data:image/png;base64," prefix)
  const base64Data = dataUrl.split(',')[1];
  // Decode base64 to binary
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  // Create a Blob
  const blob = new Blob([byteArray], { type: 'image/png' });
  // Create a File
  return new File([blob], filename, { type: 'image/png' });
}
