import { Module } from "@nestjs/common";
import { SchTask } from "src/gateway/sch.task";

@Module({
  imports: [],
  providers: [SchTask],
})
export class TaskModule {}
