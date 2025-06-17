import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "src/entities/auth/user.entity";

export class UserOption {
  @ApiProperty({ type: Number })
  id: number = null;

  @ApiProperty()
  full_name: string = null;

  @ApiProperty()
  position: string = null;

  @ApiProperty()
  photo: string = null;

  static init(item: Partial<UserEntity> = null): UserOption {
    if (item) {
      let self = new UserOption();
      for (const key of Object.keys(self)) self[key] = item[key];
      return self;
    } else {
      return null;
    }
  }
}
