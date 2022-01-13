import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginInputDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
