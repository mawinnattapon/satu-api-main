import { Module } from "@nestjs/common";
import { FormsService } from "./service";
import { FormsController } from "./controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { FormsQstEntity } from "src/entities/forms/forms.qst.entity";
import { FormsAwsEntity } from "src/entities/forms/forms.aws.entity";
import { EqmFormsEntity } from "src/entities/equipment/equipment.form.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FormsEntity, FormsQstEntity, FormsAwsEntity, EqmFormsEntity])],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
