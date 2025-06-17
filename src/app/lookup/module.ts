import { Module } from "@nestjs/common";
import { LookupAuthService } from "./auth/service";
import { LookupAuthController } from "./auth/controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "src/entities/auth/role.entity";
import { UserEntity } from "src/entities/auth/user.entity";
import { CountryEntity } from "src/entities/country.entity";
import { MenuEntity } from "src/entities/auth/menu.entity";
import { LookupMasterController } from "./master/controller";
import { LookupMasterService } from "./master/service";
import { CategoryEntity } from "src/entities/forms/category.entity";
import { CompEntity } from "src/entities/company/company.entity";
import { ProjectEntity } from "src/entities/company/projects.entity";
import { LookupFormsController } from "./forms/controller";
import { LookupFormsService } from "./forms/service";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { FormsTypeEntity } from "src/entities/forms/forms.type.entity";
import { EqmTypeEntity } from "src/entities/equipment/equipment.type.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      CountryEntity,
      MenuEntity,
      CategoryEntity,
      CompEntity,
      ProjectEntity,
      FormsEntity,
      FormsTypeEntity,
      EqmTypeEntity,
    ]),
  ],
  controllers: [LookupAuthController, LookupMasterController, LookupFormsController],
  providers: [LookupAuthService, LookupMasterService, LookupFormsService],
})
export class LookupModule {}
