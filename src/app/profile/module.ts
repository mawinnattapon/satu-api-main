import { Module } from "@nestjs/common";
import { SecureUtil } from "src/util/secure.util";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/auth/user.entity";
import { RoleEntity } from "src/entities/auth/role.entity";
import { FileUtil } from "src/util/file.util";
import { AuthManagerModule } from "src/module/authen.module";
import { ProfileController } from "./controller";
import { ProfileService } from "./service";

@Module({
  imports: [AuthManagerModule, TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [ProfileController],
  providers: [ProfileService, FileUtil, SecureUtil],
})
export class ProfileModule {}
