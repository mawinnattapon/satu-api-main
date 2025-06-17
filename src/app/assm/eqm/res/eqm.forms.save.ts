import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { AssmFormsEntity } from "src/entities/assessment/assm.forms.entity";
import { AssmStatus } from "src/enum/master";
import { TransformDate } from "src/util/validate.util";

export class EqmFormsSaveRes {
  //
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  status: AssmStatus = null;

  @ApiProperty()
  @Transform(TransformDate)
  created_at: Date = null;

  @ApiProperty()
  @Transform(TransformDate)
  updated_at: Date = null;

  static init(partial: Partial<AssmFormsEntity> = null): EqmFormsSaveRes {
    if (partial) {
      let self = new EqmFormsSaveRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
