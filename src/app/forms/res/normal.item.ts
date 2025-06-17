import { ApiProperty } from "@nestjs/swagger";
import { FormsEntity } from "src/entities/forms/forms.entity";

export class NormalItemRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  detail: string = null;

  @ApiProperty()
  doc_url: string = null;

  @ApiProperty()
  type_id: number = null;

  @ApiProperty()
  type_name: string = null;

  @ApiProperty()
  category_id: number = null;

  @ApiProperty()
  category_name: string = null;

  static init(partial: Partial<FormsEntity> = null): NormalItemRes {
    if (partial) {
      let self = new NormalItemRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
