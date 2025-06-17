import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDefined, IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { TransformLower } from "src/util/validate.util";

export class ForgotReq {
  //
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @IsEmail()
  @Transform(TransformLower)
  email: string;
}
