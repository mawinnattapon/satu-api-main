import { Injectable } from "@nestjs/common";
import { ResPaging } from "src/form/res.paging";
import { Sort } from "src/form/form.page";
import { In, IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FormItem } from "src/form/form.item";
import { DashListRes } from "./res/list";
import { DashItemRes } from "./res/item";
import { UserProfile } from "src/partial/user.profile";
import { FormListId } from "src/form/form.list.id";
import { DashFormPage } from "./req/find";
import { UserEntity } from "src/entities/auth/user.entity";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { AssmFormsEntity } from "src/entities/assessment/assm.forms.entity";
import { AssmManager } from "src/manager/assm.manager";
import { CompEntity } from "src/entities/company/company.entity";
import { CategoryEntity } from "src/entities/forms/category.entity";
import { FormsTypeEntity } from "src/entities/forms/forms.type.entity";
import moment from "moment";
import { AssmResult, AssmStatus } from "src/enum/master";
import { ProjectEntity } from "src/entities/company/projects.entity";
import { EqmPhotoEntity } from "src/entities/equipment/equipment.photo.entity";
import { RoleComp, RoleOwnerWeb } from "src/enum/role";
import { isEmpty } from "class-validator";
import { AppException } from "src/rest/app.error";

@Injectable()
export class DashService {
  //
  static sort: { [key: string]: string } = {
    status_at: "a.status_at",
    status: "a.status",
    type_name: "cb.name",
    forms_name: "ca.name",
    equipment_name: "ba.name",
  };

  constructor(
    private readonly assm: AssmManager,
    @InjectRepository(EqmEntity) private eqmRepo: Repository<EqmEntity>,
    @InjectRepository(FormsEntity) private formsRepo: Repository<FormsEntity>,
    @InjectRepository(AssmFormsEntity) private assmFormsRepo: Repository<AssmFormsEntity>
  ) {}

  async findAll(form: DashFormPage, user: UserProfile) {
    const { keyword, start_date, end_date, type_id, company_id, per_page, page, sort_by, sort_type } = form;
    let where = `bb.id<>0 and a.deleted_by is null`;
    where = `${where} and ba.deleted_by is null `;
    let param: any = {
      k: `%${keyword}%`,
      start_date: parseInt(moment(start_date).startOf("d").format("YYYYMMDDHHmm")),
      end_date: parseInt(moment(end_date).endOf("d").format("YYYYMMDDHHmm")),
      type_id,
      company_id,
    };

    if (keyword) where = `${where} and (ba.name ilike :k or ca.name ilike :k or bb.name ilike :k ) `;
    if (RoleOwnerWeb.includes(user.role_level)) {
      if (company_id) where = `${where} and ba.company_id = :company_id`;
    } else if (RoleComp.includes(user.role_level)) {
      if (isEmpty(user.company_id) || isNaN(user.company_id))
        throw new AppException(502, "This username is not registered under any company.");
      where += ` and ba.company_id = :company_id`;
      param.company_id = user.company_id;
    }
    if (type_id) where = `${where} and ca.type_id = :type_id`;
    if (start_date && end_date) {
      where = `${where} and cast(to_char(a.status_at, 'YYYYMMDDHH24MI') as int8) between :start_date and :end_date`;
    }

    let [result, total] = await this.assmFormsRepo
      .createQueryBuilder("a")
      .addSelect("ba.name", "ba_name")
      .addSelect("ba.name", "a_equipment_name")
      .addSelect("bb.id", "a_company_id")
      .addSelect("bb.name", "a_company_name")
      .addSelect("bc.id", "a_category_id")
      .addSelect("bc.name", "a_category_name")
      .addSelect("ca.name", "ca_name")
      .addSelect("ca.name", "a_forms_name")
      .addSelect("cb.name", "cb_name")
      .addSelect("cb.name", "a_type_name")
      .addSelect("nm(cd.first_name, cd.last_name)", "a_status_by_name")

      .leftJoin(EqmEntity, "ba", "ba.id=a.equipment_id")
      .leftJoin(CompEntity, "bb", "bb.id=ba.company_id")
      .leftJoin(CategoryEntity, "bc", "bc.id=ba.category_id")

      .leftJoin(FormsEntity, "ca", "ca.id=a.forms_id")
      .leftJoin(FormsTypeEntity, "cb", "cb.id=ca.type_id")

      .leftJoin(UserEntity, "cd", "cd.id=a.status_by")

      .where(where, param)
      .orderBy(Sort(DashService.sort, sort_by), sort_type)
      .take(per_page)
      .skip((page - 1) * per_page)
      .getManyAndCount();

    return new ResPaging(
      total,
      result.map((e) => DashListRes.init(e))
    );
  }

  async findOne(form: FormItem, user: UserProfile): Promise<DashItemRes> {
    const { id } = form;

    let forms = await this.assm.eqmFormsItemById(id);
    const where: { [key: string]: unknown } = { id: forms.equipment_id, deleted_by: IsNull() };
    if (RoleComp.includes(user.role_level)) where.company_id = user.company_id;

    let eqm = await this.eqmRepo
      .createQueryBuilder("a")
      .addSelect("b.name", "a_company_name")
      .addSelect("bb.name", "a_project_name")
      .addSelect("c.name", "a_category_name")
      .leftJoin(CompEntity, "b", "b.id=a.company_id")
      .leftJoin(ProjectEntity, "bb", "bb.id=a.project_id")
      .leftJoin(CategoryEntity, "c", "c.id=a.category_id")
      .leftJoinAndMapMany("a.photos", EqmPhotoEntity, "d", "d.equipment_id=a.id")
      .where(where)
      .getOneOrFail();

    return DashItemRes.init(eqm, forms);
  }

  async approve(form: FormListId, user: UserProfile): Promise<Number> {
    const { id } = form;
    let upd = await this.assmFormsRepo.update(
      { id: In(id), status: In([AssmStatus.repair, AssmStatus.normal]) },
      { result: AssmResult.approved, result_by: user.id, result_at: new Date() }
    );
    return upd.affected;
  }

  async reject(form: FormListId, user: UserProfile): Promise<Number> {
    const { id } = form;
    let upd = await this.assmFormsRepo.update(
      { id: In(id), status: In([AssmStatus.repair, AssmStatus.normal]) },
      { status: AssmStatus.progress, result: AssmResult.reject, result_by: user.id, result_at: new Date() }
    );
    return upd.affected;
  }

  async delete(form: FormListId, user: UserProfile): Promise<Number> {
    const { id } = form;
    let upd = await this.assmFormsRepo.update({ id: In(id) }, { deleted_by: user.id, deleted_at: new Date() });
    return upd.affected;
  }
}
