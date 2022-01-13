import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshInputDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
