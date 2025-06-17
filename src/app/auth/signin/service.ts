import { Injectable } from "@nestjs/common";
import { AppException } from "src/rest/app.error";
import { AuthLoginRes } from "./res/auth.login";
import { Platform, TrialStatus } from "src/enum/master";
import { SigninReq } from "./req/signin";
import { UserProfile } from "src/partial/user.profile";
import { AuthenManager } from "src/manager/authen.manager";
import { RoleComp, RoleLevel } from "src/enum/role";
import { InjectRepository } from "@nestjs/typeorm";
import { CompEntity } from "src/entities/company/company.entity";
import { Repository } from "typeorm";
import moment from "moment";

@Injectable()
export class SigninService {
  constructor(
    private readonly auth: AuthenManager,
    @InjectRepository(CompEntity) private compRepo: Repository<CompEntity>
  ) {}

  async signin(form: SigninReq): Promise<AuthLoginRes> {
    const { email, password, platform } = form;

    let user: UserProfile = await this.auth.findProfileByEmail(email);
    if (!user) throw new AppException(404, "Incorrect Email Or Password");

    if (!this.auth.passwordIsTrue(user.password, password)) {
      throw new AppException(404, "Incorrect Email Or Password");
    }

    if (RoleComp.includes(user.role_level)) {
      const comp = await this.compRepo.findOneBy({ id: user.company_id });
      if (comp) {
        if (comp.trial === TrialStatus.yes) {
          if (moment().isBefore(moment(comp.trial_begin), "day"))
            throw new AppException(
              404,
              `Trial period has not started yet. Please wait until ${moment(comp.trial_begin).format("DD/MM/YYYY")}.`
            );

          if (moment().isAfter(moment(comp.trial_end), "day"))
            throw new AppException(404, "Trial has expired. Please contact support for assistance.");
        }
      } else {
        throw new AppException(404, "Company not found for this user or this user is not affiliated with any company.");
      }
    }

    if (user.role_level === RoleLevel.member) {
      if (platform !== Platform.mobile) throw new AppException(404, "Member Allow Use Only Mobile.");
    } else {
      if (user.role_level !== RoleLevel.dev) {
        if (platform !== Platform.web) throw new AppException(404, `${user.role_name} Allow Use Only Website.`);
      }
    }

    return await this.auth.loginSuccess(user, platform);
  }

  async signout(user: UserProfile): Promise<boolean> {
    if (user.platform === Platform.mobile) {
      await this.auth.signoutMobile(user.id);
    } else {
      await this.auth.signoutWeb(user.id);
    }
    return true;
  }
}
