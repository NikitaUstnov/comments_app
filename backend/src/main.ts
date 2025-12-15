import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConsoleLogger, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import helmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import multiPart from '@fastify/multipart';
import { join } from 'path';
import fastifyCookie from '@fastify/cookie';
import { CookieSessionInterceptor } from './common/interceptors/cookie-session.interceptor';

type AppMode = 'development' | 'production';

class App {
  private host: string;
  private port: number;
  private appMode: AppMode;

  constructor(private readonly configService: ConfigService) {
    this.host = configService.get('HOST', '0.0.0.0');
    this.port = configService.get('PORT', 3000);
    this.appMode = configService.get('MODE', 'development');
  }

  /**
   * Get app mode
   * @returns {boolean} app mode
   */
  private isProduction(): boolean {
    return this.appMode === 'production';
  }

  /**
   * Get log level
   * @param {boolean} isProduction
   * @returns {LogLevel[]} log level
   */
  private logLevel(isProduction: boolean): LogLevel[] {
    return isProduction
      ? ['error', 'warn', 'log']
      : ['log', 'error', 'warn', 'debug', 'verbose'];
  }

  /**
   * Create api docs (devmode only)
   * @param {boolean} isProduction
   * @param {NestFastifyApplication} app
   */
  private documentBuilder(
    isProduction: boolean = true,
    app: NestFastifyApplication,
  ): void {
    if (!isProduction) {
      return;
    }
    const options = new DocumentBuilder()
      .setTitle('Comments App')
      .setDescription('Comments App API')
      .setVersion('1.0')
      .addTag('Comments App')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  /**
   * Start app
   */
  async bootstrap() {
    const isProduction = this.isProduction();
    const logLevel = this.logLevel(isProduction);

    const fastifyAdapter = new FastifyAdapter();

    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      fastifyAdapter,
      {
        logger: new ConsoleLogger({
          prefix: '[Comments App]',
          logLevels: logLevel,
          timestamp: true,
        }),
      },
    );

    await fastifyAdapter.register(helmet, {
      crossOriginResourcePolicy: false,
    });
    await fastifyAdapter.register(fastifyStatic, {
      root: join(__dirname, '..', 'uploads'),
      prefix: '/uploads/',
      setHeaders: (res, path, stat) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      },
    });
    await fastifyAdapter.register(multiPart, {
      limits: {
        files: 1, // allow only one file per request
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    });

    await fastifyAdapter.register(fastifyCookie, {
      secret: this.configService.get('COOKIE_SECRET', 'secret-key'),
    });

    //global validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // global interceptors
    app.useGlobalInterceptors(new CookieSessionInterceptor(this.configService));

    //setting up swagger
    this.documentBuilder(isProduction, app);

    app.setGlobalPrefix('api');
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    await app.listen(this.port, this.host, (err: Error | null) => {
      if (err) {
        throw new Error(err.message);
      }

      console.log(`Server is running on ${this.host}:${this.port}`);
    });
  }
}

new App(new ConfigService()).bootstrap().catch((message: string) => {
  console.error(message);
  process.exit(1);
});
