import { Injectable } from "@nestjs/common";
import { LookupOption } from "../master/res/option";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UserProfile } from "src/partial/user.profile";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { FormsTypeEntity } from "src/entities/forms/forms.type.entity";
import { FormsOptReq } from "./req/forms";
import { FormItem } from "src/form/form.item";
import { EqmTypeEntity } from "src/entities/equipment/equipment.type.entity";

@Injectable()
export class LookupFormsService {
  per_page: number = 10;
  page: number = 1;

  constructor(
    @InjectDataSource() private ds: DataSource,
    @InjectRepository(EqmTypeEntity) private eqmTypeRepo: Repository<EqmTypeEntity>,
    @InjectRepository(FormsEntity) private formsRepo: Repository<FormsEntity>,
    @InjectRepository(FormsTypeEntity) private formTypeRepo: Repository<FormsTypeEntity>
  ) {}

  async forms(form: FormsOptReq, user: UserProfile): Promise<LookupOption<number>[]> {
    const { category_id, type_id } = form;
    let where: any = {};
    if (category_id) where.category_id = category_id;
    if (type_id) where.type_id = type_id;
    const result = await this.formsRepo.find({ where, order: { test_cycle: "asc", id: "asc" } });
    return result.map((e) => LookupOption.init<number>(e.id, e.name));
  }

  async formType(user: UserProfile): Promise<LookupOption<number>[]> {
    const result = await this.formTypeRepo.find({ order: { id: "asc" } });
    return result.map((e) => LookupOption.init<number>(e.id, e.name));
  }

  async eqmType(form: FormItem, user: UserProfile): Promise<LookupOption<number>[]> {
    const result = await this.eqmTypeRepo.find({ where: { category_id: form.id }, order: { id: "asc" } });
    return result.map((e) => LookupOption.init<number>(e.id, e.name));
  }
}
