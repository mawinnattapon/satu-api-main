import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsDefined, IsNumber, IsOptional } from "class-validator";
import { FormPage } from "src/form/form.page";

export class ReportFindReq extends OmitType(FormPage, ["page", "per_page"] as const) {
  //
  @ApiProperty({ required: false, example: 1 })
  @IsDefined()
  @IsNumber()
  @IsOptional()
  form_id: number;

  @ApiProperty({ required: false, example: 1 })
  @IsDefined()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  created_start: Date;

  @ApiProperty({ required: false, example: 1 })
  @IsDefined()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  created_end: Date;

  @ApiProperty({ default: null, type: Number })
  @IsDefined()
  @IsNumber()
  @IsOptional()
  company_id: number;

  @ApiProperty({ default: null, type: Date })
  @IsDefined()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchase_date_start: Date;

  @ApiProperty({ default: null, type: Date })
  @IsDefined()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchase_date_end: Date;

  @ApiProperty({ default: null, type: Date })
  @IsDefined()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  installation_date_start: Date;

  @ApiProperty({ default: null, type: Date })
  @IsDefined()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  installation_date_end: Date;

  @ApiProperty({ default: null, type: Number })
  @IsDefined()
  @IsNumber()
  @IsOptional()
  category_id: number;

  @ApiProperty({ default: null, type: Number })
  @IsDefined()
  @IsNumber()
  @IsOptional()
  type_id: number;

  @ApiProperty({ default: null, type: Number })
  @IsDefined()
  @IsNumber()
  @IsOptional()
  active: number;

  @ApiProperty({ default: [], type: Array })
  @IsDefined()
  @IsArray()
  @IsOptional()
  column: string[];
}
