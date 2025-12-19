import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FooterController } from './footer.controller';
import { FooterService } from './footer.service';
import { Footer } from './entities/footer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Footer])],
  controllers: [FooterController],
  providers: [FooterService],
  exports: [FooterService],
})
export class FooterModule {}
