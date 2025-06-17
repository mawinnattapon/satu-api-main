import { Injectable } from "@nestjs/common";
import { SaveCompReq } from "./req/save";
import { ResPaging } from "src/form/res.paging";
import { FormPage, Sort } from "src/form/form.page";
import { In, IsNull, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FormItem } from "src/form/form.item";
import { CompListRes } from "./res/list";
import { CompItemRes } from "./res/item";
import { CompEntity } from "src/entities/company/company.entity";
import { UserProfile } from "src/partial/user.profile";
import { FormListId } from "src/form/form.list.id";
import { ProjectEntity } from "src/entities/company/projects.entity";
import { SaveCompQuickReq } from "./req/save.quick";
import { CountryEntity } from "src/entities/country.entity";
import { SaveCompPrjQuickReq } from "./req/save.prj.quick";
import { RoleComp, RoleLevel } from "src/enum/role";
import { UserEntity } from "src/entities/auth/user.entity";
import moment from "moment";
import { TrialStatus } from "src/enum/master";

@Injectable()
export class CompService {
  //
  static sort: { [key: string]: string } = {
    created_at: "a.created_at",
    code: "a.code",
    name: "a.name",
    active: "a.active",
  };

  constructor(
    @InjectRepository(CompEntity) private compRepo: Repository<CompEntity>,
    @InjectRepository(ProjectEntity) private prjRepo: Repository<ProjectEntity>
  ) {}

  async findAll(form: FormPage, user: UserProfile) {
    const { keyword, per_page, page, sort_by, sort_type } = form;
    let where = `a.id<>0 and a.deleted_by is null`;
    let param: { [key: string]: unknown } = { k: `%${keyword}%` };

    if (keyword)
      where = `${where} and (a.code ilike :k 
      or a.name ilike :k 
      or a.email ilike :k 
      or a.contact_name ilike :k 
      ) `;

    if (RoleComp.includes(user.role_level)) {
      where += ` and a.id = :company_id`;
      param.company_id = user.company_id;
    }

    let [result, total] = await this.compRepo
      .createQueryBuilder("a")
      .addSelect(
        "address_full(a.addr_info, a.addr_city, a.addr_state, a.addr_zipcode, a.addr_country)",
        "a_address_full"
      )
      .addSelect((db) => {
        return db.select("count(aa.id)").from(UserEntity, "aa").where("aa.company_id = a.id");
      }, "a_member_total")
      .where(where, param)
      .orderBy(Sort(CompService.sort, sort_by), sort_type)
      .take(per_page)
      .skip((page - 1) * per_page)
      .getManyAndCount();

    return new ResPaging(
      total,
      result.map((e) => CompListRes.init(e))
    );
  }

  async findOne(form: FormItem, user: UserProfile): Promise<CompItemRes> {
    const { id } = form;
    const where: { [key: string]: unknown } = { id, deleted_by: IsNull() };
    if (RoleComp.includes(user.role_level)) where.id = user.company_id;
    let result = await this.compRepo
      .createQueryBuilder("a")
      .addSelect(
        "address_full(a.addr_info, a.addr_city, a.addr_state, a.addr_zipcode, a.addr_country)",
        "a_address_full"
      )
      .addSelect("e.name_en", "a_addr_country_name")
      .leftJoinAndMapMany("a.projects", ProjectEntity, "d", "a.id=d.company_id and d.deleted_by is null")
      .leftJoin(CountryEntity, "e", "a.addr_country=e.code")
      .where(where)
      .orderBy({ "d.name": "ASC" })
      .getOneOrFail();
    return CompItemRes.init(result);
  }

  async create(form: SaveCompReq, user: UserProfile): Promise<Number> {
    const {
      code,
      name,
      email,
      contact_name,
      contact_phone,
      photo,
      addr_info,
      addr_city,
      addr_state,
      addr_zipcode,
      addr_country,
      active,
      projects,
      trial,
      trial_begin,
      trial_end,
    } = form;

    let item = new CompEntity();
    item.code = code;
    item.name = name;
    item.email = email;
    item.contact_name = contact_name;
    item.contact_phone = contact_phone;
    item.photo = photo;
    item.addr_info = addr_info;
    item.addr_city = addr_city;
    item.addr_state = addr_state;
    item.addr_zipcode = addr_zipcode;
    item.addr_country = addr_country || "TH";
    item.active = active;
    item.trial = trial;
    item.trial_begin = trial === TrialStatus.yes ? trial_begin : null;
    item.trial_end = trial === TrialStatus.yes ? trial_end : null;
    item.trial_begin = trial_begin;
    item.trial_end = trial_end;
    item.created_by = user.id;
    item.created_at = new Date();
    item.updated_by = user.id;
    item.updated_at = new Date();
    item = await this.compRepo.save(item, { reload: true });

    if (projects.length > 0) {
      await this.prjRepo.save(
        projects.map((e) => {
          let prj = new ProjectEntity();
          prj.name = e.name;
          prj.detail = e.detail;
          prj.company_id = item.id;
          prj.created_by = user.id;
          prj.created_at = new Date();
          prj.updated_by = user.id;
          prj.updated_at = new Date();
          return prj;
        })
      );
    }
    return item.id;
  }

  async update(form: SaveCompReq, user: UserProfile): Promise<Number> {
    let {
      id,
      code,
      name,
      email,
      contact_name,
      contact_phone,
      photo,
      addr_info,
      addr_city,
      addr_state,
      addr_zipcode,
      addr_country,
      active,
      projects,
      trial,
      trial_begin,
      trial_end,
    } = form;

    const isComp = RoleComp.includes(user.role_level);
    if (isComp) id = user.company_id;

    let item = await this.compRepo.findOneByOrFail({ id, deleted_by: IsNull() });
    item.code = code;
    item.name = name;
    item.email = email;
    item.contact_name = contact_name;
    item.contact_phone = contact_phone;
    item.photo = photo;
    item.addr_info = addr_info;
    item.addr_city = addr_city;
    item.addr_state = addr_state;
    item.addr_zipcode = addr_zipcode;
    item.addr_country = addr_country || "TH";
    item.active = active;
    item.updated_by = user.id;
    item.updated_at = new Date();
    if (!isComp) {
      item.trial = trial;
      item.trial_begin = trial === TrialStatus.yes ? trial_begin : null;
      item.trial_end = trial === TrialStatus.yes ? trial_end : null;
    }
    item = await this.compRepo.save(item, { reload: true });

    let pjId = projects.filter((e) => Boolean(e.id)).map((e) => e.id);
    await this.prjRepo.update({ id: Not(In([0, ...pjId])) }, { deleted_by: user.id, deleted_at: new Date() });

    if (projects.length > 0) {
      let lsProject: ProjectEntity[] = [];
      for (const prj of projects) {
        const { id, name, detail } = prj;
        let project = new ProjectEntity();
        if (Boolean(id)) project = await this.prjRepo.findOneBy({ id, company_id: item.id });
        if (!project) project = new ProjectEntity();
        if (!project.id) {
          project.company_id = item.id;
          project.created_by = user.id;
          project.created_at = new Date();
        }
        project.name = name;
        project.detail = detail;
        project.updated_by = user.id;
        project.updated_at = new Date();
        lsProject.push(project);
      }
      await this.prjRepo.save(lsProject);
    }

    return item.id;
  }

  async createQuick(form: SaveCompQuickReq, user: UserProfile): Promise<number> {
    const { company_name } = form;
    let comp = new CompEntity();
    comp.name = company_name;
    comp.trial = 1;
    comp.trial_begin = moment().toDate();
    comp.trial_end = moment().add(30, "d").toDate();
    comp.created_by = user.id;
    comp.created_at = new Date();
    comp.updated_by = user.id;
    comp.updated_at = new Date();
    comp = await this.compRepo.save(comp, { reload: true });
    return comp.id;
  }

  async createPrjQuick(form: SaveCompPrjQuickReq, user: UserProfile): Promise<number> {
    let { company_id, project_name } = form;
    if (RoleComp.includes(user.role_level)) company_id = user.company_id;
    let comp = await this.compRepo.findOneByOrFail({ id: company_id });
    let prj = new ProjectEntity();
    prj.name = project_name;
    prj.company_id = comp.id;
    prj.created_by = user.id;
    prj.created_at = new Date();
    prj.updated_by = user.id;
    prj.updated_at = new Date();
    prj = await this.prjRepo.save(prj, { reload: true });
    return prj.id;
  }

  async delete(form: FormListId, user: UserProfile): Promise<Number> {
    const { id } = form;
    let cnt = await this.compRepo.update({ id: In(id) }, { deleted_by: user.id, deleted_at: new Date() });
    return cnt.affected;
  }
}
