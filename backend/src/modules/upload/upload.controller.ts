import {
    Controller,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    /**
     * POST /api/upload/images
     * Accepts up to 10 images, returns array of Cloudinary URLs.
     * Admin only.
     */
    @Post('images')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            storage: memoryStorage(),
            limits: { fileSize: MAX_SIZE_BYTES },
            fileFilter: (_req, file, cb) => {
                if (!ALLOWED_MIME.includes(file.mimetype)) {
                    return cb(
                        new BadRequestException(
                            `Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, GIF`,
                        ),
                        false,
                    );
                }
                cb(null, true);
            },
        }),
    )
    async uploadImages(
        @UploadedFiles() files: Express.Multer.File[],
    ): Promise<{ urls: string[] }> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }
        const urls = await this.uploadService.uploadImages(files);
        return { urls };
    }
}
