import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    /**
     * Upload a single file buffer to Cloudinary.
     * Returns the secure HTTPS URL stored in the DB.
     */
    async uploadImage(
        buffer: Buffer,
        originalName: string,
        folder = 'ss-jeweleries/products',
    ): Promise<string> {
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            throw new BadRequestException(
                'Cloudinary is not configured. Add CLOUDINARY_* env vars.',
            );
        }

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'image',
                    // Auto-optimize: convert to WebP, quality auto, strip metadata
                    transformation: [
                        { quality: 'auto', fetch_format: 'auto' },
                        { width: 1200, height: 1600, crop: 'limit' },
                    ],
                    public_id: `${Date.now()}-${originalName.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/gi, '-')}`,
                },
                (error, result: UploadApiResponse | undefined) => {
                    if (error || !result) return reject(error ?? new Error('Upload failed'));
                    resolve(result.secure_url);
                },
            );
            uploadStream.end(buffer);
        });
    }

    /**
     * Upload multiple files. Returns array of secure URLs.
     */
    async uploadImages(
        files: Express.Multer.File[],
        folder?: string,
    ): Promise<string[]> {
        if (!files || files.length === 0) return [];
        return Promise.all(
            files.map((f) => this.uploadImage(f.buffer, f.originalname, folder)),
        );
    }

    /**
     * Delete an image from Cloudinary by its URL.
     */
    async deleteImage(url: string): Promise<void> {
        if (!url || !url.includes('cloudinary.com')) return;
        try {
            // Extract public_id from URL
            const parts = url.split('/');
            const uploadIdx = parts.indexOf('upload');
            if (uploadIdx === -1) return;
            // Skip version segment (v1234567890)
            const afterUpload = parts.slice(uploadIdx + 1);
            const withoutVersion = afterUpload[0]?.startsWith('v') ? afterUpload.slice(1) : afterUpload;
            const publicIdWithExt = withoutVersion.join('/');
            const publicId = publicIdWithExt.replace(/\.[^.]+$/, '');
            await cloudinary.uploader.destroy(publicId);
        } catch {
            // Non-critical — log but don't throw
            console.warn('Failed to delete image from Cloudinary:', url);
        }
    }
}
