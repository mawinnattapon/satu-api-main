import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Crypt, Safe } from "src/util/enc";
import { Config } from "src/config";
import { AppException } from "src/rest/app.error";
import { Platform, StatusType } from "src/enum/master";
import { UserProfile } from "src/partial/user.profile";
import { AuthenManager } from "src/manager/authen.manager";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthenManager) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.appKey,
    });
  }

  async validate(payload: any): Promise<any> {
    const { id, key, platform } = new Crypt().decrypt(payload.data);

    let user: UserProfile = await this.auth.findProfileById(id);

    if (!user) throw new UnauthorizedException("User Not Found");

    if (platform == Platform.mobile) {
      if (!user.auth_mobile) throw new UnauthorizedException("User No EncCode");

      if (user.active !== StatusType.active) throw new AppException(403, "User Not Active");

      if (!Safe.verifyKey(user.auth_mobile, key)) throw new UnauthorizedException("User New Login");
    } else {
      if (!user) throw new UnauthorizedException("User NotFound");

      if (!user.auth_web) throw new UnauthorizedException("User No EncCode");

      if (user.active !== StatusType.active) throw new AppException(403, "User Not Active");

      if (!Safe.verifyKey(user.auth_web, key)) throw new UnauthorizedException("User New Login");
    }
    user.platform = platform;
    return user;
  }
}
