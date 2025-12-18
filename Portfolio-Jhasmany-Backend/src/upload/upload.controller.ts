import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          // Generar nombre único para el archivo
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `project-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
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

        console.log('[Upload] Received file:', file.originalname, 'MIME type:', file.mimetype);

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
  async uploadImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Retornar la URL usando el proxy de Next.js para evitar problemas de red entre contenedores
    const imageUrl = `/api/images/${file.filename}`;

    return {
      success: true,
      url: imageUrl,
      filename: file.filename,
    };
  }
}
