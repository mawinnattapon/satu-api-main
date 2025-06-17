import { ApiProperty } from "@nestjs/swagger";

export class LookupOption<T> {
  @ApiProperty({ type: Number })
  value: T;

  @ApiProperty()
  label: string;

  static init<T>(value: T, label: string): LookupOption<T> {
    let self = new LookupOption<T>();
    self.value = value;
    self.label = label;
    return self;
  }
}
