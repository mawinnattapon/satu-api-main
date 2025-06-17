import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";

export class EqmFormFindReq {
  //
  @ApiProperty({ required: true, example: "SN0000000000" })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(250)
  code: string;
}
