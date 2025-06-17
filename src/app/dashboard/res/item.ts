import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray } from "class-validator";
import { EqmFormsItem } from "src/app/assm/eqm/res/eqm.forms.item";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { StatusType } from "src/enum/master";
import { TransformDate } from "src/util/validate.util";

export class DashEqmItemRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

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
  category_name: string = null;

  @ApiProperty()
  company_id: number = null;

  @ApiProperty()
  company_name: string = null;

  @ApiProperty()
  project_id: number = null;

  @ApiProperty()
  project_name: string = null;

  @ApiProperty()
  @Transform(TransformDate)
  purchase_date: Date = null;

  @ApiProperty()
  @Transform(TransformDate)
  installation_date: Date = null;

  @ApiProperty()
  active: StatusType = null;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @Type(() => String)
  photos: string[];

  static init(partial: Partial<EqmEntity> = null): DashEqmItemRes {
    if (partial) {
      let self = new DashEqmItemRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      self.photos = partial.photos.map((e) => e.url);
      return self;
    } else {
      return null;
    }
  }
}

export class DashItemRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty({ type: DashEqmItemRes })
  @Type(() => DashEqmItemRes)
  equipment: DashEqmItemRes = null;

  @ApiProperty({ type: EqmFormsItem })
  @Type(() => EqmFormsItem)
  forms: EqmFormsItem = null;

  static init(eqm: Partial<EqmEntity> = null, forms: EqmFormsItem): DashItemRes {
    if (eqm && forms) {
      let self = new DashItemRes();
      self.equipment = DashEqmItemRes.init(eqm);
      self.forms = forms;
      return self;
    } else {
      return null;
    }
  }
}
