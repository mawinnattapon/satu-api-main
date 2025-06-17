import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform, Type } from "class-transformer";
import { UserEntity } from "src/entities/auth/user.entity";
import { Platform, StatusType, TrialStatus } from "src/enum/master";
import { RoleLevel } from "src/enum/role";
import { MenuRes } from "./menu.res";
import { IsArray } from "class-validator";
import { CompEntity } from "src/entities/company/company.entity";
import { TransformDate } from "src/util/validate.util";

export class CompProfile {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  code: string = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty({})
  active: StatusType = null;

  @ApiProperty({})
  photo: string = null;

  @ApiProperty({ default: TrialStatus.yes })
  trial: TrialStatus = null;

  @ApiProperty({})
  @Transform(TransformDate)
  trial_begin: Date = null;

  @ApiProperty({})
  @Transform(TransformDate)
  trial_end: Date = null;

  static init(partial: Partial<CompEntity> = null): CompProfile {
    if (partial) {
      let self = new CompProfile();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}

export class UserProfile {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  email: string = null;

  @Exclude()
  password: string = null;

  @ApiProperty()
  first_name: string = null;

  @ApiProperty()
  last_name: string = null;

  @ApiProperty()
  full_name: string = null;

  @ApiProperty()
  position: string = null;

  @ApiProperty()
  emp_no: string = null;

  @ApiProperty()
  mobile: string = null;

  @ApiProperty()
  photo: string = null;

  @ApiProperty()
  role_id: number = null;

  @ApiProperty()
  company_id: number = null;

  @ApiProperty()
  role_level: RoleLevel = null;

  @ApiProperty()
  role_name: string = null;

  @ApiProperty()
  active: StatusType = StatusType.inactive;

  @Exclude()
  auth_web: string = null;

  @Exclude()
  auth_mobile: string = null;

  @ApiProperty()
  last_active: Date = null;

  @Exclude()
  platform: Platform;

  @ApiProperty({ type: MenuRes, isArray: true })
  @IsArray({ always: true })
  @Type(() => MenuRes)
  menus: MenuRes[] = [];

  @ApiProperty({ type: CompProfile })
  @Type(() => CompProfile)
  company: CompProfile = null;

  static init(partial: Partial<UserEntity> = null, menus: MenuRes[] = []): UserProfile {
    if (partial) {
      let self = new UserProfile();
      for (const key of Object.keys(self)) self[key] = partial[key];
      self.company = CompProfile.init(partial.company);
      self.menus = menus;
      return self;
    } else {
      return null;
    }
  }
}
