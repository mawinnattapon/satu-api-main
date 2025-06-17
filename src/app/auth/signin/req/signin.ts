import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDefined, IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Platform } from "src/enum/master";
import { TransformLower } from "src/util/validate.util";

export class SigninReq {
  //
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @IsEmail()
  @Transform(TransformLower)
  email: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  platform: Platform;
}
