import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadImage(
    file: MulterFile,
    folder = 'general',
  ): Promise<{ url: string; filename: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB');
    }

    const folderPath = join(this.uploadDir, folder);
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }

    const ext = file.originalname.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const filePath = join(folderPath, filename);

    writeFileSync(filePath, file.buffer);

    return {
      url: `/uploads/${folder}/${filename}`,
      filename,
    };
  }

  async uploadMultiple(
    files: MulterFile[],
    folder = 'general',
  ): Promise<{ url: string; filename: string }[]> {
    const results = [];
    for (const file of files) {
      const result = await this.uploadImage(file, folder);
      results.push(result);
    }
    return results;
  }
}
