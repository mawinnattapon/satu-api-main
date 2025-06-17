import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class SchTask {
  //
  private readonly logger = new Logger(SchTask.name);

  constructor(@InjectDataSource() private ds: DataSource) {}

  // สร้างนัดหมาย <= 120 นาที และ ไม่มีการ confirm ภายใน 20,25 นาที
  @Cron("0 * * * * *", { timeZone: "Asia/Bangkok", disabled: true })
  async run() {
    //
  }
}
