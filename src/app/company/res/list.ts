import { ApiProperty } from "@nestjs/swagger";
import { CompEntity } from "src/entities/company/company.entity";
import { StatusType, TrialStatus } from "src/enum/master";

export class CompListRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  code: string = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  address_full: string = null;

  @ApiProperty()
  member_total: number = 0;

  @ApiProperty()
  active: StatusType = null;

  @ApiProperty({ default: TrialStatus.yes })
  trial: TrialStatus = null;

  static init(partial: Partial<CompEntity> = null): CompListRes {
    if (partial) {
      let self = new CompListRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}
