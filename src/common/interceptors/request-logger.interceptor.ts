import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import type { LoggerService } from '../../core';

@Injectable()
/**
 * Logs every request
 */
export class RequestLoggerInterceptor implements NestInterceptor {
  /**
   * Inititalizes the RequestLoggerInterceptor
   * and its logger
   */
  constructor(private readonly logger: LoggerService) {}

  /**
   * Intercepts every request and logs it
   * @param context The execution context
   * @param call$ The stream to for callback
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('incoming request', context.getClass().name);
    return next.handle();
  }
}
