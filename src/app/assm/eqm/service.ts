import { Injectable } from "@nestjs/common";
import { In, IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfile } from "src/partial/user.profile";
import { AssmFormsEntity } from "src/entities/assessment/assm.forms.entity";
import { EqmFormFindReq } from "./req/eqm.find";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { CompEntity } from "src/entities/company/company.entity";
import { ProjectEntity } from "src/entities/company/projects.entity";
import { CategoryEntity } from "src/entities/forms/category.entity";
import { EqmPhotoEntity } from "src/entities/equipment/equipment.photo.entity";
import { EqmFindItemRes } from "./res/item";
import { RoleLevel } from "src/enum/role";
import { EqmFormsListReq } from "./req/eqm.forms.list";
import { AssmManager } from "src/manager/assm.manager";
import { EqmFormsListRes } from "src/app/assm/eqm/res/eqm.forms.list";
import { EqmFormsItem } from "src/app/assm/eqm/res/eqm.forms.item";
import { EqmFormsItemReq } from "./req/eqm.forms.item";
import { EqmFormsSaveReq } from "./req/eqm.forms.save";
import { EqmFormsSaveRes } from "./res/eqm.forms.save";
import { AllowRepeat, AssmStatus } from "src/enum/master";
import { AppException } from "src/rest/app.error";

@Injectable()
export class AssmEqmService {
  dirName: string = "users";

  static sort: { [key: string]: string } = {
    created_at: "a.created_at",
    full_name: "a.first_name",
    email: "a.email",
    role_name: "b.name",
    active: "a.active",
  };

  constructor(
    private readonly assm: AssmManager,
    @InjectRepository(EqmEntity) private eqmRepo: Repository<EqmEntity>,
    @InjectRepository(FormsEntity) private formsRepo: Repository<FormsEntity>,
    @InjectRepository(AssmFormsEntity) private assmFormsRepo: Repository<AssmFormsEntity>
  ) {}

  async eqmFind(form: EqmFormFindReq, user: UserProfile): Promise<EqmFindItemRes> {
    const { code } = form;
    const { role_level, company_id } = user;
    let where = `a.deleted_by is null and a.active=1`;
    if (role_level !== RoleLevel.dev) where = `${where} and a.company_id = :company`;
    where = `${where} and (lower(a.eqm_no)=:code or lower(a.alt_no)=:code)`;
    let param = { code: code.toLowerCase(), company: company_id };

    let result = await this.eqmRepo
      .createQueryBuilder("a")
      .addSelect("b.name", "a_company_name")
      .addSelect("bb.name", "a_project_name")
      .addSelect("c.name", "a_category_name")
      .leftJoin(CompEntity, "b", "b.id=a.company_id")
      .leftJoin(ProjectEntity, "bb", "bb.id=a.project_id")
      .leftJoin(CategoryEntity, "c", "c.id=a.category_id")
      .leftJoinAndMapMany("a.photos", EqmPhotoEntity, "d", "d.equipment_id=a.id")
      .where(where, param)
      .getOneOrFail();

    return EqmFindItemRes.init(result);
  }

  async eqmFormsList(form: EqmFormsListReq, user: UserProfile): Promise<EqmFormsListRes[]> {
    const { eqm_id, type_id } = form;
    return await this.assm.eqmFormsList(eqm_id, type_id, user);
  }

  async eqmFormsItem(form: EqmFormsItemReq, user: UserProfile): Promise<EqmFormsItem> {
    const { eqm_id, forms_id } = form;
    let forms = await this.assm.eqmFormsItemByProgress(eqm_id, forms_id, user);
    if (forms.allow_repeat === AllowRepeat.no) {
      const cntf = await this.assmFormsRepo.countBy({
        equipment_id: eqm_id,
        forms_id: forms_id,
        status: In([AssmStatus.normal, AssmStatus.repair]),
        deleted_by: IsNull(),
      });
      if (cntf > 0) throw new AppException(601, "This Form not allow to repeat.");
    }
    return forms;
  }

  async eqmFormsSave(form: EqmFormsSaveReq, user: UserProfile): Promise<EqmFormsSaveRes> {
    return await this.assm.eqmFormsSave(form, user);
  }
}
