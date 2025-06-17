import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";

export class SaveCompQuickReq {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(250)
  company_name: string;
}
