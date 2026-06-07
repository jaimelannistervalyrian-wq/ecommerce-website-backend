"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
let UploadService = class UploadService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadImage(buffer, originalName, folder = 'ss-jeweleries/products') {
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            throw new common_1.BadRequestException('Cloudinary is not configured. Add CLOUDINARY_* env vars.');
        }
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                resource_type: 'image',
                transformation: [
                    { quality: 'auto', fetch_format: 'auto' },
                    { width: 1200, height: 1600, crop: 'limit' },
                ],
                public_id: `${Date.now()}-${originalName.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/gi, '-')}`,
            }, (error, result) => {
                if (error || !result)
                    return reject(error ?? new Error('Upload failed'));
                resolve(result.secure_url);
            });
            uploadStream.end(buffer);
        });
    }
    async uploadImages(files, folder) {
        if (!files || files.length === 0)
            return [];
        return Promise.all(files.map((f) => this.uploadImage(f.buffer, f.originalname, folder)));
    }
    async deleteImage(url) {
        if (!url || !url.includes('cloudinary.com'))
            return;
        try {
            const parts = url.split('/');
            const uploadIdx = parts.indexOf('upload');
            if (uploadIdx === -1)
                return;
            const afterUpload = parts.slice(uploadIdx + 1);
            const withoutVersion = afterUpload[0]?.startsWith('v') ? afterUpload.slice(1) : afterUpload;
            const publicIdWithExt = withoutVersion.join('/');
            const publicId = publicIdWithExt.replace(/\.[^.]+$/, '');
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch {
            console.warn('Failed to delete image from Cloudinary:', url);
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map