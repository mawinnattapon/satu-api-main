
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";
import { FileReq } from "src/form/file.req";

export class UploadEqmReq extends FileReq {
  @ApiProperty({ required: false })
  @IsOptional()
  comp_id: number;
}

export class UploadFailReq {
  @ApiProperty({ required: true, type: String, example: '562abb47729f4f61b86d6c3dca61434a' })
  @IsDefined()
  @IsNotEmpty()
  session: string;
}