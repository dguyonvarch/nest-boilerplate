import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
  LoggerService,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { WrongEmailLoginException } from 'src/modules/auth/exceptions/wrong-email-login.exception';
import { WrongPasswordLoginException } from 'src/modules/auth/exceptions/wrong-password-login.exception';

import { HttpErrorOutputDto } from '../dto/http-error.output.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(e: Error, host: ArgumentsHost): Response<HttpErrorOutputDto> {
    this.logger.error(e);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (e instanceof ConflictException) {
      return response
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json(new HttpErrorOutputDto('entity_already_exists', e.message));
    }
    if (e instanceof UnauthorizedException) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json(new HttpErrorOutputDto('unauthorized', 'You are not logged in'));
    }
    if (
      e instanceof WrongEmailLoginException ||
      e instanceof WrongPasswordLoginException
    ) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new HttpErrorOutputDto('login_error', 'Invalid username or password'),
        );
    }
    if (e instanceof BadRequestException) {
      const httpResponse: any = e.getResponse() as any;
      const message: string =
        httpResponse.message instanceof Array
          ? httpResponse.message.join(', ')
          : httpResponse.message;
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json(new HttpErrorOutputDto('validation_error', message));
    }
    if (e instanceof NotFoundException) {
      const httpResponse: any = e.getResponse() as any;
      const message: string = httpResponse.message;
      return response
        .status(HttpStatus.NOT_FOUND)
        .json(new HttpErrorOutputDto('not_found', message));
    }

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new HttpErrorOutputDto(
          'internal_error',
          'A internal error has occured',
        ),
      );
  }
}
