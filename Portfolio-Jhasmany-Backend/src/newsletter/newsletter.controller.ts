import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UnsubscribeNewsletterDto } from './dto/unsubscribe-newsletter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private newsletterService: NewsletterService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 requests per 5 minutes
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 200, description: 'Subscription successful' })
  @ApiResponse({ status: 400, description: 'Invalid email or subscription failed' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async subscribe(
    @Body() subscribeDto: SubscribeNewsletterDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.newsletterService.subscribe(subscribeDto, ipAddress, userAgent);
  }

  @Get('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm newsletter subscription' })
  @ApiResponse({ status: 200, description: 'Subscription confirmed' })
  @ApiResponse({ status: 404, description: 'Invalid confirmation token' })
  async confirmSubscription(@Query('token') token: string) {
    return this.newsletterService.confirmSubscription(token);
  }

  @Post('unsubscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  @ApiResponse({ status: 200, description: 'Successfully unsubscribed' })
  @ApiResponse({ status: 404, description: 'Invalid unsubscribe token' })
  async unsubscribe(@Body() unsubscribeDto: UnsubscribeNewsletterDto) {
    return this.newsletterService.unsubscribe(unsubscribeDto);
  }

  @Get('unsubscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unsubscribe from newsletter via GET request' })
  @ApiResponse({ status: 200, description: 'Successfully unsubscribed' })
  @ApiResponse({ status: 404, description: 'Invalid unsubscribe token' })
  async unsubscribeViaGet(@Query('token') token: string) {
    return this.newsletterService.unsubscribe({ token });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get newsletter subscription statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStats() {
    return this.newsletterService.getSubscriptionStats();
  }

  @Post('send-catalog')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 1, ttl: 3600000 } }) // 1 request per hour
  @ApiOperation({ summary: 'Send portfolio catalog to all confirmed subscribers' })
  @ApiResponse({ status: 200, description: 'Catalog sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async sendCatalog() {
    return this.newsletterService.sendCatalogToConfirmedSubscribers();
  }
}