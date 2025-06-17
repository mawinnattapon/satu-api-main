import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class SaveRoleReq {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsOptional()
  id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(200)
  name_short: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(300)
  detail: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @Type(() => Number)
  menu: number[];
}
