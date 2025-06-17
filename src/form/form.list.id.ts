import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsNumber } from "class-validator";

export class FormListId {
  @ApiProperty({ required: true, type: Number, isArray: true })
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  id: number[];
}
