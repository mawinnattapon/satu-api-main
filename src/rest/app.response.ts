import { ApiProperty } from "@nestjs/swagger";

export class AppResponse<T> {
  @ApiProperty({ enum: ["ok", "error"] })
  status: string;

  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: "success" })
  message: string;

  @ApiProperty({})
  data: Partial<T>;

  constructor(status: string | null, code: number | null, message: string | null, data: T) {
    if (status) this.status = status;
    if (code) this.code = code;
    if (message) this.message = message;
    this.data = data;
  }

  static success<T>(data: T) {
    return new AppResponse<T>("ok", 200, "success", data);
  }

  static error(code: number, message: string) {
    return new AppResponse("error", code, message, null);
  }
}
