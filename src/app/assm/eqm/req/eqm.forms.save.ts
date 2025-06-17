import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { SaveType } from "src/enum/master";
import { EqmFormsItem } from "../res/eqm.forms.item";
import { Type } from "class-transformer";

export class FormsAwsReq {
  //
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsNumber()
  @IsOptional()
  assm_aws_id: number;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  assm_aws_label: string;

  @ApiProperty({ default: null, type: Object })
  @IsDefined()
  @IsOptional()
  assm_aws_payload: any = null;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsOptional()
  assm_aws_checked: boolean;
}

export class FormsQstReq {
  //
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsNumber()
  @IsOptional()
  assm_qst_id: number;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  assm_qst_note: string;

  @ApiProperty({ required: false, type: String, isArray: true, default: [] })
  @IsDefined()
  @IsArray()
  @Type(() => String)
  @IsOptional()
  assm_qst_photo: string[];

  @ApiProperty({ required: true, type: FormsAwsReq, isArray: true })
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormsAwsReq)
  answers: FormsAwsReq[];
}

export class EqmFormsSaveReq {
  //
  @ApiProperty({ required: true, enum: SaveType })
  @IsDefined()
  @IsNotEmpty()
  save_type: SaveType;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  equipment_id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: false })
  @IsDefined()
  @IsNumber()
  @IsOptional()
  assm_id: number;

  @ApiProperty({ type: FormsQstReq, isArray: true })
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormsQstReq)
  questions: FormsQstReq[];

  static prepare(form: EqmFormsItem, data: EqmFormsSaveReq): EqmFormsItem {
    if (data) {
      form.assm_id = form.assm_id ? form.assm_id : data.assm_id;
      form.questions = form.questions.map((e) => {
        let qst = e;
        let fqst = data.questions.find((e) => e.id === qst.id);
        if (fqst) {
          qst.assm_qst_id = qst.assm_qst_id ? qst.assm_qst_id : fqst.assm_qst_id;
          qst.assm_qst_note = fqst.assm_qst_note;
          qst.assm_qst_photo = fqst.assm_qst_photo;
          if (fqst.answers.length > 0) {
            qst.answers = qst.answers.map((e) => {
              let aws = e;
              let faws = fqst.answers.find((e) => e.id === aws.id);
              if (faws) {
                aws.assm_aws_id = aws.assm_aws_id ? aws.assm_aws_id : faws.assm_aws_id;
                aws.assm_aws_label = faws.assm_aws_label;
                aws.assm_aws_payload = faws.assm_aws_payload;
                aws.assm_aws_checked = faws.assm_aws_checked;
              }
              return aws;
            });
          }
        }
        return qst;
      });
    }
    return form;
  }
}
