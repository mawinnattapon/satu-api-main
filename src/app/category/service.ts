import { Injectable } from "@nestjs/common";
import { SaveCategoryReq } from "./req/save";
import { ResPaging } from "src/form/res.paging";
import { FormPage, Sort } from "src/form/form.page";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FormItem } from "src/form/form.item";
import { CategoryListRes } from "./res/list";
import { CategoryItemRes } from "./res/item";
import { UserProfile } from "src/partial/user.profile";
import { FormListId } from "src/form/form.list.id";
import { CategoryEntity } from "src/entities/forms/category.entity";
import { AppException } from "src/rest/app.error";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { FormsEntity } from "src/entities/forms/forms.entity";

@Injectable()
export class CategoryService {
  //
  static sort: { [key: string]: string } = {
    created_at: "a.created_at",
    name: "a.name",
  };

  constructor(
    @InjectRepository(CategoryEntity) private catRepo: Repository<CategoryEntity>,
    @InjectRepository(FormsEntity) private formsRepo: Repository<FormsEntity>,
    @InjectRepository(EqmEntity) private eqmRepo: Repository<EqmEntity>
  ) {}

  async findAll(form: FormPage, user: UserProfile) {
    const { keyword, per_page, page, sort_by, sort_type } = form;
    let where = `1=1`;
    let param: any = { k: `%${keyword}%` };

    if (keyword) where = `${where} and (a.name ilike :k) `;

    let [result, total] = await this.catRepo
      .createQueryBuilder("a")
      .where(where, param)
      .orderBy(Sort(CategoryService.sort, sort_by), sort_type)
      .take(per_page)
      .skip((page - 1) * per_page)
      .getManyAndCount();

    return new ResPaging(
      total,
      result.map((e) => CategoryListRes.init(e))
    );
  }

  async findOne(form: FormItem, user: UserProfile): Promise<CategoryItemRes> {
    const { id } = form;
    let result = await this.catRepo.createQueryBuilder("a").where({ id }).getOneOrFail();
    return CategoryItemRes.init(result);
  }

  async create(form: SaveCategoryReq, user: UserProfile): Promise<Number> {
    const { name, detail } = form;
    let item = new CategoryEntity();
    item.name = name;
    item.detail = detail;
    item.created_by = user.id;
    item.created_at = new Date();
    item.updated_by = user.id;
    item.updated_at = new Date();
    item = await this.catRepo.save(item, { reload: true });

    return item.id;
  }

  async update(form: SaveCategoryReq, user: UserProfile): Promise<Number> {
    const { id, name, detail } = form;
    let item = await this.catRepo.findOneByOrFail({ id });
    item.name = name;
    item.detail = detail;
    item.updated_by = user.id;
    item.updated_at = new Date();
    item = await this.catRepo.save(item, { reload: true });
    return item.id;
  }

  async delete(form: FormListId, user: UserProfile): Promise<Number> {
    const { id } = form;
    const eqmUse = await this.eqmRepo.countBy({ category_id: In(id) });
    if (eqmUse > 0) throw new AppException(501, "Some Equipment is currently in use.");
    const fmUse = await this.formsRepo.countBy({ category_id: In(id) });
    if (fmUse > 0) throw new AppException(501, "Some Forms is currently in use.");
    let cnt = await this.catRepo.delete(id);
    return cnt.affected;
  }
}
