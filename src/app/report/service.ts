import { Injectable, Logger } from "@nestjs/common";
import { ReportFindReq } from "./req/find";
import { UserProfile } from "src/partial/user.profile";
import { ReportRes } from "./res/report";
import { DataSource, QueryRunner } from "typeorm";
import { AppException } from "src/rest/app.error";
import moment from "moment";
import { isNotEmpty } from "class-validator";
import { IFindAll, IFindReportRes } from "./type/find";
import { FormsQstEntity } from "src/entities/forms/forms.qst.entity";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { ExportRpMt } from "src/export/report/maintenance";
import { FileUtil } from "src/util/file.util";
import { InputType } from "src/enum/master";
import { RoleComp } from "src/enum/role";

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(private readonly ds: DataSource, private readonly fileUtil: FileUtil) {}

  async findAll(form: ReportFindReq, user: UserProfile) {
    const { form_id } = form;
    const { data, forms } = await (form_id
      ? this.queryFindWithForm(form, user)
      : this.queryFindWithOutForm(form, user));
    return ReportRes.init(data, forms);
  }

  async export(form: ReportFindReq, user: UserProfile) {
    const { form_id } = form;
    const { data, forms } = await (form_id
      ? this.queryFindWithForm(form, user)
      : this.queryFindWithOutForm(form, user));
    const result = ReportRes.export(data, forms);
    const rp_export = new ExportRpMt(result, form);
    const base = await rp_export.export();
    return await this.fileUtil.exportBase64(base, "csv");
  }

  private async queryFindWithForm(form: ReportFindReq, user: UserProfile): Promise<IFindAll> {
    let {
      keyword,
      form_id,
      created_start,
      created_end,
      company_id,
      active,
      purchase_date_start,
      purchase_date_end,
      installation_date_start,
      installation_date_end,
      category_id,
      type_id,
      sort_by: sort_key,
      sort_type,
    } = form;

    if(RoleComp.includes(user.role_level)) company_id = user.company_id;

    const query: QueryRunner = this.ds.createQueryRunner();
    try {
      await query.connect();
      await query.startTransaction();

      const param = [];
      let where = ` 1=1 `;
      let order_by = ``;

      const sort_cols = {
        created_at: "x.created_at",
        eqm_name: "x.eqm_name",
        alt_no: "x.alt_no",
        model_name: "x.model_name",
        brand_name: "x.brand_name",
        category_name: "x.category_name",
        type_name: "x.type_name",
        location: "x.location",
        purchase_date: "x.purchase_date",
        installation_date: "x.installation_date",
        test_date: "x.test_date",
        test_by: "x.test_by",
        form_name: "x.form_name",
        active: "x.active",
      };
      const sort_by = sort_cols?.[sort_key] ?? null;

      if (isNotEmpty(sort_by) && isNotEmpty(sort_type)) {
        order_by = ` order by ${sort_by} ${sort_type} `;
      }

      if (isNotEmpty(keyword)) {
        param.push(`%${keyword}%`);
        where += ` and (x.eqm_name ilike $${param.length}
        or x.alt_no ilike $${param.length}
        or x.model_name ilike $${param.length}
        ) `;
      }

      if (isNotEmpty(company_id)) {
        param.push(company_id);
        where += ` and (x.company_id = $${param.length})`;
      }

      if (isNotEmpty(category_id)) {
        param.push(category_id);
        where += ` and (x.category_id = $${param.length})`;
      }

      if (isNotEmpty(type_id)) {
        param.push(type_id);
        where += ` and (x.type_id = $${param.length})`;
      }

      if (isNotEmpty(active)) {
        param.push(active);
        where += ` and (x.active = $${param.length})`;
      }

      const createdStart = moment(created_start ?? null);
      const createdEnd = moment(created_end ?? null);
      if (createdStart.isValid() && createdEnd.isValid()) {
        if (createdStart?.isAfter(createdEnd))
          throw new AppException(400, "The start date cannot be after end date. Please choose a new start date.");
        where += ` and (cast(to_char(x.test_date, 'YYYYMMDD') as int4) between $${param.length + 1} and $${
          param.length + 2
        }) `;
        param.push(parseInt(createdStart.format("YYYYMMDD")), parseInt(createdEnd.format("YYYYMMDD")));
      }

      const purchaseDateStart = moment(purchase_date_start ?? null);
      const purchaseDateEnd = moment(purchase_date_end ?? null);
      if (purchaseDateStart.isValid() && purchaseDateEnd.isValid()) {
        if (purchaseDateStart?.isAfter(purchaseDateEnd))
          throw new AppException(400, "The start date cannot be after end date. Please choose a new start date.");
        where += ` and (cast(to_char(x.purchase_date, 'YYYYMMDD') as int4) between $${param.length + 1} and $${
          param.length + 2
        }) `;
        param.push(parseInt(purchaseDateStart.format("YYYYMMDD")), parseInt(purchaseDateEnd.format("YYYYMMDD")));
      }

      const installationDateStart = moment(installation_date_start ?? null);
      const installationDateEnd = moment(installation_date_end ?? null);
      if (installationDateStart.isValid() && installationDateEnd.isValid()) {
        if (installationDateStart?.isAfter(installationDateEnd))
          throw new AppException(400, "The start date cannot be after end date. Please choose a new start date.");
        where += ` and (cast(to_char(x.installation_date, 'YYYYMMDD') as int4) between $${param.length + 1} and $${
          param.length + 2
        }) `;
        param.push(
          parseInt(installationDateStart.format("YYYYMMDD")),
          parseInt(installationDateEnd.format("YYYYMMDD"))
        );
      }

      let forms: FormsEntity;
      param.push(form_id);
      where += ` and (x.form_id = $${param.length}) `;

      forms = await query.manager
        .getRepository(FormsEntity)
        .createQueryBuilder("a")
        .where("a.id = :i and b.input_type = :t", { i: form_id, t: InputType.choice })
        .leftJoinAndMapMany("a.questions", FormsQstEntity, "b", "b.forms_id = a.id")
        .select(["a.name", "b.id", "b.title"])
        .orderBy("b.priority", "ASC")
        .getOne();

      const sql = `
        with assm_fm as(
          select 
            af.id,
            af.forms_id,
            af.equipment_id as eqm_id,
            afq.id as qst_id,
            afa.id as aws_id,
            (
              CASE
                WHEN afa.forms_aws_warning=1 THEN 0
                WHEN afa.forms_aws_warning=0 THEN 1
                else null
              END
            ) AS passed,
            fq.title as title,
            af.created_by,
            af.created_at
          from assm_forms          as af
          left join equipment      as e   on af.equipment_id = e.id and e.type_id = 2 and e.deleted_by is null
          left join assm_forms_qst as afq on afq.assm_forms_id = af.id AND afq.forms_qst_type = 'choice'
          left join assm_forms_aws as afa on afa.assm_forms_id = af.id and afa.assm_forms_qst_id = afq.id and afa.forms_aws_checked=1
          left join forms_qst      as fq  on fq.forms_id = af.forms_id and fq.id = afa.forms_qst_id
          where af.status in (1,2)
          order by af.id asc, af.forms_id asc, fq.priority asc
        )
        select 
          x.eqm_id, x.eqm_name, x.alt_no, x.model_name, x.brand_name, x.location, x.purchase_date , x.installation_date, x.created_at, x.active,
          x.company_id, x.company_name, x.category_id, x.category_name, x.type_id, x.type_name, x.assm_id, x.form_id, x.form_name, x.test_date, x.test_by,
          (array_agg(x.passed) filter (where x.passed is not null)) as passed
        from (
          SELECT 
            e.id as eqm_id,
            e.name as eqm_name,
            e.alt_no,
            e.model_name,
            e.brand_name,
            e.location,
            e.purchase_date,
            e.installation_date,
            e.created_at,
            e.company_id,
            e.active,
            cm.name as company_name,
            cat.id as category_id,
            cat.name as category_name,
            ft.id as type_id,
            ft.name as type_name,
            af.id as assm_id,
            fm.id as form_id,
            fm.name as form_name,
            fq.priority as qst_priority,
            fa.priority as aws_priority,
            af.created_at as test_date,
            nm(us.first_name, us.last_name) as test_by,
            af.passed
          FROM equipment as e 
          left join category       as cat on cat.id = e.category_id
          left join equipment_type as ft  on ft.id = e.type_id
          left join assm_fm        as af  on af.eqm_id = e.id
          left join users          as us  on us.id = af.created_by
          left join forms          as fm  on fm.id = af.forms_id
          left join forms_qst      as fq  on fq.id = af.qst_id
          left join forms_aws      as fa  on fa.id = af.aws_id
          left join company       as cm  on cm.id = e.company_id and cm.deleted_by is null
          where e.deleted_by is null and cm.id <> 0
          order by eqm_id, form_id, qst_priority, aws_priority
        ) x
        where ${where}
        group by 
        x.eqm_id, x.eqm_name, x.alt_no, x.model_name, x.brand_name, x.location, x.purchase_date , x.installation_date, x.company_id, x.active, x.created_at,
        x.company_name, x.category_id, x.category_name, x.type_id, x.type_name, x.assm_id, x.form_id, x.form_name, x.test_date, x.test_by
        ${order_by}
      `;
      const result: IFindReportRes[] = await query.manager.query(sql, param);

      await query.commitTransaction();
      return { data: result, forms };
    } catch (error) {
      const message = `An error occurred within the system. Please try again or contact the relevant personnel. We apologize for any inconvenience.`;
      this.logger.error(message);
      this.logger.error(error instanceof Error ? error.message : error);
      await query.rollbackTransaction();
      throw new AppException(400, message);
    } finally {
      await query.release();
    }
  }

  private async queryFindWithOutForm(form: ReportFindReq, user: UserProfile): Promise<IFindAll> {
    let {
      keyword,
      company_id,
      active,
      purchase_date_start,
      purchase_date_end,
      installation_date_start,
      installation_date_end,
      category_id,
      type_id,
      sort_by: sort_key,
      sort_type,
    } = form;

    if(RoleComp.includes(user.role_level)) company_id = user.company_id;

    const query: QueryRunner = this.ds.createQueryRunner();
    try {
      await query.connect();
      await query.startTransaction();

      const param = [];
      let where = ` 1=1 `;
      let order_by = ``;

      const sort_cols = {
        created_at: "x.created_at",
        eqm_name: "x.eqm_name",
        alt_no: "x.alt_no",
        model_name: "x.model_name",
        brand_name: "x.brand_name",
        category_name: "x.category_name",
        type_name: "x.type_name",
        location: "x.location",
        purchase_date: "x.purchase_date",
        installation_date: "x.installation_date",
        test_date: "x.test_date",
        test_by: "x.test_by",
        form_name: "x.form_name",
        active: "x.active",
      };
      const sort_by = sort_cols?.[sort_key] ?? null;

      if (isNotEmpty(sort_by) && isNotEmpty(sort_type)) {
        order_by = ` order by ${sort_by} ${sort_type} `;
      }

      if (isNotEmpty(keyword)) {
        param.push(`%${keyword}%`);
        where += ` and (x.eqm_name ilike $${param.length}
        or x.alt_no ilike $${param.length}
        or x.model_name ilike $${param.length}
        ) `;
      }

      if (isNotEmpty(company_id)) {
        param.push(company_id);
        where += ` and (x.company_id = $${param.length})`;
      }

      if (isNotEmpty(category_id)) {
        param.push(category_id);
        where += ` and (x.category_id = $${param.length})`;
      }

      if (isNotEmpty(type_id)) {
        param.push(type_id);
        where += ` and (x.type_id = $${param.length})`;
      }

      if (isNotEmpty(active)) {
        param.push(active);
        where += ` and (x.active = $${param.length})`;
      }

      const purchaseDateStart = moment(purchase_date_start ?? null);
      const purchaseDateEnd = moment(purchase_date_end ?? null);
      if (purchaseDateStart.isValid() && purchaseDateEnd.isValid()) {
        if (purchaseDateStart?.isAfter(purchaseDateEnd))
          throw new AppException(400, "The start date cannot be after end date. Please choose a new start date.");
        where += ` and (cast(to_char(x.purchase_date, 'YYYYMMDD') as int4) between $${param.length + 1} and $${
          param.length + 2
        }) `;
        param.push(parseInt(purchaseDateStart.format("YYYYMMDD")), parseInt(purchaseDateEnd.format("YYYYMMDD")));
      }

      const installationDateStart = moment(installation_date_start ?? null);
      const installationDateEnd = moment(installation_date_end ?? null);
      if (installationDateStart.isValid() && installationDateEnd.isValid()) {
        if (installationDateStart?.isAfter(installationDateEnd))
          throw new AppException(400, "The start date cannot be after end date. Please choose a new start date.");
        where += ` and (cast(to_char(x.installation_date, 'YYYYMMDD') as int4) between $${param.length + 1} and $${
          param.length + 2
        }) `;
        param.push(
          parseInt(installationDateStart.format("YYYYMMDD")),
          parseInt(installationDateEnd.format("YYYYMMDD"))
        );
      }

      const sql = `
        select 
          x.eqm_id, x.eqm_name, x.alt_no, x.model_name, x.brand_name, x.location, x.purchase_date , x.installation_date, x.created_at, x.active,
          x.company_id, x.company_name, x.category_id, x.category_name, x.type_id, x.type_name, x.assm_id, x.form_id, x.form_name, x.test_date, x.test_by,
          (array_agg(x.passed) filter (where x.passed is not null)) as passed
        from (
          SELECT 
            e.id as eqm_id,
            e.name as eqm_name,
            e.alt_no,
            e.model_name,
            e.brand_name,
            e.location,
            e.purchase_date,
            e.installation_date,
            e.created_at,
            e.company_id,
            e.active,
            cm.name as company_name,
            cat.id as category_id,
            cat.name as category_name,
            ft.id as type_id,
            ft.name as type_name,
            null as assm_id,
            null as form_id,
            null as form_name,
            null as qst_priority,
            null as aws_priority,
            null as test_date,
            null as test_by,
            null as passed
          FROM equipment as e 
          left join category       as cat on cat.id = e.category_id
          left join equipment_type as ft  on ft.id = e.type_id
          left join company       as cm  on cm.id = e.company_id and cm.deleted_by is null
          where e.deleted_by is null and cm.id <> 0
          order by eqm_id
        ) x
        where ${where}
        group by 
        x.eqm_id, x.eqm_name, x.alt_no, x.model_name, x.brand_name, x.location, x.purchase_date , x.installation_date, x.company_id, x.active, x.created_at,
        x.company_name, x.category_id, x.category_name, x.type_id, x.type_name, x.assm_id, x.form_id, x.form_name, x.test_date, x.test_by
        ${order_by}
      `;
      const result: IFindReportRes[] = await query.manager.query(sql, param);
      await query.commitTransaction();
      return { data: result, forms: null };
    } catch (error) {
      const message = `An error occurred within the system. Please try again or contact the relevant personnel. We apologize for any inconvenience.`;
      this.logger.error(message);
      this.logger.error(error instanceof Error ? error.message : error);
      await query.rollbackTransaction();
      throw new AppException(400, message);
    } finally {
      await query.release();
    }
  }
}
