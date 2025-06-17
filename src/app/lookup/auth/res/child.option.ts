import { ApiProperty } from "@nestjs/swagger";

export class ChildOption {
  @ApiProperty()
  value: number;

  @ApiProperty()
  label: string;

  @ApiProperty({ type: [ChildOption] })
  children: Array<ChildOption>;

  static init(value: number, label: string, children: Array<ChildOption>): ChildOption {
    let self = new ChildOption();
    self.value = value;
    self.label = label;
    self.children = children;
    return self;
  }
}
