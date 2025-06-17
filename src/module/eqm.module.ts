import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { EqmFormsEntity } from "src/entities/equipment/equipment.form.entity";
import { EqmPhotoEntity } from "src/entities/equipment/equipment.photo.entity";
import { EqmManager } from "src/manager/eqm.manager";
import { ServiceManager } from "src/manager/service.manager";
import { FileUtil } from "src/util/file.util";

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([EqmEntity, EqmFormsEntity, EqmPhotoEntity])],
  providers: [EqmManager, FileUtil, ServiceManager],
  exports: [EqmManager, FileUtil, ServiceManager],
})
export class EqmManagerModule {}
