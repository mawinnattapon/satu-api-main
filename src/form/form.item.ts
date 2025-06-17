import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class FormItem {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  id: number;
}
