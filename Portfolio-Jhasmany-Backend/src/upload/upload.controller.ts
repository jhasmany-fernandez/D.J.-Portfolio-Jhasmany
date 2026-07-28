import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { isVisitor } from '../auth/utils/demo-response';

type UploadedImageFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'testimonial', 'visitor')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
      fileFilter: (req, file, callback) => {
        // Validar tipo de archivo
        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'image/bmp',
          'image/tiff',
          'image/avif'
        ];


        if (!allowedTypes.includes(file.mimetype)) {
          console.error('[Upload] Invalid file type:', file.mimetype, 'Allowed:', allowedTypes);
          return callback(
            new BadRequestException(`Only image files are allowed. Received: ${file.mimetype}`),
            false
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: UploadedImageFile, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (isVisitor(req)) {
      return {
        success: true,
        url: '/portfolio-assets/uploads/demo-visitor-image.svg',
        imageId: 'demo-visitor-image',
        originalName: file.originalname,
        __demo: true,
      };
    }

    const storedImage = await this.uploadService.createImage(file);

    return {
      success: true,
      url: storedImage.url,
      imageId: storedImage.id,
      originalName: storedImage.originalName,
    };
  }

  @Get('image/:id')
  async getImageById(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const image = await this.uploadService.getImageById(id);
    res.setHeader('Content-Type', image.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(image.data);
  }

  @Get('images')
  async listImages() {
    const images = await this.uploadService.listImages();
    return images.map((image) => ({
      id: image.id,
      originalName: image.originalName,
      mimeType: image.mimeType,
      size: image.size,
      createdAt: image.createdAt,
      url: image.url,
    }));
  }

  @Delete('image/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'visitor')
  async deleteImageById(@Param('id') id: string, @Request() req) {
    if (isVisitor(req)) {
      return { success: true, __demo: true };
    }

    const deleted = await this.uploadService.deleteImageById(id);
    if (!deleted) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    return { success: true };
  }
}
