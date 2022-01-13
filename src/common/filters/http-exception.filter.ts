import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
  LoggerService,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import {
  EmailAlreadyExists,
  LoginException,
  RefreshTokenException,
  UserNotFoundLoginException,
  UserNotFoundRefreshTokenException,
} from '../../modules/auth/exceptions';
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
    if (e instanceof ForbiddenException) {
      return response
        .status(HttpStatus.FORBIDDEN)
        .json(new HttpErrorOutputDto('forbidden', 'You do not have access'));
    }
    if (
      e instanceof UserNotFoundLoginException ||
      e instanceof LoginException
    ) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          new HttpErrorOutputDto('login_error', 'Invalid username or password'),
        );
    }
    if (
      e instanceof RefreshTokenException ||
      e instanceof UserNotFoundRefreshTokenException
    ) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          new HttpErrorOutputDto(
            'refresh_token_error',
            'Invalid user or token',
          ),
        );
    }
    if (e instanceof EmailAlreadyExists) {
      return response
        .status(HttpStatus.CONFLICT)
        .json(new HttpErrorOutputDto('conflict_error', 'Email already exists'));
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
