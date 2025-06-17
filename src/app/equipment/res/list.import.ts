import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { Config } from "src/config";
import { TransformDate } from "src/util/validate.util";

export class ImportMovemontListRes {

  @ApiProperty()
  id: number = null;

  @ApiProperty()
  status: string = null;

  @ApiProperty()
  url: string = null;

  @ApiProperty()
  session: string = null;

  @ApiProperty()
  company: string = null;

  @ApiProperty()
  created_name: string = null;

  @ApiProperty()
  @Transform(TransformDate)
  created_at: Date = null;

  static init(partial: Partial<any> = null): ImportMovemontListRes {
    if (partial) {
      let self = new ImportMovemontListRes();
      for (const key of Object.keys(self)) self[key] = partial[key] ?? null;
      self.status = partial['status_name'] ?? '';
      self.url = `${Config.appUrl}/import/${partial.url}`;
      self.company = partial[`comp_name`] ?? '';
      return self;
    } else {
      return null;
    }
  }
}