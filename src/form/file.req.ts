import { ApiProperty } from "@nestjs/swagger";

export class FileReq {
  @ApiProperty({ type: String, format: "binary" })
  file: any;
}