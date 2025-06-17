import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { EqmPhotoEntity } from "src/entities/equipment/equipment.photo.entity";
import { EqmFormsEntity } from "src/entities/equipment/equipment.form.entity";
import { EqmController } from "./controller";
import { EqmService } from "./service";
import { FileUtil } from "src/util/file.util";
import { EqmManagerModule } from "src/module/eqm.module";
import { CompEntity } from "src/entities/company/company.entity";
import { ImportMovementEntity } from "src/entities/import.movement.entity";
import { ImportEqmTempEntity } from "src/entities/import.eqm.temp.entity";

@Module({
  imports: [EqmManagerModule, TypeOrmModule.forFeature([EqmEntity, EqmFormsEntity, EqmPhotoEntity, CompEntity, ImportMovementEntity, ImportEqmTempEntity])],
  controllers: [EqmController],
  providers: [EqmService, FileUtil],
})
export class EqmModule { }
