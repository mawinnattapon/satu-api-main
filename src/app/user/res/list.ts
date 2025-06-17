import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "src/entities/auth/user.entity";
import { StatusType } from "src/enum/master";

export class UserListRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  email: string = null;

  @ApiProperty()
  full_name: string = null;

  @ApiProperty()
  position: string = null;

  @ApiProperty()
  emp_no: string = null;

  @ApiProperty()
  photo: string = null;

  @ApiProperty()
  role_id: number = null;

  @ApiProperty()
  role_level: string = null;

  @ApiProperty()
  role_name: string = null;

  @ApiProperty()
  company_id: number = null;

  @ApiProperty()
  company_code: string = null;

  @ApiProperty()
  company_name: string = null;

  @ApiProperty()
  active: StatusType = null;

  static init(partial: Partial<UserEntity> = null): UserListRes {
    if (partial) {
      let self = new UserListRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      self.company_code = partial.company ? partial.company.code : null;
      self.company_name = partial.company ? partial.company.name : null;
      return self;
    } else {
      return null;
    }
  }
}
