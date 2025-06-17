import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { TransformDate } from "src/util/validate.util";

export class EqmTestDateRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  test_cycle: number = null;

  @ApiProperty()
  @Transform(TransformDate)
  latest_test_date: Date = null;

  @ApiProperty()
  @Transform(TransformDate)
  next_test_date: Date = null;

  static init(partial: Partial<EqmEntity> = null): EqmTestDateRes {
    if (partial) {
      let self = new EqmTestDateRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
