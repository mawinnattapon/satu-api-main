import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty } from "class-validator";

export class ChangePwdReq {
  //
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  ref_code: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  password_confirm: string;
}
