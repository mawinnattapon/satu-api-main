import { ApiProperty } from "@nestjs/swagger";
import { MenuEntity } from "src/entities/auth/menu.entity";

export class MenuItemRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  parent: number = null;

  @ApiProperty()
  url: string = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  priority: number = null;

  static init(partial: Partial<MenuEntity> = null): MenuItemRes {
    if (partial) {
      let self = new MenuItemRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
