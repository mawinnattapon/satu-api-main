import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber, IsOptional } from "class-validator";
import { FormPage } from "src/form/form.page";

export class FormsFindReq extends FormPage {
  //
  @ApiProperty({ required: false, example: 1 })
  @IsDefined()
  @IsNumber()
  @IsOptional()
  type_id: number;

  @ApiProperty({ required: false, example: 1 })
  @IsDefined()
  @IsNumber()
  @IsOptional()
  category_id: number;
}
