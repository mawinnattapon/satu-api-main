import { FormsEntity } from "src/entities/forms/forms.entity";
import { StatusType } from "src/enum/master";

export interface IFindReportRes {
  eqm_id: number;
  eqm_name: string;
  alt_no: string;
  model_name: string;
  brand_name: string;
  location: string;
  purchase_date: Date;
  installation_date: Date;
  created_at: Date;
  company_id: number;
  company_name: string;
  category_id: number;
  category_name: string;
  type_id: number;
  type_name: string;
  assm_id: number;
  form_id: number;
  form_name: string;
  test_date: Date;
  test_by: string;
  active: StatusType;
  passed: number[];
}

export interface IFindAll {
  forms: FormsEntity;
  data: IFindReportRes[];
}