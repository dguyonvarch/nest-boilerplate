import { ApiProperty } from '@nestjs/swagger';

export class AuthOutputDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
