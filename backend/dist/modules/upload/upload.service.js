var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
let UploadService = class UploadService {
    uploadDir = join(process.cwd(), 'uploads');
    isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
    constructor() {
        if (!this.isServerless) {
            if (!existsSync(this.uploadDir)) {
                mkdirSync(this.uploadDir, { recursive: true });
            }
        }
    }
    async uploadImage(file, folder = 'general') {
        if (!file) {
            throw new BadRequestException('No file provided');
        }
        if (this.isServerless) {
            throw new BadRequestException('File upload not available in serverless environment. Use S3 or external storage.');
        }
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed');
        }
        const maxSize = 5 * 1024 * 1024;
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
    async uploadMultiple(files, folder = 'general') {
        const results = [];
        for (const file of files) {
            const result = await this.uploadImage(file, folder);
            results.push(result);
        }
        return results;
    }
};
UploadService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], UploadService);
export { UploadService };
//# sourceMappingURL=upload.service.js.map