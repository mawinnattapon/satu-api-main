import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
  isNotEmpty,
} from "class-validator";
import { StatusType } from "src/enum/master";

export class EqmFormReq {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  type_id: number;
}

export class SaveEqmReq {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(300)
  name: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(300)
  @ValidateIf((e, val) => isNotEmpty(e.id))
  eqm_no: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(300)
  @IsOptional()
  alt_no: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(300)
  @ValidateIf((e, val) => isNotEmpty(val))
  model_name: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(300)
  @ValidateIf((e, val) => isNotEmpty(val))
  brand_name: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(300)
  @ValidateIf((e, val) => isNotEmpty(val))
  location: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(500)
  @ValidateIf((e, val) => isNotEmpty(val))
  detail: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  type_id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  company_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  project_id: number;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsDate()
  @Type(() => Date)
  @ValidateIf((e, val) => isNotEmpty(val))
  purchase_date: Date;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsDate()
  @Type(() => Date)
  @ValidateIf((e, val) => isNotEmpty(val))
  installation_date: Date;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(StatusType)
  active: StatusType;

  @ApiProperty({ required: false, type: String, isArray: true, example: ["https://xxx.com/aa.png"] })
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @ValidateIf((e, val) => isNotEmpty(val) && val.length > 0)
  photos: string[] = [];

  @ApiProperty({ required: false, type: EqmFormReq, isArray: true })
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EqmFormReq)
  forms: EqmFormReq[] = [];
}
