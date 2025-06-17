import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailManager } from "src/manager/mail.manager";
import { MailUtil } from "src/manager/mail.util";
import { VerifyEmailEntity } from "src/entities/verify.email.entity";
import { ServiceManager } from "src/manager/service.manager";
import { HttpModule } from "@nestjs/axios";
import { UserEntity } from "src/entities/auth/user.entity";

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([VerifyEmailEntity, UserEntity])],
  providers: [MailManager, MailUtil, ServiceManager],
  exports: [MailManager, MailUtil, ServiceManager],
})
export class MailModule {}
