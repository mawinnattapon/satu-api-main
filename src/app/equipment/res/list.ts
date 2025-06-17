import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { StatusType } from "src/enum/master";
import { TransformDate } from "src/util/validate.util";

export class EqmListRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  eqm_no: string = null;

  @ApiProperty()
  alt_no: string = null;

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
  @Transform(TransformDate)
  purchase_date: Date = null;

  @ApiProperty()
  @Transform(TransformDate)
  installation_date: Date = null;

  @ApiProperty()
  active: StatusType = null;

  static init(partial: Partial<EqmEntity> = null): EqmListRes {
    if (partial) {
      let self = new EqmListRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
