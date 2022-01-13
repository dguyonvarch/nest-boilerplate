import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserOutputDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  modifiedAt: Date;
}
