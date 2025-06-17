import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";
import { EqualTo } from "src/util/validate.util";

export class PasswordChangeReq {
  //

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  old_password: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  new_password: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(100)
  @EqualTo("new_password")
  new_password_confirm: string;
}
