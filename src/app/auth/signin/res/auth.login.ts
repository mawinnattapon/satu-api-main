import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { UserProfile } from "src/partial/user.profile";
import { TransformDate } from "src/util/validate.util";

export class AuthLoginRes {
  @ApiProperty()
  token: string;

  @ApiProperty()
  tokenType: string;

  @ApiProperty()
  @Transform(TransformDate)
  expire: Date;

  @ApiProperty()
  expiresIn: string;

  @ApiProperty()
  profile: UserProfile;

  constructor({ token, tokenType, expire, expiresIn, profile }) {
    this.token = token;
    this.tokenType = tokenType;
    this.expire = expire;
    this.expiresIn = expiresIn;
    this.profile = profile;
  }
}
