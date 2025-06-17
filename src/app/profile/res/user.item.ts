import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "src/entities/auth/user.entity";
import { StatusType } from "src/enum/master";

export class UserItem {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  email: string = null;

  @ApiProperty()
  first_name: string = null;

  @ApiProperty()
  last_name: string = null;

  @ApiProperty()
  position: string = null;

  @ApiProperty()
  emp_no: string = null;

  @ApiProperty()
  mobile: string = null;

  @ApiProperty()
  photo: string = null;

  @ApiProperty()
  addr_info: string = null;

  @ApiProperty()
  addr_city: string = null;

  @ApiProperty()
  addr_state: string = null;

  @ApiProperty()
  addr_zipcode: string = null;

  @ApiProperty()
  addr_country: string = null;

  @ApiProperty()
  addr_country_name: string = null;

  @ApiProperty()
  role_id: number = null;

  @ApiProperty()
  role_name: string = null;

  @ApiProperty()
  active: StatusType = null;

  static init(partial: Partial<UserEntity> = null): UserItem {
    if (partial) {
      let self = new UserItem();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
