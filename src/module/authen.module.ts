import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/guard/jwt.strategy";
import { SecureUtil } from "src/util/secure.util";
import { Config } from "src/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/auth/user.entity";
import { RoleEntity } from "src/entities/auth/role.entity";
import { AuthenManager } from "src/manager/authen.manager";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: Config.appKey,
      signOptions: { expiresIn: Config.tokenExpire },
    }),
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
  ],
  providers: [AuthenManager, SecureUtil, JwtStrategy],
  exports: [AuthenManager, SecureUtil, JwtStrategy],
})
export class AuthManagerModule {}
