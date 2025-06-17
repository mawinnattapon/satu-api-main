import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray } from "class-validator";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { EqmFormsEntity } from "src/entities/equipment/equipment.form.entity";
import { StatusType } from "src/enum/master";
import { TransformDate } from "src/util/validate.util";

export class EqmFormRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  type_id: number = null;

  @ApiProperty()
  type_name: string = null;

  static init(partial: Partial<EqmFormsEntity> = null): EqmFormRes {
    if (partial) {
      let self = new EqmFormRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}

export class EqmItemRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  detail: string = null;

  @ApiProperty()
  model_name: string = null;

  @ApiProperty()
  brand_name: string = null;

  @ApiProperty()
  location: string = null;

  @ApiProperty()
  eqm_no: string = null;

  @ApiProperty()
  eqm_qrcode: string = null;

  @ApiProperty()
  eqm_barcode: string = null;

  @ApiProperty()
  alt_no: string = null;

  @ApiProperty()
  alt_qrcode: string = null;

  @ApiProperty()
  alt_barcode: string = null;

  @ApiProperty()
  category_id: number = null;

  @ApiProperty()
  category_name: number = null;

  @ApiProperty()
  type_id: number = null;

  @ApiProperty()
  type_name: number = null;

  @ApiProperty()
  company_id: number = null;

  @ApiProperty()
  company_name: number = null;

  @ApiProperty()
  project_id: number = null;

  @ApiProperty()
  project_name: number = null;

  @ApiProperty()
  @Transform(TransformDate)
  purchase_date: Date = null;

  @ApiProperty()
  @Transform(TransformDate)
  installation_date: Date = null;

  @ApiProperty()
  @Transform(TransformDate)
  latest_test_date: Date = null;

  @ApiProperty()
  @Transform(TransformDate)
  next_test_date: Date = null;

  @ApiProperty()
  active: StatusType = null;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @Type(() => String)
  photos: string[];

  @ApiProperty({ type: EqmFormRes, isArray: true })
  @IsArray()
  @Type(() => EqmFormRes)
  forms: EqmFormRes[];

  static init(partial: Partial<EqmEntity> = null): EqmItemRes {
    if (partial) {
      let self = new EqmItemRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      self.photos = partial.photos.map((e) => e.url);
      self.forms = partial.forms.map((e) => EqmFormRes.init(e));
      return self;
    } else {
      return null;
    }
  }
}
