import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";
import { FormPage } from "src/form/form.page";

export class EqmFindReq extends FormPage {
  @ApiProperty({ default: null, type: Number })
  @IsOptional()
  category_id: number;

  @ApiProperty({ default: null, type: Number })
  @IsOptional()
  company_id: number;

  @ApiProperty({ default: null, type: Number })
  @IsOptional()
  active: number;

  @ApiProperty({ default: null, type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchase_date_start: Date;

  @ApiProperty({ default: null, type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchase_date_end: Date;

  @ApiProperty({ default: null, type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  installation_date_start: Date;

  @ApiProperty({ default: null, type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  installation_date_end: Date;
}
