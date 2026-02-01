import { fileTypeFromBuffer } from 'file-type';
import { randomBytes } from 'node:crypto';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
]);

const ALLOWED_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp'
]);

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export async function validateImageBuffer(buffer: Buffer): Promise<void> {
  // Check file size
  if (buffer.length > MAX_FILE_SIZE) {
    throw new ImageValidationError(
      `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }

  // Check if buffer is empty
  if (buffer.length === 0) {
    throw new ImageValidationError('Empty file provided');
  }

  // Validate file type using magic bytes
  const fileType = await fileTypeFromBuffer(buffer);

  if (!fileType) {
    throw new ImageValidationError('Unable to determine file type');
  }

  if (!ALLOWED_MIME_TYPES.has(fileType.mime)) {
    throw new ImageValidationError(
      `Invalid file type. Allowed types: ${Array.from(ALLOWED_MIME_TYPES).join(', ')}`
    );
  }

  if (!ALLOWED_EXTENSIONS.has(fileType.ext)) {
    throw new ImageValidationError(
      `Invalid file extension. Allowed extensions: ${Array.from(ALLOWED_EXTENSIONS).join(', ')}`
    );
  }
}

export function generateSafeFilename(extension: string): string {
  // Generate a random filename to prevent path traversal and collisions
  const randomName = randomBytes(16).toString('hex');
  const timestamp = Date.now();

  // Sanitize extension to ensure it only contains alphanumeric characters
  const safeExtension = extension.replace(/[^a-z0-9]/gi, '');

  return `${timestamp}-${randomName}.${safeExtension}`;
}

export async function getImageExtension(buffer: Buffer): Promise<string> {
  const fileType = await fileTypeFromBuffer(buffer);

  if (!fileType) {
    throw new ImageValidationError('Unable to determine file type');
  }

  return fileType.ext;
}
