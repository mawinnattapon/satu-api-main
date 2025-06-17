import { Injectable } from "@nestjs/common";
import { SaveRoleReq } from "./req/save";
import { ResPaging } from "src/form/res.paging";
import { FormPage, Sort } from "src/form/form.page";
import { IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FormItem } from "src/form/form.item";
import { RoleListRes } from "./res/list";
import { RoleItemRes } from "./res/item";
import { UserEntity } from "src/entities/auth/user.entity";
import { RoleEntity } from "src/entities/auth/role.entity";
import { RoleMenuEntity } from "src/entities/auth/role.menu.entity";
import { UserProfile } from "src/partial/user.profile";

@Injectable()
export class RoleService {
  static sort: { [key: string]: string } = {
    created_at: "a.created_at",
    updated_at: "a.updated_at",
    name: "a.name",
    name_short: "a.name_short",
    level: "a.level",
  };

  constructor(
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    @InjectRepository(RoleMenuEntity) private roleMenuRepo: Repository<RoleMenuEntity>
  ) {}

  async findAll(form: FormPage, user: UserProfile) {
    const { keyword, per_page, page, sort_by, sort_type } = form;
    let where = `a.deleted_by is null`;
    let param: any = { k: `%${keyword}%` };

    if (keyword) where = `${where} and (a.level ilike :k or a.name ilike :k or a.name_short ilike :k ) `;

    let [result, total] = await this.roleRepo
      .createQueryBuilder("a")
      .where(where, param)
      .orderBy(Sort(RoleService.sort, sort_by), sort_type)
      .take(per_page)
      .skip((page - 1) * per_page)
      .getManyAndCount();

    return new ResPaging(
      total,
      result.map((e) => RoleListRes.init(e))
    );
  }

  async findOne(form: FormItem, user: UserProfile): Promise<RoleItemRes> {
    const { id } = form;
    let result = await this.roleRepo.createQueryBuilder("a").where({ id, deleted_by: IsNull() }).getOneOrFail();
    let menu = await this.roleMenuRepo.findBy({ role_id: result.id });
    return RoleItemRes.init(
      result,
      menu.map((e) => e.menu_id)
    );
  }

  async update(form: SaveRoleReq, user: UserProfile): Promise<Number> {
    const { id, name, name_short, detail, menu } = form;
    let item = await this.roleRepo.findOneByOrFail({ id, deleted_by: IsNull() });
    item.name = name;
    item.name_short = name_short;
    item.detail = detail;
    item.updated_by = user.id;
    item.updated_at = new Date();
    item = await this.roleRepo.save(item, { reload: true });
    await this.roleMenuRepo.delete({ role_id: item.id });
    if (menu.length > 0) await this.roleMenuRepo.save(menu.map((menu_id) => RoleMenuEntity.create(item.id, menu_id)));
    return id;
  }
}
