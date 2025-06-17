import { ApiProperty } from "@nestjs/swagger";

export class ResPaging {
  @ApiProperty()
  total: number;

  @ApiProperty()
  result: Array<any>;

  constructor(total: number, result: Array<any>) {
    this.total = total;
    this.result = result;
  }
}
