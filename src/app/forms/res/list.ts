import { ApiProperty } from "@nestjs/swagger";
import { FormsEntity } from "src/entities/forms/forms.entity";

export class FormsListRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  type_id: string = null;

  @ApiProperty()
  type_name: string = null;

  @ApiProperty()
  category_name: string = null;

  @ApiProperty()
  questions_total: number = null;

  static init(partial: Partial<FormsEntity> = null): FormsListRes {
    if (partial) {
      let self = new FormsListRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
