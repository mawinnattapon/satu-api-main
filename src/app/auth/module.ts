import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/guard/jwt.strategy";
import { SecureUtil } from "src/util/secure.util";
import { Config } from "src/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/auth/user.entity";
import { RoleEntity } from "src/entities/auth/role.entity";
import { HttpModule } from "@nestjs/axios";
import { SigninService } from "./signin/service";
import { SigninController } from "./signin/controller";
import { FileUtil } from "src/util/file.util";
import { AuthManagerModule } from "src/module/authen.module";
import { CompEntity } from "src/entities/company/company.entity";
import { SignupController } from "./signup/controller";
import { SignupService } from "./signup/service";
import { MailModule } from "src/module/mail.module";

@Module({
  imports: [
    HttpModule,
    MailModule,
    PassportModule,
    AuthManagerModule,
    JwtModule.register({
      secret: Config.appKey,
      signOptions: { expiresIn: Config.tokenExpire },
    }),
    TypeOrmModule.forFeature([UserEntity, RoleEntity, CompEntity]),
  ],
  controllers: [SigninController, SignupController],
  providers: [SigninService, SignupService, SecureUtil, JwtStrategy, FileUtil],
})
export class AuthModule {}
