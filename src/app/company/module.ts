import { Module } from "@nestjs/common";
import { CompService } from "./service";
import { CompController } from "./controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompEntity } from "src/entities/company/company.entity";
import { ProjectEntity } from "src/entities/company/projects.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CompEntity, ProjectEntity])],
  controllers: [CompController],
  providers: [CompService],
})
export class CompModule {}
