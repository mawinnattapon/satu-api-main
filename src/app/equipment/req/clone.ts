import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber } from "class-validator";

export class CloneItemReq {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  num: number;
}
