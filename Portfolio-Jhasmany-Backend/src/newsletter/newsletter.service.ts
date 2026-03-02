import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { NewsletterSubscription } from './entities/newsletter-subscription.entity';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UnsubscribeNewsletterDto } from './dto/unsubscribe-newsletter.dto';
import { EmailService } from '../common/services/email.service';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    @InjectRepository(NewsletterSubscription)
    private newsletterRepository: Repository<NewsletterSubscription>,
    private emailService: EmailService,
  ) {}

  async subscribe(
    subscribeDto: SubscribeNewsletterDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const { email, firstName, lastName, company, source } = subscribeDto;

    try {
      // Verificar si ya existe una suscripción activa
      const existingSubscription = await this.newsletterRepository.findOne({
        where: { email },
      });

      if (existingSubscription && existingSubscription.isActive) {
        return {
          success: true,
          message: 'Este email ya se encontraba registrado en nuestro boletín.',
          alreadySubscribed: true,
        };
      }

      // Generar tokens seguros
      const confirmationToken = crypto.randomBytes(32).toString('hex');
      const unsubscribeToken = crypto.randomBytes(32).toString('hex');

      let subscription: NewsletterSubscription;

      if (existingSubscription) {
        // Reactivar suscripción existente
        existingSubscription.firstName = firstName || existingSubscription.firstName;
        existingSubscription.lastName = lastName || existingSubscription.lastName;
        existingSubscription.company = company || existingSubscription.company;
        existingSubscription.isActive = true;
        existingSubscription.isConfirmed = false;
        existingSubscription.confirmationToken = confirmationToken;
        existingSubscription.unsubscribeToken = unsubscribeToken;
        existingSubscription.ipAddress = ipAddress;
        existingSubscription.userAgent = userAgent;
        existingSubscription.source = source || existingSubscription.source;
        existingSubscription.confirmedAt = null;

        subscription = await this.newsletterRepository.save(existingSubscription);
      } else {
        // Crear nueva suscripción
        subscription = this.newsletterRepository.create({
          email,
          firstName,
          lastName,
          company,
          confirmationToken,
          unsubscribeToken,
          ipAddress,
          userAgent,
          source: source || 'unknown',
        });

        subscription = await this.newsletterRepository.save(subscription);
      }

      // Enviar email de bienvenida con confirmación
      const subscriberName = firstName
        ? `${firstName}${lastName ? ` ${lastName}` : ''}`
        : undefined;

      await this.emailService.sendNewsletterWelcomeEmail(
        email,
        confirmationToken,
        subscriberName,
        unsubscribeToken,
      );

      this.logger.log(`Newsletter subscription created for: ${email}`);

      return {
        success: true,
        message: 'Please check your email to confirm your subscription.',
        subscriptionId: subscription.id,
      };

    } catch (error) {
      this.logger.error(`Failed to create newsletter subscription for ${email}:`, error);
      throw new BadRequestException('Failed to subscribe to newsletter. Please try again.');
    }
  }

  async confirmSubscription(token: string) {
    const subscription = await this.newsletterRepository.findOne({
      where: { confirmationToken: token, isActive: true },
    });

    if (!subscription) {
      throw new NotFoundException('Invalid or expired confirmation token');
    }

    if (subscription.isConfirmed) {
      return {
        success: true,
        message: 'Your subscription is already confirmed.',
        alreadyConfirmed: true,
      };
    }

    // Confirmar suscripción
    subscription.isConfirmed = true;
    subscription.confirmedAt = new Date();
    subscription.confirmationToken = null; // Limpiar token usado

    await this.newsletterRepository.save(subscription);

    // Enviar catálogo de portfolio inmediatamente después de confirmar
    const subscriberName = subscription.firstName
      ? `${subscription.firstName}${subscription.lastName ? ` ${subscription.lastName}` : ''}`
      : undefined;

    try {
      await this.emailService.sendPortfolioCatalog(
        subscription.email,
        subscriberName,
        subscription.unsubscribeToken,
      );

      // Actualizar estadísticas
      subscription.lastEmailSentAt = new Date();
      subscription.emailsSentCount += 1;
      await this.newsletterRepository.save(subscription);

      this.logger.log(`Portfolio catalog sent to confirmed subscriber: ${subscription.email}`);
    } catch (error) {
      this.logger.error(`Failed to send portfolio catalog to ${subscription.email}:`, error);
      // No fallar la confirmación por este error
    }

    return {
      success: true,
      message: 'Subscription confirmed successfully! Your portfolio catalog has been sent.',
    };
  }

  async unsubscribe(unsubscribeDto: UnsubscribeNewsletterDto) {
    const { token } = unsubscribeDto;

    const subscription = await this.newsletterRepository.findOne({
      where: { unsubscribeToken: token, isActive: true },
    });

    if (!subscription) {
      throw new NotFoundException('Invalid unsubscribe token');
    }

    // Desactivar suscripción
    subscription.isActive = false;
    subscription.unsubscribeToken = null; // Limpiar token usado

    await this.newsletterRepository.save(subscription);

    // Enviar email de confirmación de cancelación
    const subscriberName = subscription.firstName
      ? `${subscription.firstName}${subscription.lastName ? ` ${subscription.lastName}` : ''}`
      : undefined;

    try {
      await this.emailService.sendUnsubscribeConfirmation(
        subscription.email,
        subscriberName,
      );
    } catch (error) {
      this.logger.error(`Failed to send unsubscribe confirmation to ${subscription.email}:`, error);
      // No fallar la cancelación por este error
    }

    this.logger.log(`Newsletter unsubscribed: ${subscription.email}`);

    return {
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.',
    };
  }

  async getSubscriptionStats() {
    const [
      totalSubscriptions,
      activeSubscriptions,
      confirmedSubscriptions,
      todaySubscriptions,
    ] = await Promise.all([
      this.newsletterRepository.count(),
      this.newsletterRepository.count({ where: { isActive: true } }),
      this.newsletterRepository.count({ where: { isActive: true, isConfirmed: true } }),
      this.newsletterRepository.count({
        where: {
          createdAt: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      }),
    ]);

    return {
      total: totalSubscriptions,
      active: activeSubscriptions,
      confirmed: confirmedSubscriptions,
      today: todaySubscriptions,
      confirmationRate: activeSubscriptions > 0 ? (confirmedSubscriptions / activeSubscriptions * 100).toFixed(2) : '0',
    };
  }

  async sendCatalogToConfirmedSubscribers() {
    const confirmedSubscribers = await this.newsletterRepository.find({
      where: { isActive: true, isConfirmed: true },
      select: ['id', 'email', 'firstName', 'lastName', 'unsubscribeToken'],
    });

    let sentCount = 0;
    let errorCount = 0;

    for (const subscriber of confirmedSubscribers) {
      try {
        const subscriberName = subscriber.firstName
          ? `${subscriber.firstName}${subscriber.lastName ? ` ${subscriber.lastName}` : ''}`
          : undefined;

        await this.emailService.sendPortfolioCatalog(
          subscriber.email,
          subscriberName,
          subscriber.unsubscribeToken,
        );

        // Actualizar estadísticas
        await this.newsletterRepository.update(subscriber.id, {
          lastEmailSentAt: new Date(),
          emailsSentCount: () => 'emailsSentCount + 1',
        });

        sentCount++;
        this.logger.log(`Portfolio catalog sent to: ${subscriber.email}`);

        // Pequeña pausa para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        errorCount++;
        this.logger.error(`Failed to send catalog to ${subscriber.email}:`, error);
      }
    }

    return {
      success: true,
      message: `Portfolio catalog sent to ${sentCount} subscribers.`,
      sent: sentCount,
      errors: errorCount,
      total: confirmedSubscribers.length,
    };
  }
}