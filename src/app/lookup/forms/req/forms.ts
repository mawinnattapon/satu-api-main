import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsOptional } from "class-validator";

export class FormsOptReq {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  category_id: number;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  type_id: number;
}
