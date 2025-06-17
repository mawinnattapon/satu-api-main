import { Injectable } from "@nestjs/common";
import { SaveProfileReq } from "./req/update.profile";
import { SecureUtil } from "src/util/secure.util";
import { UserEntity } from "src/entities/auth/user.entity";
import { In, IsNull, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "src/entities/auth/role.entity";
import { UserProfile } from "../../partial/user.profile";
import { Platform } from "src/enum/master";
import { AppException } from "src/rest/app.error";
import { FileUtil } from "src/util/file.util";
import { parse as urlParse } from "url";
import { basename } from "path";
import { UserItem } from "./res/user.item";
import { AuthenManager } from "src/manager/authen.manager";
import { CountryEntity } from "src/entities/country.entity";
import { PasswordChangeReq } from "./req/update.pass";

@Injectable()
export class ProfileService {
  dirName: string = "users";

  constructor(
    private readonly fileUtil: FileUtil,
    private readonly secureUtil: SecureUtil,
    private readonly auth: AuthenManager,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) {}

  async findProfileById(user: UserProfile): Promise<UserProfile> {
    return await this.auth.findProfileById(user.id, user.platform === Platform.web);
  }

  async findOne(user: UserProfile): Promise<UserItem> {
    const { id } = user;
    let result = await this.userRepo
      .createQueryBuilder("a")

      .addSelect("nm(a.first_name, a.last_name)", "a_full_name")
      .addSelect("b.name_short", "a_role_name")
      .addSelect("c.name_en", "a_addr_country_name")
      .leftJoin(RoleEntity, "b", "a.role_id=b.id")
      .leftJoin(CountryEntity, "c", "a.addr_country=c.code")

      .where({ id })
      .getOne();

    return UserItem.init(result);
  }

  async update(form: SaveProfileReq, user: UserProfile): Promise<boolean> {
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
      old_password,
      new_password,
      new_password_confirm,
    } = form;
    let { id } = user;
    let cnt = await this.userRepo.countBy({ email, id: Not(In([id])), deleted_by: IsNull() });
    if (cnt > 0) throw new AppException(601, "This Email is already in use.");

    let item = await this.userRepo.findOneByOrFail({ id, deleted_by: IsNull() });
    if (old_password) {
      if (!this.auth.passwordIsTrue(item.password, old_password)) {
        throw new AppException(601, "Old Password Not Match.");
      }
      if (new_password !== new_password_confirm) {
        throw new AppException(601, "New Password Not Match.");
      }
    }
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
    if (new_password) item.password = this.secureUtil.encrypt(new_password);
    item.updated_by = user.id;
    item.updated_at = new Date();
    item = await this.userRepo.save(item, { reload: true });
    return true;
  }

  async passwordChange(form: PasswordChangeReq, user: UserProfile): Promise<boolean> {
    const { old_password, new_password, new_password_confirm } = form;
    let { id } = user;

    let item = await this.userRepo.findOneByOrFail({ id, deleted_by: IsNull() });

    if (!this.auth.passwordIsTrue(item.password, old_password)) {
      throw new AppException(601, "Old Password Not Match.");
    }
    if (new_password !== new_password_confirm) {
      throw new AppException(601, "New Password Not Match.");
    }
    item.password = this.secureUtil.encrypt(new_password);
    item.updated_by = user.id;
    item.updated_at = new Date();
    item = await this.userRepo.save(item, { reload: true });
    return true;
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

  async remove(user: UserProfile): Promise<boolean> {
    let { id } = user;
    let item = await this.userRepo.findOneByOrFail({ id, deleted_by: IsNull() });
    await this.userRepo.update(item.id, { deleted_by: item.id, deleted_at: new Date() });
    return true;
  }
}
