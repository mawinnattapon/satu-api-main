import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty } from "class-validator";

export class FindPrjInCompReq {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  company_id: number;
}
