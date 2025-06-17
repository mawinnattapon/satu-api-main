import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuEntity } from "src/entities/auth/menu.entity";
import { MenuController } from "./controller";
import { MenuService } from "./service";

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
