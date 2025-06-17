import { ApiProperty } from "@nestjs/swagger";
import { IFindReportRes } from "../type/find";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { Exclude, Transform } from "class-transformer";
import moment from "moment";
import { StatusType } from "src/enum/master";

export class RpSummaryRes {
  @ApiProperty()
  total: number = null;

  @ApiProperty()
  tested: number = null;

  @ApiProperty()
  passed: number = null;

  @ApiProperty()
  failed: number = null;

  static init(partial: Partial<IFindReportRes[]> = null): RpSummaryRes {
    if (partial) {
      let self = new RpSummaryRes();
      self.total = partial.length;
      self.tested = partial.filter(i => i.passed && i.passed?.length > 0).length;
      self.passed = partial.filter(i => i.passed && i.passed?.length > 0 && i.passed?.every(j => j === 1)).length;
      self.failed = self.tested - self.passed;
      return self;
    } else {
      return null;
    }
  }
}

class RpDataRes {

  @Exclude()
  no: number = null;

  @ApiProperty()
  eqm_id: number = null;

  @ApiProperty()
  eqm_name: string = null;

  @ApiProperty()
  alt_no: string = null;

  @ApiProperty()
  model_name: string = null;

  @ApiProperty()
  brand_name: string = null;

  @ApiProperty()
  location: string = null;

  @ApiProperty()
  purchase_date: Date | string = null;

  @ApiProperty()
  installation_date: Date | string = null;

  @ApiProperty()
  company_id: number = null;

  @ApiProperty()
  created_at: Date = null;

  @ApiProperty()
  company_name: string = null;

  @ApiProperty()
  category_id: number = null;

  @ApiProperty()
  category_name: string = null;

  @ApiProperty()
  type_id: number = null;

  @ApiProperty()
  type_name: string = null;

  @ApiProperty()
  assm_id: number = null;

  @ApiProperty()
  form_id: number = null;

  @ApiProperty()
  form_name: string = null;

  @ApiProperty()
  test_date: Date | string = null;

  @ApiProperty()
  test_by: string = null;

  @ApiProperty()
  active: StatusType | string = null;

  @ApiProperty({ type: Number, isArray: true, example: [1, 1, 1, 0, 1, 1, 1] })
  test_results: number[] | string[] = null;

  @ApiProperty({ example: 0 })
  test_pass: number | string = null;

  static init(partial: Partial<IFindReportRes> = null): RpDataRes {
    if (partial) {
      let self = new RpDataRes();
      for (const key of Object.keys(self)) self[key] = partial[key] ?? null;
      self.test_results = partial.passed ?? [];
      self.test_pass = Number(partial.passed?.every(i => i === 1));
      return self;
    } else {
      return null;
    }
  }

  static export(partial: Partial<IFindReportRes> = null, no: number): RpDataRes {
    if (partial) {
      let self = new RpDataRes();
      for (const key of Object.keys(self)) self[key] = partial[key] ?? null;
      self.no = no;
      self.test_results = partial.passed?.map(i => i === 1 ? 'Passed' : 'Not Passed') ?? [];
      self.test_pass = Number(partial.passed?.every(i => i === 1)) ? 'Passed' : 'Not Passed';
      self.active = partial.active === StatusType.active ? 'Active' : 'Inactive';

      const test_date = moment(partial.test_date ?? null);
      if (test_date.isValid()) self.test_date = test_date.format("MMMM D, YYYY - h:mm A") ?? null;

      const purchase_date = moment(partial.purchase_date ?? null);
      if (purchase_date.isValid()) self.purchase_date = purchase_date.format("MMMM D, YYYY") ?? null;

      const installation_date = moment(partial.installation_date ?? null);
      if (installation_date.isValid()) self.installation_date = installation_date.format("MMMM D, YYYY") ?? null;

      return self;
    } else {
      return null;
    }
  }
}


export class ReportRes {

  @ApiProperty()
  form_name: string = null;

  @ApiProperty({ isArray: false })
  summary: RpSummaryRes = null;

  @ApiProperty({ type: RpDataRes, isArray: true })
  data: RpDataRes[] = [];

  @ApiProperty({ type: String, isArray: true })
  qst: string[] = [];

  static init(partial: Partial<IFindReportRes[]> = null, forms: FormsEntity): ReportRes {
    if (partial) {
      let self = new ReportRes();
      self.form_name = forms?.name ?? null;
      self.summary = RpSummaryRes.init(partial) ?? null;
      self.data = partial.map(i => RpDataRes.init(i)) ?? [];
      self.qst = forms?.questions.map(i => i.title) ?? [];
      return self;
    } else {
      return null;
    }
  }

  static export(partial: Partial<IFindReportRes[]> = null, forms: FormsEntity): ReportRes {
    if (partial) {
      let self = new ReportRes();
      self.form_name = forms?.name ?? null;
      self.summary = RpSummaryRes.init(partial) ?? null;
      self.data = partial.map((v, i) => RpDataRes.export(v, i + 1)) ?? [];
      self.qst = forms?.questions.map(i => i.title) ?? [];
      return self;
    } else {
      return null;
    }
  }
}