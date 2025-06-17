import { Injectable } from "@nestjs/common";
import { MenuEntity } from "src/entities/auth/menu.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfile } from "src/partial/user.profile";
import { FormItem } from "src/form/form.item";
import { MenuItemRes } from "./res/item";
import { MenuSaveReq } from "./req/save";
import { MenuListRes } from "./res/list";

@Injectable()
export class MenuService {
  //

  constructor(@InjectRepository(MenuEntity) private menuRepo: Repository<MenuEntity>) {}

  async findAll(user: UserProfile): Promise<any> {
    let result = await this.menuRepo
      .createQueryBuilder("a")
      .leftJoinAndMapMany("a.children", MenuEntity, "b", "a.id=b.parent")
      .where({ parent: 0 })
      .orderBy({ "a.priority": "ASC", "b.priority": "ASC" })
      .getMany();
    return result.map((e) => MenuListRes.init(e));
  }

  async findOne(form: FormItem, user: UserProfile): Promise<MenuItemRes> {
    const { id } = form;
    let item = await this.menuRepo.findOneByOrFail({ id });
    return MenuItemRes.init(item);
  }

  async create(form: MenuSaveReq, user: UserProfile): Promise<boolean> {
    const { parent, url, name } = form;
    let item = new MenuEntity();
    item.parent = parent;
    item.url = url;
    item.name = name;
    item.priority = await this.maxPriority(parent);
    await this.menuRepo.save(item);
    return true;
  }

  async update(form: MenuSaveReq, user: UserProfile): Promise<boolean> {
    const { id, url, name } = form;
    let item = await this.menuRepo.findOneByOrFail({ id });
    item.url = url;
    item.name = name;
    await this.menuRepo.save(item);
    return true;
  }

  async delete(form: FormItem, user: UserProfile): Promise<boolean> {
    const { id } = form;
    await this.menuRepo.delete({ parent: id });
    await this.menuRepo.delete({ id });
    return true;
  }

  async maxPriority(parent: number): Promise<number> {
    let num = await this.menuRepo.maximum("priority", { parent });
    return num ? num + 1 : 1;
  }
}
