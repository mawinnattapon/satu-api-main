import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { AllowRepeat } from "src/enum/master";

export class EqmFormsListRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty({ type: Boolean })
  @Transform((e) => (e.value === 1 ? true : false))
  allow_repeat: AllowRepeat = AllowRepeat.no;

  @ApiProperty()
  last_id: number = null;

  @ApiProperty()
  last_date: Date = null;

  @ApiProperty()
  last_status: number = null;

  static init(partial: Partial<any> = null): EqmFormsListRes {
    if (partial) {
      let self = new EqmFormsListRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
