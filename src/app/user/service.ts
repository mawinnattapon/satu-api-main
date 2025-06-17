import { Injectable } from "@nestjs/common";
import { SaveUserReq } from "./req/save";
import { ResPaging } from "src/form/res.paging";
import { FormPage, Sort } from "src/form/form.page";
import { FindOptionsWhere, In, IsNull, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FormItem } from "src/form/form.item";
import { UserListRes } from "./res/list";
import { UserItemRes } from "./res/item";
import { UserEntity } from "src/entities/auth/user.entity";
import { AppException } from "src/rest/app.error";
import { UserProfile } from "src/partial/user.profile";
import { SecureUtil } from "src/util/secure.util";
import { FormListId } from "src/form/form.list.id";
import { RoleEntity } from "src/entities/auth/role.entity";
import { RoleComp, RoleDev, RoleOwnerWeb } from "src/enum/role";
import { CountryEntity } from "src/entities/country.entity";
import { FileUtil } from "src/util/file.util";
import { parse as urlParse } from "url";
import { basename } from "path";
import { isEmpty } from "class-validator";
import { CompEntity } from "src/entities/company/company.entity";
import { FindForm } from "./req/find";

@Injectable()
export class UserService {
  dirName: string = "users";

  static sort: { [key: string]: string } = {
    created_at: "a.created_at",
    name: "a.first_name",
    email: "a.email",
    role: "a_role_name",
    active: "a.active",
  };

  constructor(
    private readonly fileUtil: FileUtil,
    private readonly secureUtil: SecureUtil,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>
  ) {}

  async findAll(form: FindForm, user: UserEntity) {
    let { keyword, company_id, per_page, page, sort_by, sort_type } = form;

    if (RoleComp.includes(user.role_level)) {
      if (isEmpty(user.company_id) || isNaN(user.company_id)) {
        throw new AppException(502, "This username is not registered under any company.");
      }
      company_id = user.company_id;
    }

    let where = `a.id<>10 and a.deleted_by is null`;
    let param: any = { k: `%${keyword}%`, company_id };

    if (keyword)
      where = `${where} and (
        b.level ilike :k 
        or b.name_short ilike :k 
        or a.first_name ilike :k 
        or a.last_name ilike :k 
        or a.email ilike :k 
      ) `;

    if (company_id) {
      where += ` and a.company_id = :company_id`;
    }

    let [result, total] = await this.userRepo
      .createQueryBuilder("a")
      .addSelect("nm(a.first_name, a.last_name)", "a_full_name")
      .addSelect("b.name_short", "a_role_name")
      .addSelect("b.level", "a_role_level")
      .leftJoin(RoleEntity, "b", "a.role_id=b.id")
      .leftJoinAndMapOne("a.company", CompEntity, "d", "d.id=a.company_id")
      .where(where, param)
      .andWhere("b.level <> :level", { level: "dev" })
      .orderBy(Sort(UserService.sort, sort_by), sort_type)
      .take(per_page)
      .skip((page - 1) * per_page)
      .getManyAndCount();

    return new ResPaging(
      total,
      result.map((e) => UserListRes.init(e))
    );
  }

  async findOne(form: FormItem, user: UserProfile): Promise<UserItemRes> {
    const { id } = form;
    const where: FindOptionsWhere<UserEntity> = { id, deleted_by: IsNull() };
    if (RoleComp.includes(user.role_level)) where.company_id = user.company_id;

    let result = await this.userRepo
      .createQueryBuilder("a")
      .addSelect("nm(a.first_name, a.last_name)", "a_full_name")
      .addSelect("b.name_short", "a_role_name")
      .addSelect("c.name_en", "a_addr_country_name")
      .leftJoin(RoleEntity, "b", "a.role_id=b.id")
      .leftJoin(CountryEntity, "c", "a.addr_country=c.code")
      .leftJoinAndMapOne("a.company", CompEntity, "d", "d.id=a.company_id")
      .where(where)
      .getOneOrFail();
    return UserItemRes.init(result);
  }

  async create(form: SaveUserReq, user: UserProfile): Promise<Number> {
    const {
      email,
      first_name,
      last_name,
      position,
      emp_no,
      mobile,
      photo,
      addr_info,
      addr_city,
      addr_state,
      addr_zipcode,
      addr_country,
      role_id,
      company_id,
      active,
      password,
      password_confirm,
    } = form;

    let cnt = await this.userRepo.countBy({ email, deleted_by: IsNull() });
    if (cnt > 0) throw new AppException(601, "This Email is already in use.");
    if (password !== password_confirm) throw new AppException(601, "Password Not Match.");

    const role = await this.roleRepo.findBy({ level: In(RoleComp) });
    if (RoleOwnerWeb.includes(user.role_level) && role.some((i) => i.id === role_id) && !company_id)
      throw new AppException(601, "Please select a company.");

    let comp_id: number = RoleComp.includes(user.role_level) ? user.company_id : company_id || null;

    let item = new UserEntity();
    item.email = email;
    item.first_name = first_name;
    item.last_name = last_name;
    item.position = position;
    item.emp_no = emp_no;
    item.mobile = mobile;
    item.photo = photo;
    item.addr_info = addr_info;
    item.addr_city = addr_city;
    item.addr_state = addr_state;
    item.addr_zipcode = addr_zipcode;
    item.addr_country = addr_country || "TH";
    item.role_id = role_id;
    item.company_id = comp_id;
    item.active = active;
    item.password = this.secureUtil.encrypt(password);
    item.created_by = user.id;
    item.created_at = new Date();
    item.updated_by = user.id;
    item.updated_at = new Date();
    item = await this.userRepo.save(item, { reload: true });
    return item.id;
  }

  async update(form: SaveUserReq, user: UserProfile): Promise<Number> {
    const {
      id,
      email,
      first_name,
      last_name,
      position,
      emp_no,
      mobile,
      photo,
      addr_info,
      addr_city,
      addr_state,
      addr_zipcode,
      addr_country,
      role_id,
      company_id,
      active,
      password,
      password_confirm,
    } = form;
    let cnt = await this.userRepo.countBy({ email, id: Not(In([id])), deleted_by: IsNull() });
    if (cnt > 0) throw new AppException(601, "This Email is already in use.");
    if (password) {
      if (password !== password_confirm) throw new AppException(601, "Password Not Match.");
    }

    const role = await this.roleRepo.findBy({ level: In(RoleComp) });
    if (RoleOwnerWeb.includes(user.role_level) && role.some((i) => i.id === role_id) && !company_id)
      throw new AppException(601, "Please select a company.");

    let comp_id: number = RoleComp.includes(user.role_level) ? user.company_id : company_id || null;

    let where: FindOptionsWhere<UserEntity> = { id, deleted_by: IsNull() };
    if (RoleComp.includes(user.role_level)) where.company_id = company_id;

    let item = await this.userRepo.findOneByOrFail(where);
    item.email = email;
    item.first_name = first_name;
    item.last_name = last_name;
    item.position = position;
    item.emp_no = emp_no;
    item.mobile = mobile;
    item.photo = photo;
    item.addr_info = addr_info;
    item.addr_city = addr_city;
    item.addr_state = addr_state;
    item.addr_zipcode = addr_zipcode;
    item.addr_country = addr_country || "TH";
    item.role_id = role_id;
    item.company_id = comp_id;
    item.active = active;
    if (password) item.password = this.secureUtil.encrypt(password);
    item.updated_by = user.id;
    item.updated_at = new Date();
    item = await this.userRepo.save(item, { reload: true });
    return item.id;
  }

  async uploadPhoto(file: any, user: UserProfile): Promise<string> {
    if (!file) throw new AppException(503, "กรุณาเลือกไฟล์เพื่ออัพโหลด");
    const item = await this.userRepo.findOneByOrFail({ id: user.id });
    const mime = this.fileUtil.getMimeFromName(file.originalname);
    if (!this.fileUtil.isImage(mime)) throw new AppException(503, "รูปแบบไฟล์ไม่ถูกต้อง");
    const size = this.fileUtil.fileSize(file.size, "MB");
    if (size > 10) throw new AppException(503, "อัพโหลดไฟล์ได้สูงสุด 10Mb");
    if (item.photo) {
      const parsedUrl = urlParse(item.photo);
      const filename = basename(parsedUrl.pathname);
      await this.fileUtil.deleteFile(filename, this.dirName);
    }
    const photo = await this.fileUtil.uploadFile(file, "", this.dirName);
    return photo;
  }

  async delete(form: FormListId, user: UserProfile): Promise<Number> {
    const { id } = form;

    let role = await this.roleRepo.findBy({ level: In(RoleDev) });

    let where: FindOptionsWhere<UserEntity> = { id: In(id), role_id: Not(In(role.map((e) => e.id))) };
    if (RoleComp.includes(user.role_level)) where.company_id = user.company_id;

    let cnt = await this.userRepo.update(where, { deleted_by: user.id, deleted_at: new Date() });
    return cnt.affected;
  }
}
