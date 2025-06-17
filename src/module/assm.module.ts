import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssmFormsAwsEntity } from "src/entities/assessment/assm.forms.aws.entity";
import { AssmFormsEntity } from "src/entities/assessment/assm.forms.entity";
import { AssmFormsQstEntity } from "src/entities/assessment/assm.forms.qst.entity";
import { UserEntity } from "src/entities/auth/user.entity";
import { CompEntity } from "src/entities/company/company.entity";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { EqmFormsEntity } from "src/entities/equipment/equipment.form.entity";
import { CategoryEntity } from "src/entities/forms/category.entity";
import { DueRangeEntity } from "src/entities/forms/due.range.entity";
import { FormsAwsEntity } from "src/entities/forms/forms.aws.entity";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { FormsQstEntity } from "src/entities/forms/forms.qst.entity";
import { FormsTypeEntity } from "src/entities/forms/forms.type.entity";
import { AssmManager } from "src/manager/assm.manager";
import { MailModule } from "./mail.module";
import { EqmPhotoEntity } from "src/entities/equipment/equipment.photo.entity";
import { FileUtil } from "src/util/file.util";

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([
      UserEntity,
      CompEntity,
      EqmEntity,
      EqmPhotoEntity,
      EqmFormsEntity,
      CategoryEntity,
      DueRangeEntity,
      FormsTypeEntity,
      FormsEntity,
      FormsAwsEntity,
      FormsQstEntity,
      AssmFormsEntity,
      AssmFormsQstEntity,
      AssmFormsAwsEntity,
    ]),
  ],
  providers: [AssmManager, FileUtil],
  exports: [AssmManager, FileUtil],
})
export class AssmManagerModule {}
