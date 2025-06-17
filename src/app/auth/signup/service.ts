import { Injectable } from "@nestjs/common";
import { AppException } from "src/rest/app.error";
import { SignupReq } from "./req/signup";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { UserEntity } from "src/entities/auth/user.entity";
import { SecureUtil } from "src/util/secure.util";
import { StatusType } from "src/enum/master";
import { MailManager } from "src/manager/mail.manager";
import { ForgotReq } from "./req/forgot";
import { ChangePwdReq } from "./req/chg.pwd";

@Injectable()
export class SignupService {
  constructor(
    private readonly secureUtil: SecureUtil,
    private readonly mail: MailManager,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) {}

  async signup(form: SignupReq): Promise<boolean> {
    const { first_name, last_name, email, password, password_confirm } = form;

    let cnt: number = await this.userRepo.countBy({ email, deleted_by: IsNull() });
    if (cnt > 0) throw new AppException(400, "This email is already in use.");

    if (password !== password_confirm) throw new AppException(404, "Password Not Match.");

    let user = new UserEntity();
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.password = this.secureUtil.encrypt(password);
    user.active = StatusType.inactive;
    user.role_id = 4;
    user.company_id = 0;
    user.created_by = 0;
    user.created_at = new Date();
    user.updated_by = 0;
    user.updated_at = new Date();

    user = await this.userRepo.save(user, { reload: true });

    await this.mail.sendRegisVerify(user.id, user.email);

    return true;
  }

  async verify(ref_code: string): Promise<boolean> {
    await this.mail.verifyUserEmail(ref_code);
    return true;
  }

  async forgot(form: ForgotReq): Promise<boolean> {
    const { email } = form;
    let user: UserEntity = await this.userRepo.findOneBy({ email, deleted_by: IsNull() });
    if (!user) throw new AppException(404, "Email Not Found.");
    await this.mail.sendForgotPwd(user.id, user.email);
    return true;
  }

  async forgotResetPwd(form: ChangePwdReq): Promise<boolean> {
    const { ref_code, password, password_confirm } = form;
    if (password !== password_confirm) throw new AppException(404, "Password Not Match.");

    const verify = await this.mail.getVerifyByCode(ref_code);
    let user: UserEntity = await this.userRepo.findOneBy({ id: verify.user_id, deleted_by: IsNull() });
    if (!user) throw new AppException(404, "User Not Found.");

    user.password = this.secureUtil.encrypt(password);
    user.updated_by = user.id;
    user.updated_at = new Date();
    user = await this.userRepo.save(user, { reload: true });
    await this.mail.updateVerifyByCode(ref_code);

    return true;
  }
}
