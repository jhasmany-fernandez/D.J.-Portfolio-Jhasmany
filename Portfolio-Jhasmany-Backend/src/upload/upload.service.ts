import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoredImage } from './entities/stored-image.entity';

type UploadedImageFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(StoredImage)
    private readonly storedImageRepository: Repository<StoredImage>,
  ) {}

  async createImage(file: UploadedImageFile): Promise<StoredImage> {
    const image = this.storedImageRepository.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      data: file.buffer,
    });

    return this.storedImageRepository.save(image);
  }

  async getImageById(id: string): Promise<StoredImage> {
    const image = await this.storedImageRepository.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  async listImages(): Promise<StoredImage[]> {
    return this.storedImageRepository.find({
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        size: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteImageById(id: string): Promise<boolean> {
    const result = await this.storedImageRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  extractImageIdFromUrl(imageUrl: string): string | null {
    const match = imageUrl.match(/\/api\/images\/([0-9a-fA-F-]{36})/);
    return match ? match[1] : null;
  }

  async deleteImageFromUrl(imageUrl: string): Promise<boolean> {
    const imageId = this.extractImageIdFromUrl(imageUrl);
    if (!imageId) {
      return false;
    }

    return this.deleteImageById(imageId);
  }
}
