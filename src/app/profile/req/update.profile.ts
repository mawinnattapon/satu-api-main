import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Matches,
  MaxLength,
  ValidateIf,
  isEmpty,
  isNotEmpty,
} from "class-validator";
import { EqualTo, TransformLower } from "src/util/validate.util";

export class SaveProfileReq {
  //
  @ApiProperty({ required: true, example: "วิชัย" })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(250)
  first_name: string;

  @ApiProperty({ required: true, example: "สุขใจ" })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(250)
  last_name: string;

  @ApiProperty({ default: null, example: "CEO" })
  @IsOptional()
  @MaxLength(250)
  @ValidateIf((e, val) => isNotEmpty(val))
  position: string;

  @ApiProperty({ default: null, example: "10001" })
  @IsOptional()
  @MaxLength(250)
  @ValidateIf((e, val) => isNotEmpty(val))
  emp_no: string;

  @ApiProperty({ default: null, example: "0812345678" })
  @IsDefined()
  @IsOptional()
  @IsNumberString({})
  @MaxLength(10)
  @ValidateIf((e, val) => isNotEmpty(val))
  mobile: string;

  @ApiProperty({ default: null, example: "wichai.s@email.com" })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  @IsEmail()
  @Transform(TransformLower)
  email: string;

  @ApiProperty({ default: null, example: "https://example.com/photo.png" })
  @IsOptional()
  @MaxLength(300)
  @ValidateIf((e, val) => isNotEmpty(val))
  photo: string;

  @ApiProperty({ default: null, example: "111/222 street abc" })
  @IsOptional()
  @MaxLength(400)
  @ValidateIf((e, val) => isNotEmpty(val))
  addr_info: string;

  @ApiProperty({ default: null, example: "bangkhen" })
  @IsOptional()
  @MaxLength(250)
  @ValidateIf((e, val) => isNotEmpty(val))
  addr_city: string;

  @ApiProperty({ default: null, example: "bangkok" })
  @IsOptional()
  @MaxLength(250)
  @ValidateIf((e, val) => isNotEmpty(val))
  addr_state: string;

  @ApiProperty({ default: null, example: "10000" })
  @IsOptional()
  @MaxLength(5)
  @ValidateIf((e, val) => isNotEmpty(val))
  addr_zipcode: string;

  @ApiProperty({ default: null, example: "TH" })
  @IsOptional()
  @MaxLength(2)
  @ValidateIf((e, val) => isNotEmpty(val))
  addr_country: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(100)
  old_password: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  @ValidateIf((e, val) => isNotEmpty(e.old_password))
  new_password: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  @EqualTo("new_password")
  @ValidateIf((e, val) => isNotEmpty(e.old_password))
  new_password_confirm: string;
}
