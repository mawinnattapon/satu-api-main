import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsOptional, MaxLength, ValidateNested } from "class-validator";
import { InputType, Need, Warning } from "src/enum/master";

export class SaveFormsAws {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsDefined()
  @IsOptional()
  sub_title: string;

  @ApiProperty()
  @IsDefined()
  @IsOptional()
  extra: any;

  @ApiProperty({ required: true, type: Boolean })
  @IsDefined()
  @IsNotEmpty()
  @Transform((e) => (e.value ? Warning.yes : Warning.no))
  warning: Warning;
}

export class SaveFormsQst {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsOptional()
  detail: string;

  @ApiProperty({ required: true, enum: InputType })
  @IsDefined()
  @IsNotEmpty()
  input_type: InputType;

  @ApiProperty({ type: Boolean })
  @IsDefined()
  @IsNotEmpty()
  @Transform((e) => (e.value ? Need.yes : Need.no))
  required_photo: Need;

  @ApiProperty({ type: Boolean })
  @IsDefined()
  @IsNotEmpty()
  @Transform((e) => (e.value ? Need.yes : Need.no))
  required_note: Need;

  @ApiProperty({ type: SaveFormsAws, isArray: true })
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveFormsAws)
  answers: SaveFormsAws[];
}

export class SaveFormsReq {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  type_id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  detail: string;

  @ApiProperty({ type: SaveFormsQst, isArray: true })
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveFormsQst)
  questions: SaveFormsQst[] = [];
}

export class SaveNormalReq {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  detail: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  type_id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  doc_url: string;
}
