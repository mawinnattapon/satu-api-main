import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, MaxLength } from "class-validator";

export class SaveCompPrjQuickReq {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  company_id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(300)
  project_name: string;
}
