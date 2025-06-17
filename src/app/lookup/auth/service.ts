import { Injectable } from "@nestjs/common";
import { RoleEntity } from "src/entities/auth/role.entity";
import { UserEntity } from "src/entities/auth/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, IsNull, Repository } from "typeorm";
import { UserProfile } from "src/partial/user.profile";
import { MenuEntity } from "src/entities/auth/menu.entity";
import { RoleAll, RoleComp, RoleLevel, RoleSutu } from "src/enum/role";
import { ChildOption } from "./res/child.option";
import { RoleOption } from "./res/role.option";
import { UserOption } from "./res/user.option";

@Injectable()
export class LookupAuthService {
  //

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    @InjectRepository(MenuEntity) private menuRepo: Repository<MenuEntity>
  ) {}

  async user(user: UserProfile): Promise<UserOption[]> {
    let where: any = "a.id<>10 and a.deleted_by is null";
    let param: any = { level: RoleLevel.dev, company_id: user.company_id };

    if (user.role_level !== RoleLevel.dev) where = `${where} and b.level <> :level`;
    if (RoleComp.includes(user.role_level)) where = `${where} and a.company_id = :company_id`;

    let result = await this.userRepo
      .createQueryBuilder("a")
      .addSelect("nm(a.first_name, a.last_name)", "a_full_name")
      .leftJoin(RoleEntity, "b", "b.id=a.role_id")
      .where(where, param)
      .orderBy({ first_name: "ASC", last_name: "ASC" })
      .getMany();
    return result.map((e) => UserOption.init(e));
  }

  async member(user: UserProfile): Promise<UserOption[]> {
    let where: any = "a.id<>10 and a.deleted_by is null and b.level=:level";
    let param: any = { level: RoleLevel.member, company_id: user.company_id };

    if (RoleComp.includes(user.role_level)) where = `${where} and a.company_id = :company_id`;

    let result = await this.userRepo
      .createQueryBuilder("a")
      .addSelect("nm(a.first_name, a.last_name)", "a_full_name")
      .leftJoin(RoleEntity, "b", "b.id=a.role_id")
      .where(where, param)
      .orderBy({ first_name: "ASC", last_name: "ASC" })
      .getMany();
    return result.map((e) => UserOption.init(e));
  }

  async role(user: UserProfile): Promise<RoleOption[]> {
    let where: FindOptionsWhere<RoleEntity> = { deleted_by: IsNull() };
    switch (user.role_level) {
      case RoleLevel.dev:
        where.level = In(RoleAll);
        break;
      case RoleLevel.owner:
        where.level = In(RoleSutu);
        break;
      default:
        where.level = In(RoleComp);
        break;
    }
    const result = await this.roleRepo.find({ where, order: { id: "asc" } });
    return result.map((e) => RoleOption.init(e.id, e.name, e.level, e.detail));
  }

  async menu(user: UserProfile): Promise<ChildOption[]> {
    const result = await this.menuRepo
      .createQueryBuilder("a")
      .leftJoinAndMapMany("a.children", MenuEntity, "aa", "aa.parent=a.id")
      .where({ parent: 0 })
      .getMany();
    return result.map((e) =>
      ChildOption.init(
        e.id,
        e.name,
        e.children.map((ee) => ChildOption.init(e.id, e.name, []))
      )
    );
  }
}
