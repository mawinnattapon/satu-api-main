import { ApiProperty } from "@nestjs/swagger";
import { RoleEntity } from "src/entities/auth/role.entity";

export class RoleListRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  level: string = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  name_short: string = null;

  static init(partial: Partial<RoleEntity> = null): RoleListRes {
    if (partial) {
      let self = new RoleListRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
