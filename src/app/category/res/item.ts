import { ApiProperty } from "@nestjs/swagger";
import { CategoryEntity } from "src/entities/forms/category.entity";

export class CategoryItemRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  detail: string = null;

  static init(partial: Partial<CategoryEntity> = null): CategoryItemRes {
    if (partial) {
      let self = new CategoryItemRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
