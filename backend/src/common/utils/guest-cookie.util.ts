import { FastifyReply } from 'fastify';
import { randomBytes } from 'crypto';
import { COOKIE_NAME } from '../constants/common-constants';

export class GuestCookieUtil {
  private static readonly MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days cookie age

  static generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }

  static getSessionExpiration(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    return expiresAt;
  }

  static isSessionExpired(expiresAt: Date | null | undefined): boolean {
    if (!expiresAt) return true;
    return new Date() > expiresAt;
  }

  static setGuestSessionCookie(
    response: FastifyReply,
    sessionToken: string,
    isProduction: boolean = false,
  ): void {
    response.setCookie(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: this.MAX_AGE_MS,
      path: '/',
    });
  }

  static clearGuestSessionCookie(response: FastifyReply): void {
    response.clearCookie(COOKIE_NAME, {
      path: '/',
    });
  }
}
