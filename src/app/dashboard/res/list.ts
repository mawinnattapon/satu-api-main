import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { AssmFormsEntity } from "src/entities/assessment/assm.forms.entity";
import { AssmResult, AssmStatus } from "src/enum/master";
import { TransformDate } from "src/util/validate.util";

export class DashListRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  equipment_id: number = null;

  @ApiProperty()
  equipment_name: string = null;

  @ApiProperty()
  type_id: number = null;

  @ApiProperty()
  type_name: string = null;

  @ApiProperty()
  forms_id: number = null;

  @ApiProperty()
  forms_name: string = null;

  @ApiProperty()
  status: AssmStatus = null;

  @ApiProperty()
  status_by: number = null;

  @ApiProperty()
  status_by_name: string = null;

  @ApiProperty()
  @Transform(TransformDate)
  status_at: Date = null;

  @ApiProperty()
  result: AssmResult = null;

  @ApiProperty()
  result_by: number = null;

  @ApiProperty()
  @Transform(TransformDate)
  result_at: Date = null;

  @ApiProperty()
  company_id: number = null;

  @ApiProperty()
  company_name: string = null;

  @ApiProperty()
  category_id: number = null;

  @ApiProperty()
  category_name: string = null;

  static init(partial: Partial<AssmFormsEntity> = null): DashListRes {
    if (partial) {
      let self = new DashListRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
