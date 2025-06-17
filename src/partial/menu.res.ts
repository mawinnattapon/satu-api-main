import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray } from "class-validator";
import { MenuEntity } from "src/entities/auth/menu.entity";

export class MenuRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  url: string = null;

  @ApiProperty()
  priority: number = null;

  @ApiProperty({ type: MenuRes, isArray: true })
  @IsArray({ always: true })
  @Type(() => MenuRes)
  children: MenuRes[];

  static init(partial: Partial<MenuEntity> = null): MenuRes {
    if (partial) {
      let self = new MenuRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      if (partial.children) {
        self.children = partial.children.map((e) => MenuRes.init(e));
      }
      return self;
    } else {
      return null;
    }
  }
}
