import { Module } from "@nestjs/common";
import { RoleService } from "./service";
import { RoleController } from "./controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "src/entities/auth/role.entity";
import { RoleMenuEntity } from "src/entities/auth/role.menu.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, RoleMenuEntity])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
