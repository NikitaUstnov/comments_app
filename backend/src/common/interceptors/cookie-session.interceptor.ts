import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';
import { COOKIE_NAME } from '../constants/common-constants';

@Injectable()
export class CookieSessionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CookieSessionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const cookies = request.cookies || {};

    const guestSession = cookies[COOKIE_NAME];

    if (guestSession) {
      (request as any).guestSessionToken = guestSession;
      this.logger.debug(`Guest session found: ${guestSession}`);
    } else {
      this.logger.debug('No guest session cookie');
    }

    return next.handle();
  }
}
