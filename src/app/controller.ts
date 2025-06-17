import { All, Controller, Get, Req } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Config } from "src/config";

const dayjs:any = require('moment')
const packageJson = require("../../package.json");
const os = require("os");
const hostname = os.hostname();
const NODE_ENV = process.env.NODE_ENV
const start_date = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS")

@ApiExcludeController()
@Controller()
export class AppController {
  constructor() {}

  @All()
  async index(@Req() req: any) {
    return Config.appName;
  }

  @Get("/healthcheck")
  async healthcheck(@Req() req: any) {
    return {
        hostname: hostname,
        node_env: NODE_ENV,
        version: packageJson.version,
        updated: packageJson.versionDate,
        build_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        start_date,
        uptime: process.uptime(),
        timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
    }
  }
}
