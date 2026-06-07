export declare class UploadService {
    constructor();
    uploadImage(buffer: Buffer, originalName: string, folder?: string): Promise<string>;
    uploadImages(files: Express.Multer.File[], folder?: string): Promise<string[]>;
    deleteImage(url: string): Promise<void>;
}
