import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  ValidateIf,
  ValidateNested,
  isNotEmpty,
} from "class-validator";
import { StatusType } from "src/enum/master";
import { TransformLower } from "src/util/validate.util";

export class DashProjectReq {
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
  @MaxLength(300)
  @ValidateIf((e, val) => isNotEmpty(val))
  detail: string;
}

export class SaveDashReq {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  id: number;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(300)
  @ValidateIf((e, val) => isNotEmpty(val))
  code: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(250)
  @IsEmail()
  @Transform(TransformLower)
  @ValidateIf((e, val) => isNotEmpty(val))
  email: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(250)
  @ValidateIf((e, val) => isNotEmpty(val))
  contact_name: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(10)
  @ValidateIf((e, val) => isNotEmpty(val))
  contact_phone: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(300)
  @ValidateIf((e, val) => isNotEmpty(val))
  photo: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(400)
  @ValidateIf((e, val) => isNotEmpty(val))
  addr_info: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(250)
  @ValidateIf((e, val) => isNotEmpty(val))
  addr_city: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(250)
  @ValidateIf((e, val) => isNotEmpty(val))
  addr_state: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(5)
  @ValidateIf((e, val) => isNotEmpty(val))
  addr_zipcode: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @MaxLength(2)
  @ValidateIf((e, val) => isNotEmpty(val))
  addr_country: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(StatusType)
  active: StatusType;

  @ApiProperty({ required: false, type: Number, isArray: true })
  @IsDefined()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @ValidateIf((e, val) => isNotEmpty(val) && val.length > 0)
  members: number[] = [];

  @ApiProperty({ required: false, type: DashProjectReq, isArray: true })
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DashProjectReq)
  @ValidateIf((e, val) => isNotEmpty(val) && val.length > 0)
  projects: DashProjectReq[] = [];
}
