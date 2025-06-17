import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { RoleEntity } from "src/entities/auth/role.entity";

export class RoleItemRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  level: string = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  name_short: string = null;

  @ApiProperty()
  detail: string = null;

  @ApiProperty()
  @Type(() => Number)
  menu: number[] = [];

  static init(partial: Partial<RoleEntity> = null, menu: number[]): RoleItemRes {
    if (partial) {
      let self = new RoleItemRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      self.menu = menu;
      return self;
    } else {
      return null;
    }
  }
}
