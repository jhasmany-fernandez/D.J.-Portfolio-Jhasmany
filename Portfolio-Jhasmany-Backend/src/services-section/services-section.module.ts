import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesSectionController } from './services-section.controller';
import { ServicesSectionService } from './services-section.service';
import { ServicesSection } from './entities/services-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServicesSection])],
  controllers: [ServicesSectionController],
  providers: [ServicesSectionService],
  exports: [ServicesSectionService],
})
export class ServicesSectionModule {}
