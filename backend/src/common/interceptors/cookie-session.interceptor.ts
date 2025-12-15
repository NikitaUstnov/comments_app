import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieSessionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CookieSessionInterceptor.name);
  private configService: ConfigService;

  constructor(config: ConfigService) {
    this.configService = config;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();

    const cookies = request.cookies || {};

    if (!cookies.guestId) {
      const guestId = randomUUID();
      const appMode = this.configService.get<string>('MODE');

      const secure = appMode === 'production' ? true : false;

      response.setCookie('guestId', guestId, {
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure,
        sameSite: 'lax',
      });

      (request as any).guestId = guestId;
    } else {
      (request as any).guestId = cookies.guestId;
    }

    return next.handle().pipe(
      tap(() => {
        this.logger.log('Response handled with cookie session');
      }),
    );
  }
}
