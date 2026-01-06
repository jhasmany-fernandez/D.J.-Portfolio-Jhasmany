import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME', 'portfolio_user'),
      password: this.configService.get('DB_PASSWORD', 'portfolio_password'),
      database: this.configService.get('DB_NAME', 'portfolio_db'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // Temporarily enabled for schema updates
      logging: false, // Disabled to reduce console logs
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: true,
      ssl: false, // Disable SSL for Docker development
      extra: {
        connectionLimit: 10,
        acquireTimeoutMillis: 60000,
        idleTimeoutMillis: 600000,
      },
    };
  }
}