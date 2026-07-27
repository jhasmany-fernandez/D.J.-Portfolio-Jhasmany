import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { access, mkdir, readdir, readFile, stat, unlink, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { Repository } from 'typeorm';
import { StoredImage } from './entities/stored-image.entity';

type UploadedImageFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

type StoredAsset = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: Date;
  data?: Buffer;
};

@Injectable()
export class UploadService {
  private readonly uploadDir =
    process.env.UPLOAD_DIR ||
    join(process.cwd(), '..', 'Portfolio-Jhasmany-Frontend', 'public', 'portfolio-assets', 'uploads');

  constructor(
    @InjectRepository(StoredImage)
    private readonly storedImageRepository: Repository<StoredImage>,
  ) {}

  async createImage(file: UploadedImageFile): Promise<StoredAsset> {
    await mkdir(this.uploadDir, { recursive: true });

    const filename = this.createSafeFilename(file.originalname);
    const filePath = join(this.uploadDir, filename);
    await writeFile(filePath, file.buffer);

    return {
      id: filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: this.createPublicUrl(filename),
      createdAt: new Date(),
    };
  }

  async getImageById(id: string): Promise<StoredAsset> {
    if (!this.isUuid(id)) {
      const filePath = join(this.uploadDir, id);
      try {
        const [fileData, fileStat] = await Promise.all([readFile(filePath), stat(filePath)]);
        return {
          id,
          originalName: id,
          mimeType: this.getMimeTypeFromFilename(id),
          size: fileStat.size,
          url: this.createPublicUrl(id),
          createdAt: fileStat.birthtime,
          data: fileData,
        };
      } catch {
        throw new NotFoundException(`Image with ID ${id} not found`);
      }
    }

    const image = await this.storedImageRepository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return {
      id: image.id,
      originalName: image.originalName,
      mimeType: image.mimeType,
      size: image.size,
      url: `/api/images/${image.id}`,
      createdAt: image.createdAt,
      data: image.data,
    };
  }

  async listImages(): Promise<StoredAsset[]> {
    const fileImages = await this.listFileImages();
    const legacyImages = await this.storedImageRepository.find({
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        size: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
    });

    return [
      ...fileImages,
      ...legacyImages.map((image) => ({
        id: image.id,
        originalName: image.originalName,
        mimeType: image.mimeType,
        size: image.size,
        url: `/api/images/${image.id}`,
        createdAt: image.createdAt,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteImageById(id: string): Promise<boolean> {
    if (!this.isUuid(id)) {
      try {
        await unlink(join(this.uploadDir, id));
        return true;
      } catch {
        return false;
      }
    }

    const result = await this.storedImageRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  extractImageIdFromUrl(imageUrl: string): string | null {
    const match = imageUrl.match(/\/api\/images\/([0-9a-fA-F-]{36})/);
    if (match) {
      return match[1];
    }

    const uploadedAssetMatch = imageUrl.match(/\/portfolio-assets\/uploads\/([^/?#]+)/);
    if (uploadedAssetMatch) {
      return decodeURIComponent(uploadedAssetMatch[1]);
    }

    return match ? match[1] : null;
  }

  async deleteImageFromUrl(imageUrl: string): Promise<boolean> {
    const imageId = this.extractImageIdFromUrl(imageUrl);
    if (!imageId) {
      return false;
    }

    return this.deleteImageById(imageId);
  }

  private createSafeFilename(originalName: string): string {
    const extension = extname(originalName).toLowerCase();
    const baseName = originalName
      .replace(extension, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 60);

    return `${baseName || 'image'}-${randomUUID()}${extension || '.png'}`;
  }

  private async listFileImages(): Promise<StoredAsset[]> {
    try {
      await access(this.uploadDir);
    } catch {
      return [];
    }

    const filenames = await readdir(this.uploadDir);
    const images = await Promise.all(
      filenames
        .filter((filename) => !filename.startsWith('.'))
        .map(async (filename) => {
          const fileStat = await stat(join(this.uploadDir, filename));
          return {
            id: filename,
            originalName: filename,
            mimeType: this.getMimeTypeFromFilename(filename),
            size: fileStat.size,
            url: this.createPublicUrl(filename),
            createdAt: fileStat.birthtime,
          };
        }),
    );

    return images.filter((image) => image.mimeType.startsWith('image/'));
  }

  private createPublicUrl(filename: string): string {
    return `/portfolio-assets/uploads/${encodeURIComponent(filename)}`;
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-fA-F-]{36}$/.test(value);
  }

  private getMimeTypeFromFilename(filename: string): string {
    const extension = extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.avif': 'image/avif',
      '.bmp': 'image/bmp',
      '.gif': 'image/gif',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.tif': 'image/tiff',
      '.tiff': 'image/tiff',
      '.webp': 'image/webp',
    };

    return mimeTypes[extension] || 'application/octet-stream';
  }
}
