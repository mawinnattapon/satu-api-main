import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class SearchDto {
  @ApiProperty({ default: '' })
  @IsDefined()
  keyword = '';
}
