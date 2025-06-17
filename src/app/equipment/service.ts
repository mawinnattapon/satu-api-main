import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { SaveEqmReq } from "./req/save";
import { ResPaging } from "src/form/res.paging";
import { Sort } from "src/form/form.page";
import { DataSource, In, IsNull, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { FormItem } from "src/form/form.item";
import { EqmListRes } from "./res/list";
import { EqmItemRes } from "./res/item";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { UserProfile } from "src/partial/user.profile";
import { FormListId } from "src/form/form.list.id";
import { ProjectEntity } from "src/entities/company/projects.entity";
import { EqmFormsEntity } from "src/entities/equipment/equipment.form.entity";
import { EqmPhotoEntity } from "src/entities/equipment/equipment.photo.entity";
import { EqmActiveListIdReq } from "./req/active";
import { CloneItemReq } from "./req/clone";
import { QrNo, QrUtil } from "src/util/qr.util";
import { EqmManager } from "src/manager/eqm.manager";
import { EqmFindReq } from "./req/find";
import { CompEntity } from "src/entities/company/company.entity";
import { CategoryEntity } from "src/entities/forms/category.entity";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { FormsTypeEntity } from "src/entities/forms/forms.type.entity";
import { AppException } from "src/rest/app.error";
import moment from "moment";
import { RoleComp, RoleLevel, RoleOwnerWeb, RoleSutu } from "src/enum/role";
import { isEmpty, isNotEmpty } from "class-validator";
import { EqmTypeEntity } from "src/entities/equipment/equipment.type.entity";
import { UploadEqmReq, UploadFailReq } from "./req/import";
import { v4 as uuidv4 } from "uuid";
import { FileUtil } from "src/util/file.util";
import { ImportMovementEntity } from "src/entities/import.movement.entity";
import { FileImportStatus, FileImportStatusName, SourceImport } from "src/enum/master";
import { SearchUploadReq } from "./req/search";
import { UserEntity } from "src/entities/auth/user.entity";
import { RoleEntity } from "src/entities/auth/role.entity";
import { ImportMovemontListRes } from "./res/list.import";
import { EqmTestDateReq } from "./req/test.date";
import { EqmTestDateRes } from "./res/test.date";
import { ServiceManager } from "src/manager/service.manager";
import { ImportEqmTempEntity } from "src/entities/import.eqm.temp.entity";
import { ImportFailMsg, Master } from "./res/item.upload.fail";

@Injectable()
export class EqmService {
  private readonly logger = new Logger(EqmService.name);
  //
  static sort: { [key: string]: string } = {
    created_at: "a.created_at",
    purchase_date: "a.purchase_date",
    code: "a.code",
    name: "a.name",
    active: "a.active",
  };

  static sort_upload: { [key: string]: string } = {
    created_at: "a.created_at",
    company: "d.name",
    status: "a.status",
    created_name: "b.first_name",
  };

  constructor(
    private readonly fileUtil: FileUtil,
    private readonly service: ServiceManager,
    private readonly manager: EqmManager,
    @InjectDataSource() private ds: DataSource,
    @InjectRepository(EqmEntity) private eqmRepo: Repository<EqmEntity>,
    @InjectRepository(EqmFormsEntity) private eqmFormRepo: Repository<EqmFormsEntity>,
    @InjectRepository(EqmPhotoEntity) private eqmPhotoRepo: Repository<EqmPhotoEntity>,
    @InjectRepository(CompEntity) private compRepo: Repository<CompEntity>,
    @InjectRepository(ImportMovementEntity) private importRepo: Repository<ImportMovementEntity>,
    @InjectRepository(ImportEqmTempEntity) private tempRepo: Repository<ImportEqmTempEntity>
  ) {}

  async findAll(form: EqmFindReq, user: UserProfile) {
    const {
      keyword,
      category_id,
      company_id,
      active,
      purchase_date_start,
      purchase_date_end,
      installation_date_start,
      installation_date_end,
      per_page,
      page,
      sort_by,
      sort_type,
    } = form;

    let where = `b.id<>0 and a.deleted_by is null`;
    let param: { [key: string]: any } = { k: `%${keyword}%`, category_id, company_id, active };

    if (keyword) {
      where = `${where} and (a.name ilike :k 
      or a.eqm_no ilike :k 
      or a.alt_no ilike :k 
      or a.model_name ilike :k 
      ) `;
    }

    if (RoleOwnerWeb.includes(user.role_level)) {
      if (company_id) where = `${where} and a.company_id = :company_id`;
    } else if (RoleComp.includes(user.role_level)) {
      if (isEmpty(user.company_id) || isNaN(user.company_id))
        throw new AppException(502, "This username is not registered under any company.");
      where += ` and a.company_id = :company_id`;
      param.company_id = user.company_id;
    }
    if (category_id) where = `${where} and a.category_id = :category_id`;
    if (active !== null) where = `${where} and a.active = :active`;
    if (purchase_date_start && purchase_date_end) {
      where = `${where} and cast(to_char(a.purchase_date, 'YYYYMMDDHH24MI') as int8) between :pstart_date and :pend_date`;
      param.pstart_date = parseInt(moment(purchase_date_start).startOf("d").format("YYYYMMDDHHmm"));
      param.pend_date = parseInt(moment(purchase_date_end).endOf("d").format("YYYYMMDDHHmm"));
    }
    if (installation_date_start && installation_date_end) {
      where = `${where} and cast(to_char(a.installation_date, 'YYYYMMDDHH24MI') as int8) between :istart_date and :iend_date`;
      param.istart_date = parseInt(moment(installation_date_start).startOf("d").format("YYYYMMDDHHmm"));
      param.iend_date = parseInt(moment(installation_date_end).endOf("d").format("YYYYMMDDHHmm"));
    }

    let [result, total] = await this.eqmRepo
      .createQueryBuilder("a")
      .addSelect("b.name", "a_company_name")
      .addSelect("c.name", "a_category_name")
      .addSelect("d.name", "a_type_name")
      .leftJoin(CompEntity, "b", "b.id=a.company_id")
      .leftJoin(CategoryEntity, "c", "c.id=a.category_id")
      .leftJoin(EqmTypeEntity, "d", "d.id=a.type_id")
      .where(where, param)
      .orderBy(Sort(EqmService.sort, sort_by), sort_type)
      .take(per_page)
      .skip((page - 1) * per_page)
      .getManyAndCount();

    return new ResPaging(
      total,
      result.map((e) => EqmListRes.init(e))
    );
  }

  async findOne(form: FormItem, user: UserProfile): Promise<EqmItemRes> {
    const { id } = form;
    const where: { [key: string]: unknown } = { id, deleted_by: IsNull() };
    if (RoleComp.includes(user.role_level)) where.company_id = user.company_id;

    let result = await this.eqmRepo
      .createQueryBuilder("a")
      .addSelect("b.name", "a_company_name")
      .addSelect("bb.name", "a_project_name")
      .addSelect("c.name", "a_category_name")
      .addSelect("cc.name", "a_type_name")
      .addSelect("f.name", "e_type_name")
      .leftJoin(CompEntity, "b", "b.id=a.company_id")
      .leftJoin(ProjectEntity, "bb", "bb.id=a.project_id")
      .leftJoin(CategoryEntity, "c", "c.id=a.category_id")
      .leftJoin(EqmTypeEntity, "cc", "cc.id=a.type_id")
      .leftJoinAndMapMany("a.photos", EqmPhotoEntity, "d", "d.equipment_id=a.id")
      .leftJoin(EqmFormsEntity, "ee", "ee.equipment_id=a.id")
      .leftJoinAndMapMany("a.forms", FormsEntity, "e", "e.id=ee.forms_id")
      .leftJoin(FormsTypeEntity, "f", "f.id=ee.type_id")
      .where(where)
      .orderBy({ "e.test_cycle": "ASC", "e.id": "ASC" })
      .getOneOrFail();
    return EqmItemRes.init(result);
  }

  async create(form: SaveEqmReq, user: UserProfile): Promise<Number> {
    let {
      name,
      alt_no,
      model_name,
      brand_name,
      location,
      detail,
      category_id,
      type_id,
      company_id,
      project_id,
      purchase_date,
      installation_date,
      active,
      photos,
      forms,
    } = form;

    if (RoleComp.includes(user.role_level)) company_id = user.company_id;
    if (!company_id) throw new AppException(404, "Please select a company.");

    let eqm_no = this.manager.genEqmNo();

    await QrUtil.createQrcode(company_id, QrNo.eqm, eqm_no);
    if (alt_no) await QrUtil.createQrcode(company_id, QrNo.alt, alt_no);

    let item = new EqmEntity();
    item.name = name;
    item.eqm_no = eqm_no;
    item.alt_no = alt_no;
    item.model_name = model_name;
    item.brand_name = brand_name;
    item.location = location;
    item.detail = detail;
    item.category_id = category_id;
    item.type_id = type_id;
    item.company_id = company_id;
    item.project_id = project_id;
    item.purchase_date = purchase_date;
    item.installation_date = installation_date;
    item.active = active;
    item.created_by = user.id;
    item.created_at = new Date();
    item.updated_by = user.id;
    item.updated_at = new Date();
    item = await this.eqmRepo.save(item, { reload: true });

    if (photos.length > 0) {
      await this.eqmPhotoRepo.save(photos.map((e) => EqmPhotoEntity.create(item.id, e)));
    }
    if (forms.length > 0) {
      await this.eqmFormRepo.save(forms.map((e) => EqmFormsEntity.create(item.id, e.id, e.type_id)));
    }
    return item.id;
  }

  async update(form: SaveEqmReq, user: UserProfile): Promise<Number> {
    const {
      id,
      name,
      alt_no,
      model_name,
      brand_name,
      location,
      detail,
      category_id,
      type_id,
      company_id,
      project_id,
      purchase_date,
      installation_date,
      active,
      photos,
      forms,
    } = form;

    const where: { [key: string]: unknown } = { id, deleted_by: IsNull() };

    if (RoleComp.includes(user.role_level)) where.company_id = user.company_id;
    if (!company_id) throw new AppException(404, "Please select a company.");

    let item = await this.eqmRepo.findOneByOrFail(where);

    await QrUtil.deleteFile(item.company_id, QrNo.eqm, item.eqm_no);
    await QrUtil.deleteFile(item.company_id, QrNo.alt, item.alt_no);

    item.name = name;
    item.alt_no = alt_no;
    item.model_name = model_name;
    item.brand_name = brand_name;
    item.location = location;
    item.detail = detail;
    item.category_id = category_id;
    item.company_id = company_id;
    item.type_id = type_id;
    item.project_id = project_id;
    item.purchase_date = purchase_date;
    item.installation_date = installation_date;
    item.active = active;
    item.active = active;
    item.updated_by = user.id;
    item.updated_at = new Date();
    item = await this.eqmRepo.save(item, { reload: true });

    await QrUtil.createQrcode(item.company_id, QrNo.eqm, item.eqm_no);
    if (item.alt_no) {
      await QrUtil.createQrcode(company_id, QrNo.alt, alt_no);
    }

    await this.eqmPhotoRepo.delete({ equipment_id: item.id });
    if (photos.length > 0) {
      await this.eqmPhotoRepo.save(photos.map((e) => EqmPhotoEntity.create(item.id, e)));
    }

    await this.eqmFormRepo.delete({ equipment_id: item.id });
    if (forms.length > 0) {
      await this.eqmFormRepo.save(forms.map((e) => EqmFormsEntity.create(item.id, e.id, e.type_id)));
    }

    return item.id;
  }

  async delete(form: FormListId, user: UserProfile): Promise<Number> {
    const { id } = form;
    const where: { [key: string]: unknown } = { id: In(id) };
    if (RoleComp.includes(user.role_level)) where.company_id = user.company_id;

    let cnt = await this.eqmRepo.update(where, { deleted_by: user.id, deleted_at: new Date() });
    return cnt.affected;
  }

  async active(form: EqmActiveListIdReq, user: UserProfile): Promise<Number> {
    const { id, active } = form;
    const where: { [key: string]: unknown } = { id: In(id) };
    if (RoleComp.includes(user.role_level)) where.company_id = user.company_id;
    let cnt = await this.eqmRepo.update(where, { active, updated_by: user.id, updated_at: new Date() });
    return cnt.affected;
  }

  async clone(form: CloneItemReq, user: UserProfile): Promise<Number> {
    const { id, num } = form;
    if (num > 200) throw new AppException(400, "Maximum clone item is 200.");

    const where: { [key: string]: unknown } = { id, deleted_by: IsNull() };

    if (RoleComp.includes(user.role_level)) where.company_id = user.company_id;

    await this.eqmRepo.findOneByOrFail(where);

    return await this.manager.clone(id, num, user.id);
  }

  async uploadFind(form: SearchUploadReq, user: UserProfile) {
    let { keyword, per_page, page, sort_by, sort_type, id, status, start_date, end_date } = form;
    if (RoleComp.includes(user.role_level)) id = user.company_id;

    const param: { [key: string]: any } = {
      k: `%${keyword?.trim().toLocaleLowerCase()}%`,
      i: id,
      s: [],
      r: [],
      sd: null,
      ed: end_date,
      source: SourceImport.import_eqm,
      uid: user.id,
    };

    let where = `a.source = :source and a.deleted_by is null `;
    if (isNotEmpty(id)) where += ` and a.comp_id = :i `;
    if (isNotEmpty(keyword?.trim())) {
      let comp = ``;
      if (!RoleComp.includes(user.role_level)) comp = ` or lower(trim(d.name)) like :k `;
      where = `${where} and (lower(trim(b.first_name)) like :k or lower(trim(b.last_name)) like :k ${comp}) `;
    }
    if (status) {
      switch (status) {
        case FileImportStatusName.failed:
          param.s = [FileImportStatus.failed];
          break;
        case FileImportStatusName.completed:
          param.s = [FileImportStatus.completed];
          break;
        case FileImportStatusName.pending:
          param.s = [FileImportStatus.pending];
          break;
        case FileImportStatusName.processing:
          param.s = [FileImportStatus.processing, FileImportStatus.read_file];
          break;
        case FileImportStatusName.validate:
          param.s = [
            FileImportStatus.validate_data,
            FileImportStatus.validate_db,
            FileImportStatus.validate_dupl,
            FileImportStatus.save_temp,
            FileImportStatus.save,
          ];
          break;
      }
      if (param.s.length > 0) where = `${where} and a.status in (:...s) `;
    }

    if (RoleComp.includes(user.role_level)) {
      switch (user.role_level) {
        case RoleLevel.admin:
          param.r = RoleComp;
          where = `${where} and c.level in(:...r) `;
          break;
        case RoleLevel.member:
          where = `${where} and a.created_by = :uid `;
          break;
      }
    }

    const sd = moment(start_date);
    const ed = moment(end_date);
    if (sd.isValid() && ed.isValid()) {
      param.sd = parseInt(sd.format("YYYYMMDD"));
      param.ed = parseInt(ed.format("YYYYMMDD"));
      where = `${where} and cast(to_char(a.created_at, 'YYYYMMDD') as int4) between :sd and :ed `;
    }

    let [result, total] = await this.importRepo
      .createQueryBuilder("a")
      .select("a")
      .addSelect(
        `case
          when a.status = ${FileImportStatus.failed} then '${FileImportStatusName.failed.toLowerCase()}'
          when a.status = ${FileImportStatus.completed} then '${FileImportStatusName.completed.toLowerCase()}'
          when a.status = ${FileImportStatus.pending} then '${FileImportStatusName.pending.toLowerCase()}'
          when a.status in (${FileImportStatus.processing},${
          FileImportStatus.read_file
        }) then '${FileImportStatusName.processing.toLowerCase()}'
          when a.status in (${FileImportStatus.validate_data},${FileImportStatus.validate_dupl},${
          FileImportStatus.validate_db
        },${FileImportStatus.save_temp},${FileImportStatus.save}) then '${FileImportStatusName.validate.toLowerCase()}'
          else null
        end as a_status_name`
      )
      .addSelect(user.role_level === RoleLevel.member ? "" : "nm(b.first_name, b.last_name) as a_created_name")
      .addSelect([`b.first_name`, `d.name`, `d.name as a_comp_name`])
      .leftJoin(UserEntity, "b", "b.id = a.created_by")
      .leftJoin(RoleEntity, "c", "c.id = b.role_id")
      .leftJoin(CompEntity, "d", "d.id = a.comp_id")
      .where(where, param)
      .orderBy(Sort(EqmService.sort_upload, sort_by), sort_type)
      .take(per_page)
      .skip((page - 1) * per_page)
      .getManyAndCount();

    return new ResPaging(
      total,
      result.map((e) => ImportMovemontListRes.init(e))
    );
  }

  async deleteUpload(form: FormListId, user: UserProfile): Promise<Number> {
    const { id } = form;
    const where: { [key: string]: unknown } = { id: In(id) };
    if (RoleComp.includes(user.role_level)) where.comp_id = user.company_id;

    let cnt = await this.importRepo.update(where, { deleted_by: user.id, deleted_at: new Date() });
    return cnt.affected;
  }

  async uploadFile(user: UserProfile, file: Express.Multer.File, form: UploadEqmReq) {
    const sessionId: string = uuidv4().split("-").join("");
    let { comp_id } = form;

    if (RoleComp.includes(user.role_level)) comp_id = user.company_id;

    if (!file) {
      this.logger.error(`[import_eqm][session = ${sessionId}] No uploaded file found.`);
      throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Please select a file to upload.");
    }

    if (isEmpty(comp_id)) {
      this.logger.error(`[import_eqm][session = ${sessionId}] company id is empty.`);
      throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Please enter the company.");
    }

    this.logger.log(`[import_eqm][session = ${sessionId}] Importing data.`);

    const mime = this.fileUtil.getMimeFromName(file.originalname);
    if (!["xls", "xlsx"].includes(mime.toLowerCase())) {
      this.logger.error(`[import_eqm][session = ${sessionId}] The system does not support .${mime} files.`);
      throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Incorrect file type.");
    }

    const size = this.fileUtil.fileSize(file.size, "MB");
    if (size > 10) {
      this.logger.error(
        `[import_eqm][session = ${sessionId}] The file you are trying to upload is ${size}MB in size, which exceeds the limit. Please check and try uploading a file that is no larger than 10MB.`
      );
      throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "The maximum upload size is 10 MB.");
    }
    if (!file.buffer || file.buffer.length === 0) {
      this.logger.error(`[import_eqm][session = ${sessionId}] No data in the file`);
      throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, `No data in the file`);
    }

    const comp = await this.compRepo.findOneBy({ id: comp_id });
    if (!comp) {
      this.logger.error(`[import_eqm][session = ${sessionId}] The company cannot be found.`);
      throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, `The company cannot be found.`);
    }

    await this.fileUtil.uploadImport(file, sessionId);

    const movement = new ImportMovementEntity();
    movement.comp_id = comp.id;
    movement.url = `${sessionId}.${mime}`;
    movement.created_by = user.id;
    movement.session = sessionId;
    movement.source = SourceImport.import_eqm;
    movement.status = FileImportStatus.pending;
    await this.importRepo.save(movement);

    const req = {
      session: sessionId,
      file_path: movement.url,
      comp_id: comp.id,
      create_by: user.id,
    };

    const res = await this.service.importEqm(req);
    if (res && res.code !== HttpStatus.OK) {
      this.logger.error(`[import_eqm][session = ${sessionId}] Error: ${res.message}`);
      const item: ImportMovementEntity = await this.importRepo.findOneBy({ session: sessionId });
      item.status = FileImportStatus.failed;
      await this.importRepo.save(item);
      throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "An error occurred during data import.");
    } else {
      return true;
    }
  }

  async uploadFail(form: UploadFailReq, user: UserProfile) {
    const { session } = form;
    const param = { s: session, d: moment().subtract(1, "month").toDate() };
    let where = "a.session = :s and json_array_length(a.validate) > 0 and a.created_at >= :d";
    const items = await this.tempRepo
      .createQueryBuilder("a")
      .select("a")
      .where(where, param)
      .orderBy({ "a.line": "ASC" })
      .getMany();
    let master: Master = new Master();
    if (items.length > 0) {
      // master.category = await this.categoryRepo.find({ take: 5 });
      // master.eqm_type = await this.typeRepo.find({ take: 5 });
    } else {
      // const { created_at } = await this.importRepo.findOneOrFail({ where: { session } });
      // const isDate = moment(created_at).isAfter(moment().subtract(1, 'months'));
      // if (isDate) {
      //   throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Data is not found");
      // } else {
      //   throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Data can be viewed retrospectively for no more than 1 month.");
      // }

      throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Data is not found");
    }

    const message: { [key: string]: string } = {
      "100": "File not found",
      "102": "No data in the file",
      "104": "The data has not been saved.",
      "200": `Error at [%name]: '%data' Please enter data with a maximum length of characters.`,
      "210": "Error at [%name]: Please enter data.",
      "300": "No data available for categories.",
      "400": "No data available for type.",
      "410": "No matching type data found in the categories.",
      "420": "Please ensure that you enter data for both the categories and type fields.",
      "500": `Duplicate data found within the file at [%name]: '%data' Please enter new data and try again.`,
      "600": `Data already in use at [%name]: '%data' Please enter new data and try again.`,
    };

    return items.map((e) => ImportFailMsg.init(e, message, master));
  }

  async testDate(form: EqmTestDateReq, user: UserProfile): Promise<EqmTestDateRes[]> {
    const { id, forms_id } = form;
    if (!forms_id || forms_id.length < 1) return [];

    let param = [id, ...forms_id];
    let paramArg = forms_id.map((e, i) => "$" + (i + 2)).join(",");
    let result = await this.ds.query(
      `
      select 
        aa.*,
        (case 
          when aa.latest_test_date is null then null
          else (aa.latest_test_date + (aa.test_cycle::text || ' month')::interval)::date::timestamp end
        ) as next_test_date
      from (
        select 
          a.id, a.test_cycle, a.name,
          (
            select x.result_at from assm_forms x where x.forms_id = a.id and x.result=1
            and x.id = (select max(id) from assm_forms where forms_id = a.id and result=1 and equipment_id = $1)
          ) as latest_test_date
        from forms a
        where a.id in (${paramArg})
        and a.type_id  = 2
        and a.test_cycle is not null
      ) aa
      order by aa.test_cycle
      `,
      param
    );

    return result.map((e: any) => EqmTestDateRes.init(e));
  }
}
