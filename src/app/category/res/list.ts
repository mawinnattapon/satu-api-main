import { ApiProperty } from "@nestjs/swagger";
import { CategoryEntity } from "src/entities/forms/category.entity";

export class CategoryListRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  detail: string = null;

  static init(partial: Partial<CategoryEntity> = null): CategoryListRes {
    if (partial) {
      let self = new CategoryListRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
