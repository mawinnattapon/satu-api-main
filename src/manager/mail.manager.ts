import { Injectable, Logger } from "@nestjs/common";
import { Config } from "src/config";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import moment from "moment";
import { MailUtil } from "./mail.util";
import { AppException } from "src/rest/app.error";
import { VerifyEmailEntity } from "src/entities/verify.email.entity";
import { MailData } from "src/type/mail";
import { UserEntity } from "src/entities/auth/user.entity";
import { v4 as uuidv4 } from "uuid";
import { StatusType } from "src/enum/master";

@Injectable()
export class MailManager {
  private readonly logger = new Logger(MailManager.name);

  constructor(
    private readonly mailUtil: MailUtil,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(VerifyEmailEntity) private mailRepo: Repository<VerifyEmailEntity>
  ) {}

  async getVerifyByCode(ref_code: string): Promise<VerifyEmailEntity> {
    let item = await this.mailRepo.findOneBy({ ref_code, verified: 0 });
    if (!item) throw new AppException(500, "Verify Code Not Found");
    return item;
  }

  async updateVerifyByCode(ref_code: string): Promise<void> {
    let item = await this.mailRepo.findOneBy({ ref_code, verified: 0 });
    await this.mailRepo.update(item.id, { verified: 1, verify_time: new Date() });
  }

  async verifyUserEmail(ref_code: string): Promise<void> {
    let item = await this.mailRepo.findOneBy({ ref_code, verified: 0 });
    if (!item) throw new AppException(500, "Verify Code Not Found");
    await this.mailRepo.update(item.id, { verified: 1, verify_time: new Date() });
    await this.userRepo.update(item.user_id, { active: StatusType.active });
  }

  async sendRegisVerify(user_id: number, email: string): Promise<VerifyEmailEntity> {
    const ref_code = uuidv4().replace(/-/g, "");
    const data: MailData = {
      email,
      subject: "Verify Email",
      param: {
        url: `${Config.appUrl}/auth/verify/${ref_code}`,
      },
      fileName: "verify.mail",
    };
    let item = new VerifyEmailEntity();
    item.email = email;
    item.user_id = user_id;
    item.ref_code = ref_code;
    item.sended = 0;
    item.verified = 0;
    item.expire_at = moment().add(30, "m").toDate();
    item = await this.mailRepo.save(item, { reload: true });
    const send = await this.mailUtil.send(data);
    if (send.status === "ok") {
      await this.mailRepo.update(item.id, { sended: 1 });
    } else {
      throw new AppException(500, "Send Mail Failed.");
    }
    return item;
  }

  async sendForgotPwd(user_id: number, email: string): Promise<VerifyEmailEntity> {
    const ref_code = uuidv4().replace(/-/g, "");
    const data: MailData = {
      email,
      subject: "Forgot Your Password",
      param: {
        url: `${Config.appUrl}/action/forgot?ref_code=${ref_code}`,
      },
      fileName: "forgot.mail",
    };
    let item = new VerifyEmailEntity();
    item.email = email;
    item.user_id = user_id;
    item.ref_code = ref_code;
    item.sended = 0;
    item.verified = 0;
    item.expire_at = moment().add(30, "m").toDate();
    item = await this.mailRepo.save(item, { reload: true });
    const send = await this.mailUtil.send(data);
    if (send.status === "ok") {
      await this.mailRepo.update(item.id, { sended: 1 });
    } else {
      throw new AppException(500, "Send Mail Failed.");
    }
    return item;
  }

  async sendEmail(
    subject: string,
    email: string,
    fileName: string,
    param: { [key: string]: any },
    cc: string[] = []
  ): Promise<Boolean> {
    this.logger.debug(`[sendEmail] - Subject: ${subject}, To: ${email}, cc: ${JSON.stringify(cc)}`);
    const data: MailData = { email, subject, param, fileName, cc };
    const send = await this.mailUtil.send(data);
    if (send.status === "ok") {
      this.logger.debug(`[sendEmail] - Success`);
      return true;
    } else {
      this.logger.error(`[sendEmail] - Error: ${send.message}`);
      throw new AppException(500, "Send Mail Failed.");
    }
  }
}
