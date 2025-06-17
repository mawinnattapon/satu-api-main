import { Module } from "@nestjs/common";
import { ReportController } from "./controller";
import { ReportService } from "./service";
import { FileUtil } from "src/util/file.util";

@Module({
  imports: [],
  controllers: [ReportController],
  providers: [ReportService, FileUtil],
})
export class ReportModule {}
