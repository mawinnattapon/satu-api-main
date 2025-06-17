import { ApiProperty } from "@nestjs/swagger";

export class FileUploadReq {
  @ApiProperty({ type: "string", format: "binary" })
  file: any;
}
