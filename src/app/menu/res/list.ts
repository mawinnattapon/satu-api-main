import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray } from "class-validator";
import { MenuEntity } from "src/entities/auth/menu.entity";
import { MenuItemRes } from "./item";

export class MenuListRes {
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

  @ApiProperty({ type: MenuItemRes, isArray: true })
  @IsArray({ always: true })
  @Type(() => MenuItemRes)
  children: MenuItemRes[] = [];

  static init(partial: Partial<MenuEntity> = null): MenuListRes {
    if (partial) {
      let self = new MenuListRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      self.children =
        partial.children && partial.children.length ? partial.children.map((e) => MenuItemRes.init(e)) : [];
      return self;
    } else {
      return null;
    }
  }
}
