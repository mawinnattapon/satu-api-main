import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Config } from "src/config";

export const connection: TypeOrmModuleOptions = {
  ...Config.database,
  entities: [__dirname + "/../entities/**/*.entity.{js,ts}", __dirname + "/../entities/*.entity.{js,ts}"],
};
