import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorOutputDto {
  @ApiProperty()
  readonly code: string;
  @ApiProperty()
  readonly message: string;
  @ApiProperty()
  readonly timestamp: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
