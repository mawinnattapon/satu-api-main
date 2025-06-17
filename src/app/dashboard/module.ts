import { Module } from "@nestjs/common";
import { DashService } from "./service";
import { DashController } from "./controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssmManagerModule } from "src/module/assm.module";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { AssmFormsEntity } from "src/entities/assessment/assm.forms.entity";
import { FormsTypeEntity } from "src/entities/forms/forms.type.entity";

@Module({
  imports: [AssmManagerModule, TypeOrmModule.forFeature([EqmEntity, FormsEntity, AssmFormsEntity, FormsTypeEntity])],
  controllers: [DashController],
  providers: [DashService],
})
export class DashModule {}
