import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    // https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(exception.message);
  }
}
