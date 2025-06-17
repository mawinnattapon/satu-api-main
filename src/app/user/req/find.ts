import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { FormPage } from "src/form/form.page";

export class FindForm extends FormPage {
  @ApiProperty({ default: "", type: String })
  @IsOptional()
  company_id: number;
}
