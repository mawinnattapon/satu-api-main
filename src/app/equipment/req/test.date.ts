import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class EqmTestDateReq {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsOptional()
  id: number;

  @ApiProperty({ required: false, type: Number, isArray: true })
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  forms_id: number[];
}
