import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { ConfigEntity } from "src/entities/config.entity";

export class ConfigRes {
  @ApiProperty()
  version: string = "1.0.0";

  @ApiProperty()
  @Transform(({ value }) => (value ? Boolean(value) : false))
  force: boolean = false;

  @ApiProperty()
  @Transform(({ value }) => (value ? Boolean(value) : false))
  register: boolean = false;

  @ApiProperty()
  @Transform(({ value }) => (value ? Boolean(value) : false))
  remove: boolean = false;

  static init(ls: ConfigEntity[] = null): ConfigRes {
    if (ls.length < 1) return new ConfigRes();
    let self = new ConfigRes();
    for (const row of ls) {
      self[row.key] = typeof self[row.key] === "boolean" ? Boolean(parseInt(row.value)) : row.value;
    }
    return self;
  }
}
