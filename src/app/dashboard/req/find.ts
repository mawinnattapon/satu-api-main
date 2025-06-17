import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";
import { FormPage } from "src/form/form.page";

export class DashFormPage extends FormPage {
  //
  @ApiProperty({ required: true, example: "2023-07-04T00:00:00+07:00" })
  @IsDefined()
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty({ required: true, example: "2023-12-31T00:00:00+07:00" })
  @IsDefined()
  @IsNotEmpty()
  end_date: Date;

  @ApiProperty({ required: false, default: null })
  @IsDefined()
  @IsOptional()
  company_id: number;

  @ApiProperty({ required: false, default: null })
  @IsDefined()
  @IsOptional()
  type_id: number;
}
