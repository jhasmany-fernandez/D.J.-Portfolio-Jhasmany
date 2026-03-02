import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter() {
    const emailHost = this.configService.get('EMAIL_HOST');
    const emailPort = this.configService.get('EMAIL_PORT');
    const emailUser = this.configService.get('EMAIL_USER');
    const emailPass = this.configService.get('EMAIL_PASS');

    if (!emailHost || !emailUser || !emailPass) {
      this.logger.warn('Email configuration incomplete. Email sending will be simulated.');
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: parseInt(emailPort) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    this.logger.log('Email transporter configured successfully');
  }

  private async sendEmail(emailContent: any): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[DEVELOPMENT] Email would be sent: ${JSON.stringify(emailContent, null, 2)}`);
      return;
    }

    try {
      const info = await this.transporter.sendMail(emailContent);
      this.logger.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string, userName: string): Promise<void> {
    try {
      const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3002');
      const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

      // En un entorno de producción, aquí integrarías con un servicio de email real
      // como SendGrid, AWS SES, Nodemailer, etc.

      const emailContent = {
        from: 'jhasmany.fernandez.dev@gmail.com',
        to: email,
        subject: 'Password Reset Request - Portfolio Jhasmany',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hello ${userName},</p>
            <p>You have requested to reset your password. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              This is an automated message from Portfolio Jhasmany. Please do not reply to this email.
            </p>
          </div>
        `,
      };

      await this.sendEmail(emailContent);

    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendPasswordResetConfirmation(email: string, userName: string): Promise<void> {
    try {
      const emailContent = {
        from: 'jhasmany.fernandez.dev@gmail.com',
        to: email,
        subject: 'Password Successfully Reset - Portfolio Jhasmany',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Password Successfully Reset</h2>
            <p>Hello ${userName},</p>
            <p>Your password has been successfully reset.</p>
            <p>If you didn't make this change, please contact support immediately.</p>
            <p>For security reasons, you may want to:</p>
            <ul>
              <li>Review your recent account activity</li>
              <li>Enable two-factor authentication if available</li>
              <li>Use a unique, strong password</li>
            </ul>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              This is an automated message from Portfolio Jhasmany. Please do not reply to this email.
            </p>
          </div>
        `,
      };

      await this.sendEmail(emailContent);

    } catch (error) {
      this.logger.error(`Failed to send password reset confirmation email to ${email}:`, error);
      // No lanzamos error aquí porque el reset ya fue exitoso
    }
  }

  async sendNewsletterWelcomeEmail(
    email: string,
    confirmationToken: string,
    subscriberName?: string,
    unsubscribeToken?: string
  ): Promise<void> {
    try {
      const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3002');
      const confirmUrl = `${frontendUrl}/newsletter/confirm?token=${confirmationToken}`;
      const unsubscribeUrl = unsubscribeToken
        ? `${frontendUrl}/newsletter/unsubscribe?token=${unsubscribeToken}`
        : '#';

      const name = subscriberName || 'Valued Subscriber';

      const emailContent = {
        from: 'jhasmany.fernandez.dev@gmail.com',
        to: email,
        subject: '🎉 Welcome to Jhasmany\'s Developer Newsletter!',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                🚀 Welcome to My Developer Journey!
              </h1>
              <p style="color: #e3f2fd; margin: 10px 0 0 0; font-size: 16px;">
                Thanks for joining my newsletter, ${name}!
              </p>
            </div>

            <div style="padding: 40px 20px; background-color: white;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">
                What you'll receive:
              </h2>

              <div style="margin: 30px 0;">
                <div style="display: flex; margin: 20px 0; align-items: start;">
                  <div style="background-color: #007bff; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">1</div>
                  <div>
                    <h3 style="color: #333; margin: 0 0 8px 0; font-size: 18px;">📁 Project Portfolio</h3>
                    <p style="color: #666; margin: 0; line-height: 1.6;">Latest projects, case studies, and technical insights from my development work.</p>
                  </div>
                </div>

                <div style="display: flex; margin: 20px 0; align-items: start;">
                  <div style="background-color: #28a745; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">2</div>
                  <div>
                    <h3 style="color: #333; margin: 0 0 8px 0; font-size: 18px;">⚡ Services Catalog</h3>
                    <p style="color: #666; margin: 0; line-height: 1.6;">Full-stack development, consulting, and custom solutions for your business needs.</p>
                  </div>
                </div>

                <div style="display: flex; margin: 20px 0; align-items: start;">
                  <div style="background-color: #ffc107; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">3</div>
                  <div>
                    <h3 style="color: #333; margin: 0 0 8px 0; font-size: 18px;">💡 Developer Insights</h3>
                    <p style="color: #666; margin: 0; line-height: 1.6;">Technical tips, industry trends, and behind-the-scenes development stories.</p>
                  </div>
                </div>
              </div>

              <div style="text-align: center; margin: 40px 0;">
                <a href="${confirmUrl}"
                   style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                  ✅ Confirm Your Subscription
                </a>
              </div>

              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">👨‍💻 About Me</h3>
                <p style="color: #666; margin: 0; line-height: 1.6;">
                  I'm Jhasmany Fernandez, a Full-Stack Developer specializing in React, Next.js, Node.js, and modern web technologies.
                  I'm passionate about creating innovative solutions and sharing knowledge with the developer community.
                </p>
              </div>
            </div>

            <div style="background-color: #333; padding: 30px 20px; text-align: center;">
              <p style="color: #ccc; margin: 0 0 10px 0; font-size: 14px;">
                Thanks for subscribing to my newsletter!
              </p>
              <p style="color: #999; margin: 0; font-size: 12px;">
                If you no longer wish to receive these emails, you can
                <a href="${unsubscribeUrl}" style="color: #007bff; text-decoration: none;">unsubscribe here</a>.
              </p>
            </div>
          </div>
        `,
      };

      await this.sendEmail(emailContent);

    } catch (error) {
      this.logger.error(`Failed to send newsletter welcome email to ${email}:`, error);
      throw new Error('Failed to send newsletter welcome email');
    }
  }

  async sendPortfolioCatalog(
    email: string,
    subscriberName?: string,
    unsubscribeToken?: string
  ): Promise<void> {
    try {
      const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3002');
      const portfolioUrl = `${frontendUrl}/#projects`;
      const servicesUrl = `${frontendUrl}/#services`;
      const contactUrl = `${frontendUrl}/#contact`;
      const unsubscribeUrl = unsubscribeToken
        ? `${frontendUrl}/newsletter/unsubscribe?token=${unsubscribeToken}`
        : '#';

      const name = subscriberName || 'Valued Client';

      const emailContent = {
        from: 'jhasmany.fernandez.dev@gmail.com',
        to: email,
        subject: '📁 Your Portfolio Catalog - Latest Projects & Services',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #6c5ce7 0%, #5a67d8 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                📁 Portfolio Catalog
              </h1>
              <p style="color: #e3f2fd; margin: 10px 0 0 0; font-size: 16px;">
                Hi ${name}! Here's what I've been working on
              </p>
            </div>

            <div style="padding: 40px 20px; background-color: white;">
              <h2 style="color: #333; margin: 0 0 30px 0; font-size: 24px; text-align: center;">
                🚀 Featured Projects
              </h2>

              <!-- Project 1 -->
              <div style="border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="padding: 25px;">
                  <h3 style="color: #333; margin: 0 0 10px 0; font-size: 20px;">🌐 E-Commerce Platform</h3>
                  <p style="color: #666; margin: 0 0 15px 0; line-height: 1.6;">
                    Full-featured e-commerce solution with React, Node.js, and PostgreSQL. Includes payment processing, inventory management, and admin dashboard.
                  </p>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
                    <span style="background-color: #007bff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">React</span>
                    <span style="background-color: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Node.js</span>
                    <span style="background-color: #6f42c1; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">PostgreSQL</span>
                    <span style="background-color: #fd7e14; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Docker</span>
                  </div>
                </div>
              </div>

              <!-- Project 2 -->
              <div style="border: 1px solid #e9ecef; border-radius: 12px; overflow: hidden; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="padding: 25px;">
                  <h3 style="color: #333; margin: 0 0 10px 0; font-size: 20px;">📱 Task Management App</h3>
                  <p style="color: #666; margin: 0 0 15px 0; line-height: 1.6;">
                    Modern task management application with real-time collaboration, built with Next.js and NestJS with WebSocket integration.
                  </p>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
                    <span style="background-color: #000; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Next.js</span>
                    <span style="background-color: #e10098; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">NestJS</span>
                    <span style="background-color: #007acc; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">TypeScript</span>
                    <span style="background-color: #38b2ac; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Tailwind CSS</span>
                  </div>
                </div>
              </div>

              <div style="text-align: center; margin: 40px 0;">
                <a href="${portfolioUrl}"
                   style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 0 10px 10px 0;">
                  View All Projects
                </a>
                <a href="${servicesUrl}"
                   style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 0 10px 10px 0;">
                  Our Services
                </a>
              </div>

              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 30px 0;">
                <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px; text-align: center;">💼 Services We Offer</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                  <div>
                    <h4 style="color: #007bff; margin: 0 0 8px 0; font-size: 16px;">🌐 Web Development</h4>
                    <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.5;">Custom websites and web applications</p>
                  </div>
                  <div>
                    <h4 style="color: #28a745; margin: 0 0 8px 0; font-size: 16px;">📱 Mobile Solutions</h4>
                    <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.5;">React Native and Progressive Web Apps</p>
                  </div>
                  <div>
                    <h4 style="color: #6f42c1; margin: 0 0 8px 0; font-size: 16px;">🚀 DevOps & Cloud</h4>
                    <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.5;">Docker, AWS, and deployment automation</p>
                  </div>
                  <div>
                    <h4 style="color: #fd7e14; margin: 0 0 8px 0; font-size: 16px;">💡 Consulting</h4>
                    <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.5;">Technical architecture and code reviews</p>
                  </div>
                </div>
              </div>

              <div style="text-align: center; margin: 40px 0;">
                <h3 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Ready to start your project?</h3>
                <a href="${contactUrl}"
                   style="background-color: #6c5ce7; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 18px;">
                  💬 Let's Talk!
                </a>
              </div>
            </div>

            <div style="background-color: #333; padding: 30px 20px; text-align: center;">
              <p style="color: #ccc; margin: 0 0 10px 0; font-size: 14px;">
                Thanks for being part of our developer community!
              </p>
              <p style="color: #999; margin: 0; font-size: 12px;">
                <a href="${unsubscribeUrl}" style="color: #007bff; text-decoration: none;">Unsubscribe</a> |
                <a href="${portfolioUrl}" style="color: #007bff; text-decoration: none;">Portfolio</a> |
                <a href="${contactUrl}" style="color: #007bff; text-decoration: none;">Contact</a>
              </p>
            </div>
          </div>
        `,
      };

      await this.sendEmail(emailContent);

    } catch (error) {
      this.logger.error(`Failed to send portfolio catalog email to ${email}:`, error);
      throw new Error('Failed to send portfolio catalog email');
    }
  }

  async sendUnsubscribeConfirmation(email: string, subscriberName?: string): Promise<void> {
    try {
      const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3002');
      const name = subscriberName || 'Subscriber';

      const emailContent = {
        from: 'jhasmany.fernandez.dev@gmail.com',
        to: email,
        subject: '✅ Successfully Unsubscribed - Portfolio Jhasmany',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 40px 20px; text-align: center;">
              <h2 style="color: #333; margin: 0 0 20px 0;">You've been unsubscribed</h2>
              <p style="color: #666; margin: 0; line-height: 1.6;">
                Hi ${name}, we're sorry to see you go! You have been successfully unsubscribed from our newsletter.
              </p>
            </div>

            <div style="padding: 30px 20px; text-align: center;">
              <p style="color: #666; margin: 0 0 20px 0; line-height: 1.6;">
                If you change your mind, you can always subscribe again at:
              </p>
              <a href="${frontendUrl}"
                 style="color: #007bff; text-decoration: none; font-weight: bold;">
                ${frontendUrl}
              </a>
            </div>

            <div style="background-color: #333; padding: 20px; text-align: center;">
              <p style="color: #999; margin: 0; font-size: 12px;">
                This is an automated message from Portfolio Jhasmany.
              </p>
            </div>
          </div>
        `,
      };

      await this.sendEmail(emailContent);

    } catch (error) {
      this.logger.error(`Failed to send unsubscribe confirmation email to ${email}:`, error);
      // No lanzamos error aquí porque el unsubscribe ya fue exitoso
    }
  }
}