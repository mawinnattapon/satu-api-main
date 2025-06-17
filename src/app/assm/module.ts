import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssmEqmController } from "./eqm/controller";
import { AssmEqmService } from "./eqm/service";
import { AssmFormsEntity } from "src/entities/assessment/assm.forms.entity";
import { FormsTypeEntity } from "src/entities/forms/forms.type.entity";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { AssmManagerModule } from "src/module/assm.module";

@Module({
  imports: [AssmManagerModule, TypeOrmModule.forFeature([EqmEntity, FormsEntity, AssmFormsEntity, FormsTypeEntity])],
  controllers: [AssmEqmController],
  providers: [AssmEqmService],
})
export class AssmModule {}
