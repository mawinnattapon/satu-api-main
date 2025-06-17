import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { UserEntity } from "src/entities/auth/user.entity";
import { RoleEntity } from "src/entities/auth/role.entity";
import { MenuEntity } from "src/entities/auth/menu.entity";
import { RoleMenuEntity } from "src/entities/auth/role.menu.entity";
import { UserProfile } from "src/partial/user.profile";
import { Platform } from "src/enum/master";
import { MenuRes } from "src/partial/menu.res";
import { AuthLoginRes } from "src/app/auth/signin/res/auth.login";
import { Config } from "src/config";
import { UserJwt } from "src/type/user";
import { SecureUtil } from "src/util/secure.util";
import { JwtService } from "@nestjs/jwt";
import { Crypt, Safe } from "src/util/enc";
import moment from "moment";
import { CompEntity } from "src/entities/company/company.entity";

@Injectable()
export class AuthenManager {
  private readonly logger = new Logger(AuthenManager.name);

  constructor(
    private readonly secureUtil: SecureUtil,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>
  ) {}

  passwordIsTrue(dbPass: string, reqPass: string) {
    return dbPass === this.secureUtil.encrypt(reqPass);
  }

  async loginSuccess(user: UserProfile, platform: Platform): Promise<AuthLoginRes> {
    const tokenType = Config.tokenType;
    const expiresIn = platform === Platform.mobile ? "1y" : Config.tokenExpire;
    const authkey: string = Safe.genKeyId();
    const data: UserJwt = {
      id: user.id,
      key: authkey,
      platform,
      role_level: user.role_level,
      company_id: [],
    };
    const token = this.jwtService.sign({ data: new Crypt().encrypt(data) }, { expiresIn });
    const decoded = this.jwtService.verify(token, { ignoreExpiration: true });
    const expire = moment(decoded.exp * 1000).toDate();

    let profile = user;

    if (platform === Platform.mobile) {
      profile = await this.newLoginMobile(user.id, authkey);
    } else {
      profile = await this.newLoginWeb(user.id, authkey);
    }

    this.logger.debug(`=> user: ${user.id}, login success, (${platform})`);
    return new AuthLoginRes({ token, expire, expiresIn, tokenType, profile });
  }

  async newLoginWeb(user_id: number, authkey: string): Promise<UserProfile> {
    await this.userRepo.update(user_id, {
      auth_web: authkey,
      last_active: new Date(),
      updated_by: user_id,
      updated_at: new Date(),
    });
    return await this.findProfileById(user_id, true);
  }

  async newLoginMobile(user_id: number, authkey: string): Promise<UserProfile> {
    await this.userRepo.update(user_id, {
      auth_mobile: authkey,
      last_active: new Date(),
      updated_by: user_id,
      updated_at: new Date(),
    });
    return await this.findProfileById(user_id, false);
  }

  async signoutWeb(user_id: number): Promise<boolean> {
    await this.userRepo.update(user_id, {
      auth_web: null,
      updated_by: user_id,
      updated_at: new Date(),
    });
    return true;
  }

  async signoutMobile(user_id: number): Promise<boolean> {
    await this.userRepo.update(user_id, {
      auth_mobile: null,
      updated_by: user_id,
      updated_at: new Date(),
    });
    return true;
  }

  async findProfileById(id: number, isMenu: boolean = false): Promise<UserProfile> {
    let result = await this.userRepo
      .createQueryBuilder("a")

      .addSelect("c.level", "a_role_level")
      .addSelect("c.name", "a_role_name")
      .addSelect("nm(a.first_name, a.last_name)", "a_full_name")

      .leftJoinAndMapOne("a.role", RoleEntity, "c", "c.id=a.role_id")
      .leftJoinAndMapOne("a.company", CompEntity, "d", "d.id=a.company_id")
      .where({ id, deleted_by: IsNull() })
      .getOne();

    if (result) {
      let menus = [];
      if (isMenu) menus = await this.getUserMenu(result.role_id);
      return UserProfile.init(result, menus);
    } else {
      return null;
    }
  }

  async findProfileByEmail(email: string, isMenu: boolean = false): Promise<UserProfile> {
    let result = await this.userRepo
      .createQueryBuilder("a")

      .addSelect("c.level", "a_role_level")
      .addSelect("c.name", "a_role_name")
      .addSelect("nm(a.first_name, a.last_name)", "a_full_name")

      .leftJoinAndMapOne("a.role", RoleEntity, "c", "c.id=a.role_id")
      .leftJoinAndMapOne("a.company", CompEntity, "d", "d.id=a.company_id")

      .where({ email, deleted_by: IsNull() })
      .getOne();

    if (result) {
      let menus = [];
      if (isMenu) menus = await this.getUserMenu(result.role_id);
      return UserProfile.init(result, menus);
    } else {
      return null;
    }
  }

  async getUserMenu(role_id: number): Promise<MenuRes[]> {
    let result = await this.roleRepo
      .createQueryBuilder("a")
      .leftJoin(RoleMenuEntity, "dd", "a.id=dd.role_id")
      .leftJoinAndMapMany("a.menus", MenuEntity, "ee", "dd.menu_id=ee.id and ee.parent=0")
      .leftJoin(RoleMenuEntity, "ddd", "a.id=ddd.role_id")
      .leftJoinAndMapMany("ee.children", MenuEntity, "eee", "ddd.menu_id=eee.id and eee.parent=ee.id")
      .where({ id: role_id })
      .orderBy({ "ee.priority": "ASC", "eee.priority": "ASC" })
      .getOneOrFail();
    return result.menus.map((e) => MenuRes.init(e));
  }
}
