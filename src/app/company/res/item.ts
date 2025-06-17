import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray } from "class-validator";
import { CompEntity } from "src/entities/company/company.entity";
import { ProjectEntity } from "src/entities/company/projects.entity";
import { StatusType, TrialStatus } from "src/enum/master";
import { TransformDate } from "src/util/validate.util";

export class ComPrjRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  detail: string = null;

  static init(partial: Partial<ProjectEntity> = null): ComPrjRes {
    if (partial) {
      let self = new ComPrjRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      return self;
    } else {
      return null;
    }
  }
}

export class CompItemRes {
  @ApiProperty()
  id: number = null;

  @ApiProperty()
  code: string = null;

  @ApiProperty()
  name: string = null;

  @ApiProperty()
  email: string = null;

  @ApiProperty()
  contact_name: string = null;

  @ApiProperty()
  contact_phone: string = null;

  @ApiProperty()
  photo: string = null;

  @ApiProperty()
  addr_info: string = null;

  @ApiProperty()
  addr_city: string = null;

  @ApiProperty()
  addr_state: string = null;

  @ApiProperty()
  addr_zipcode: string = null;

  @ApiProperty()
  addr_country: string = null;

  @ApiProperty()
  active: StatusType = null;

  @ApiProperty({ default: TrialStatus.yes })
  trial: TrialStatus = null;

  @ApiProperty({})
  @Transform(TransformDate)
  trial_begin: Date = null;

  @ApiProperty({})
  @Transform(TransformDate)
  trial_end: Date = null;

  @ApiProperty({ type: ComPrjRes, isArray: true })
  @IsArray()
  @Type(() => ComPrjRes)
  projects: ComPrjRes[];

  static init(partial: Partial<CompEntity> = null): CompItemRes {
    if (partial) {
      let self = new CompItemRes();
      for (const key of Object.keys(self)) self[key] = partial[key];
      self.projects = partial.projects.map((e) => ComPrjRes.init(e));
      return self;
    } else {
      return null;
    }
  }
}
