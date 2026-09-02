import { UploadService } from './upload.service.js';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    uploadMultiple(files: Express.Multer.File[]): Promise<{
        url: string;
        filename: string;
    }[]>;
}
