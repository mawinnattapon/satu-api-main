import { Injectable } from "@nestjs/common";
import { LookupOption } from "./res/option";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindOptionsWhere, IsNull, Not, Repository } from "typeorm";
import { UserProfile } from "src/partial/user.profile";
import { CountryEntity } from "src/entities/country.entity";
import { CategoryEntity } from "src/entities/forms/category.entity";
import { CompEntity } from "src/entities/company/company.entity";
import { ProjectEntity } from "src/entities/company/projects.entity";
import { FindPrjInCompReq } from "./req/prj";
import { RoleComp } from "src/enum/role";
import { EqmTypeEntity } from "src/entities/equipment/equipment.type.entity";

@Injectable()
export class LookupMasterService {
  per_page: number = 10;
  page: number = 1;

  constructor(
    @InjectDataSource() private ds: DataSource,
    @InjectRepository(CountryEntity) private countryRepo: Repository<CountryEntity>,
    @InjectRepository(CategoryEntity) private catRepo: Repository<CategoryEntity>,
    @InjectRepository(EqmTypeEntity) private typeRepo: Repository<EqmTypeEntity>,
    @InjectRepository(CompEntity) private compRepo: Repository<CompEntity>,
    @InjectRepository(ProjectEntity) private prjRepo: Repository<ProjectEntity>
  ) {}

  async country(user: UserProfile): Promise<LookupOption<string>[]> {
    const result = await this.countryRepo.find({ order: { id: "asc" } });
    return result.map((e) => LookupOption.init<string>(e.code, e.name_en));
  }

  async category(user: UserProfile): Promise<LookupOption<number>[]> {
    const result = await this.catRepo.find({ order: { name: "asc" } });
    return result.map((e) => LookupOption.init<number>(e.id, e.name));
  }

  async type(user: UserProfile): Promise<LookupOption<number>[]> {
    const result = await this.typeRepo.find({ order: { name: "asc" } });
    return result.map((e) => LookupOption.init<number>(e.id, e.name));
  }

  async company(user: UserProfile): Promise<LookupOption<number>[]> {
    let where: FindOptionsWhere<CompEntity> = { deleted_by: IsNull(), id: Not(0) };
    if (RoleComp.includes(user.role_level)) where.id = user.company_id;
    const result = await this.compRepo.find({ where, order: { name: "asc" } });
    return result.map((e) => LookupOption.init<number>(e.id, e.name));
  }

  async project(form: FindPrjInCompReq, user: UserProfile): Promise<LookupOption<number>[]> {
    const { company_id } = form;
    let where: FindOptionsWhere<ProjectEntity> = { company_id, deleted_by: IsNull() };
    if (RoleComp.includes(user.role_level)) where.company_id = user.company_id;
    const result = await this.prjRepo.find({ where, order: { name: "asc" } });
    return result.map((e) => LookupOption.init<number>(e.id, e.name));
  }
}
