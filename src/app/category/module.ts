import { Module } from "@nestjs/common";
import { CategoryService } from "./service";
import { CategoryController } from "./controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "src/entities/forms/category.entity";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { EqmEntity } from "src/entities/equipment/equipment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, FormsEntity, EqmEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
