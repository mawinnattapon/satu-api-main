import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

class MailFromReq {
  @ApiProperty({ required: false, type: String, example: "ISTRONG" })
  name: string;

  @ApiProperty({ required: true, type: String, example: "example@email.com" })
  address: string;
}

export class MailReq {
  @ApiProperty({ required: true, type: MailFromReq })
  @Type(() => MailFromReq)
  by: MailFromReq;

  @ApiProperty({
    required: true,
    type: String,
    isArray: true,
    example: ["example@email.com"],
    examples: ["example@email.com", ["example1@email.com", "example2@email.com"]],
  })
  to: string | string[];

  @ApiProperty({
    required: false,
    type: String,
    isArray: true,
    examples: ["example@email.com", ["example1@email.com", "example2@email.com"]],
  })
  cc?: string | string[];

  @ApiProperty({
    required: false,
    type: String,
    isArray: true,
    examples: ["example@email.com", ["example1@email.com", "example2@email.com"]],
  })
  bcc?: string | string[];

  @ApiProperty({ required: true, type: String, example: "ทดสอบการส่งเมล" })
  subject: string;

  @ApiProperty({ required: false, type: String, example: "เนื้อหาทดสอบการส่งเมล" })
  text?: string;

  @ApiProperty({ required: false, type: String, example: "HTML" })
  html?: string;

  @ApiProperty({ required: false, type: Array, isArray: true })
  attachments?: [];
}
