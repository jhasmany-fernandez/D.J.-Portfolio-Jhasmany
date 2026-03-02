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
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { UploadService } from './upload.service';

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
  async uploadImage(@UploadedFile() file: UploadedImageFile) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const storedImage = await this.uploadService.createImage(file);
    const imageUrl = `/api/images/${storedImage.id}`;

    return {
      success: true,
      url: imageUrl,
      imageId: storedImage.id,
      originalName: storedImage.originalName,
    };
  }

  @Get('image/:id')
  async getImageById(
    @Param('id', ParseUUIDPipe) id: string,
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
      url: `/api/images/${image.id}`,
    }));
  }

  @Delete('image/:id')
  async deleteImageById(@Param('id', ParseUUIDPipe) id: string) {
    const deleted = await this.uploadService.deleteImageById(id);
    if (!deleted) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    return { success: true };
  }
}
