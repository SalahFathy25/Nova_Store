export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
export declare class UploadService {
    private readonly uploadDir;
    private readonly isServerless;
    constructor();
    uploadImage(file: MulterFile, folder?: string): Promise<{
        url: string;
        filename: string;
    }>;
    uploadMultiple(files: MulterFile[], folder?: string): Promise<{
        url: string;
        filename: string;
    }[]>;
}
