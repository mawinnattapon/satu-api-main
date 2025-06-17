import { join } from "path";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export class Config {
  static env: string = process.env.NODE_ENV || "development";
  static isDev: boolean = Config.env === "development";

  static appUrl: string = process.env.APP_URL || "";
  static apiUrl: string = process.env.API_URL || "";

  static appKey: string = process.env.APP_KEY || "secret";

  static algorithm = "AES-128-CBC";
  static appName: string = process.env.APP_NAME || "";

  static apiKey: string = process.env.API_KEY || "secret";
  static apiIv: string = process.env.API_IV || "0000000000000000";

  static tokenType: string = "Bearer";
  static tokenExpire: string = "4h";

  static publicUri: string = join(process.cwd(), "public");
  static importUri: string = join(process.cwd(), "public", "import");
  static uploadUrl: string = (process.env.APP_URL || "") + (process.env.UPLOAD_URI || "");
  static uploadUri: string = process.env.UPLOAD_URI || "";

  static serviceUrl: string = process.env.SERVICE_URL || "";
  static mailFrom: string = process.env.MAIL_FROM || "";

  static database: TypeOrmModuleOptions = {
    // logging: true,
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? "0"),
    database: process.env.DATABASE_DB,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
  };
}
