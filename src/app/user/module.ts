import { Module } from "@nestjs/common";
import { UserService } from "./service";
import { UserController } from "./controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/auth/user.entity";
import { SecureUtil } from "src/util/secure.util";
import { RoleEntity } from "src/entities/auth/role.entity";
import { FileUtil } from "src/util/file.util";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UserController],
  providers: [UserService, FileUtil, SecureUtil],
})
export class UserModule {}
