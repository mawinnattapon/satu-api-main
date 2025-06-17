import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray } from "class-validator";
import { AssmFormsEntity } from "src/entities/assessment/assm.forms.entity";
import { FormsAwsEntity } from "src/entities/forms/forms.aws.entity";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { FormsQstEntity } from "src/entities/forms/forms.qst.entity";
import { AllowRepeat, AssmResult, AssmStatus, InputType, Warning } from "src/enum/master";
import { TransformDate } from "src/util/validate.util";

export class FormsAws {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  title: string = null;

  @ApiProperty()
  sub_title: string = null;

  @ApiProperty()
  extra: any = null;

  @ApiProperty({ type: Boolean })
  @Transform((e) => (e.value ? true : false))
  warning: Warning = null;

  @ApiProperty()
  assm_aws_id: number = null;

  @ApiProperty({ default: "" })
  assm_aws_label: string = "";

  @ApiProperty({ default: null, type: Object })
  assm_aws_payload: any = null;

  @ApiProperty({ default: false })
  assm_aws_checked: boolean = false;

  static init(partial: Partial<FormsAwsEntity> = null, input_type: InputType): FormsAws {
    if (partial) {
      let self = new FormsAws();
      for (const key of Object.keys(self)) self[key] = partial[key];
      self.warning = partial.warning;
      self.assm_aws_id = null;
      self.assm_aws_label = "";
      self.assm_aws_payload = null;
      if ([InputType.tblMeasuring, InputType.tblConfirm].includes(input_type)) {
        self.assm_aws_payload = partial.extra;
        self.extra = { photo: false };
      }
      if ([InputType.short_text, InputType.long_text].includes(input_type)) {
        self.assm_aws_checked = true;
      } else {
        self.assm_aws_checked = false;
      }
      return self;
    } else {
      return null;
    }
  }
}

export class FormsQst {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  title: string = null;

  @ApiProperty()
  detail: string = null;

  @ApiProperty({ enum: InputType })
  input_type: InputType = null;

  @ApiProperty({ type: Boolean })
  @Transform((e) => (e.value ? true : false))
  required_photo: number = 0;

  @ApiProperty({ type: Boolean })
  @Transform((e) => (e.value ? true : false))
  required_note: number = 0;

  @ApiProperty()
  assm_qst_id: number = null;

  @ApiProperty({ default: "" })
  assm_qst_note: string = "";

  @ApiProperty({ type: String, isArray: true, default: [] })
  @IsArray()
  @Type(() => String)
  assm_qst_photo: string[] = [];

  @ApiProperty({ type: FormsAws, isArray: true })
  @IsArray()
  @Type(() => FormsAws)
  answers: FormsAws[];

  static init(partial: Partial<FormsQstEntity> = null): FormsQst {
    if (partial) {
      let self = new FormsQst();
      for (const key of Object.keys(self)) self[key] = partial[key];
      self.assm_qst_id = null;
      self.assm_qst_note = "";
      self.assm_qst_photo = [];
      self.answers = partial.answers.map((e) => FormsAws.init(e, self.input_type));
      return self;
    } else {
      return null;
    }
  }
}

export class EqmFormsItem {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  type_id: number = null;

  @ApiProperty()
  type_name: string = null;

  @ApiProperty({ type: Boolean, default: false })
  @Transform((e) => (e.value === 1 ? true : false))
  allow_repeat: AllowRepeat = AllowRepeat.no;

  @ApiProperty()
  equipment_id: number = null;

  @ApiProperty()
  assm_id: number = null;

  @ApiProperty({ enum: AssmStatus })
  assm_status: AssmStatus = null;

  @ApiProperty({})
  assm_status_by: number = null;

  @ApiProperty({})
  assm_status_by_name: string = null;

  @ApiProperty({})
  @Transform(TransformDate)
  assm_status_at: Date = null;

  @ApiProperty({ enum: AssmResult })
  assm_result: AssmResult = null;

  @ApiProperty()
  @Transform(TransformDate)
  assm_result_at: Date = null;

  @ApiProperty()
  @Transform(TransformDate)
  assm_created_at: Date = null;

  @ApiProperty({ type: FormsQst, isArray: true })
  @IsArray()
  @Type(() => FormsQst)
  questions: FormsQst[] = [];

  @ApiProperty({})
  doc_url: string = null;

  static init(eqm_id: number, form: Partial<FormsEntity> = null): EqmFormsItem {
    if (form) {
      let self = new EqmFormsItem();
      for (const key of Object.keys(self)) self[key] = form[key];
      self.equipment_id = eqm_id;
      self.assm_id = null;
      self.assm_status = null;
      self.assm_status_by = null;
      self.assm_status_by_name = null;
      self.assm_status_at = null;
      self.assm_result = null;
      self.assm_result_at = null;
      self.assm_created_at = null;
      self.type_id = form.forms_type.id;
      self.type_name = form.forms_type.name;
      self.allow_repeat = form.forms_type.allow_repeat;
      self.questions = form.questions.map((e) => FormsQst.init(e));
      return self;
    } else {
      return null;
    }
  }

  static prepare(form: EqmFormsItem, data: AssmFormsEntity) {
    if (data) {
      form.assm_id = data.id;
      form.assm_status = data.status;
      form.assm_status_by = data.status_by;
      form.assm_status_by_name = data.status_by_name;
      form.assm_status_at = data.status_at;
      form.assm_result = data.result;
      form.assm_result_at = data.result_at;
      form.assm_created_at = data.created_at;
      form.questions = form.questions.map((e) => {
        let qst = e;
        let fqst = data.questions.find((e) => e.forms_qst_id === qst.id);
        if (fqst) {
          qst.assm_qst_id = fqst.id;
          qst.assm_qst_note = fqst.forms_qst_note;
          qst.assm_qst_photo = fqst.forms_qst_photo;
          if (fqst.answers.length > 0) {
            qst.answers = qst.answers.map((e) => {
              let aws = e;
              let faws = fqst.answers.find((e) => e.forms_aws_id === aws.id);
              if (faws) {
                aws.assm_aws_id = faws.id;
                aws.assm_aws_label = faws.forms_aws_label;
                aws.assm_aws_payload = faws.forms_aws_json;
                if (qst.input_type === InputType.short_text || qst.input_type === InputType.long_text) {
                  aws.assm_aws_checked = true;
                } else {
                  aws.assm_aws_checked = faws.forms_aws_checked === 1;
                }
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
