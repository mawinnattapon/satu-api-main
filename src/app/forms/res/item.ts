import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray } from "class-validator";
import { FormsAwsEntity } from "src/entities/forms/forms.aws.entity";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { FormsQstEntity } from "src/entities/forms/forms.qst.entity";
import { InputType, Warning } from "src/enum/master";

export class FormsItemAws {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  title: string = null;

  @ApiProperty()
  sub_title: string = null;

  @ApiProperty({ type: Boolean })
  @Transform((e) => (e.value ? true : false))
  warning: Warning = null;

  @ApiProperty()
  extra: any = null;

  static init(partial: Partial<FormsAwsEntity> = null): FormsItemAws {
    if (partial) {
      let self = new FormsItemAws();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}

export class FormsItemQst {
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

  @ApiProperty({ type: FormsItemAws, isArray: true })
  @IsArray()
  @Type(() => FormsItemAws)
  answers: FormsItemAws[];

  static init(partial: Partial<FormsQstEntity> = null): FormsItemQst {
    if (partial) {
      let self = new FormsItemQst();
      for (const key of Object.keys(self)) self[key] = partial[key];
      self.answers = partial.answers.map((e) => FormsItemAws.init(e));
      return self;
    } else {
      return null;
    }
  }
}

export class FormsItemRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  detail: string = null;

  @ApiProperty()
  type_id: number = null;

  @ApiProperty()
  type_name: string = null;

  @ApiProperty()
  category_id: number = null;

  @ApiProperty()
  category_name: string = null;

  @ApiProperty({ type: FormsItemQst, isArray: true })
  @IsArray()
  @Type(() => FormsItemQst)
  questions: FormsItemQst[] = [];

  static init(partial: Partial<FormsEntity> = null): FormsItemRes {
    if (partial) {
      let self = new FormsItemRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      self.questions = partial.questions.map((e) => FormsItemQst.init(e));
      return self;
    } else {
      return null;
    }
  }
}
