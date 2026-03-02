import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { NewsletterSubscription } from './entities/newsletter-subscription.entity';
import { EmailService } from '../common/services/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewsletterSubscription])],
  controllers: [NewsletterController],
  providers: [NewsletterService, EmailService],
  exports: [NewsletterService],
})
export class NewsletterModule {}