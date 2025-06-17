import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber } from "class-validator";

export class EqmFormsItemReq {
  //
  @ApiProperty({ required: true, example: 1 })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  eqm_id: number;

  @ApiProperty({ required: true, example: 1 })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  forms_id: number;
}
