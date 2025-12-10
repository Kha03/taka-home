/**
 * Calculate SHA-256 hash of a PDF file
 * @param file - The PDF file to hash
 * @returns The hex string of the file hash
 */
export async function calculatePDFHash(file: File): Promise<string> {
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Calculate SHA-256 hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

/**
 * Download PDF from URL and calculate its hash
 * @param url - The URL of the PDF file
 * @returns The hex string of the file hash
 */
export async function calculatePDFHashFromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const blob = await response.blob();
  const file = new File([blob], "document.pdf", { type: "application/pdf" });

  return calculatePDFHash(file);
}

/**
 * Compare two hash strings (case-insensitive)
 * @param hash1 - First hash string
 * @param hash2 - Second hash string
 * @returns True if hashes match, false otherwise
 */
export function compareHashes(hash1: string, hash2: string): boolean {
  return hash1.toLowerCase() === hash2.toLowerCase();
}
