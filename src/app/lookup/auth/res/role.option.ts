import { ApiProperty } from "@nestjs/swagger";

export class RoleOption {
  @ApiProperty({ type: Number })
  value: number;

  @ApiProperty()
  label: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  detail: string;

  static init(value: number, label: string, level: string, detail: string): RoleOption {
    let self = new RoleOption();
    self.value = value;
    self.label = label;
    self.level = level;
    self.detail = detail;
    return self;
  }
}
