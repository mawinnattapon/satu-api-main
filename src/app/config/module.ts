import { Module } from "@nestjs/common";
import { ConfigService } from "./service";
import { ConfigController } from "./controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigEntity } from "src/entities/config.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntity])],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}
