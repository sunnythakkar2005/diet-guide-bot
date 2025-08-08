export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === 'application/pdf') {
      // For PDF files, we'll use a simple approach
      // In a production app, you'd want to use a proper PDF parser like pdf-parse
      const reader = new FileReader();
      reader.onload = () => {
        // This is a simplified approach - in reality, PDFs need proper parsing
        resolve(`PDF file uploaded: ${file.name}. Content extraction would require a PDF parser library.`);
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    } else if (file.type.startsWith('image/')) {
      // For images, we'll use OCR (in a real app, you'd use Tesseract.js or similar)
      const reader = new FileReader();
      reader.onload = () => {
        resolve(`Image file uploaded: ${file.name}. OCR text extraction would be implemented here.`);
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    } else {
      // For text files
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    }
  });
}

export function validateBloodReportFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'text/plain',
    'text/csv'
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported. Please upload PDF, image, or text file.' };
  }

  return { valid: true };
}