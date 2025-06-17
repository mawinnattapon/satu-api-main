import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { AssmFormsAwsEntity } from "src/entities/assessment/assm.forms.aws.entity";
import { AssmFormsEntity } from "src/entities/assessment/assm.forms.entity";
import { AssmFormsQstEntity } from "src/entities/assessment/assm.forms.qst.entity";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { EqmFormsEntity } from "src/entities/equipment/equipment.form.entity";
import { CategoryEntity } from "src/entities/forms/category.entity";
import { FormsAwsEntity } from "src/entities/forms/forms.aws.entity";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { FormsQstEntity } from "src/entities/forms/forms.qst.entity";
import { FormsTypeEntity } from "src/entities/forms/forms.type.entity";
import { RoleLevel } from "src/enum/role";
import { EqmFormsItem } from "src/app/assm/eqm/res/eqm.forms.item";
import { UserProfile } from "src/partial/user.profile";
import { DataSource, IsNull, Not, Repository } from "typeorm";
import { EqmFormsListRes } from "src/app/assm/eqm/res/eqm.forms.list";
import { AssmStatus, InputType, SaveType, Warning } from "src/enum/master";
import { AppException } from "src/rest/app.error";
import { EqmFormsSaveReq } from "src/app/assm/eqm/req/eqm.forms.save";
import { EqmFormsSaveRes } from "src/app/assm/eqm/res/eqm.forms.save";
import { UserEntity } from "src/entities/auth/user.entity";
import { CompEntity } from "src/entities/company/company.entity";
import { MailManager } from "./mail.manager";
import { ProjectEntity } from "src/entities/company/projects.entity";
import { Config } from "src/config";
import moment from "moment";
import { Util } from "src/util/util";
import { EqmPhotoEntity } from "src/entities/equipment/equipment.photo.entity";
import { FileUtil } from "src/util/file.util";
import { isEmpty, isURL } from "class-validator";

@Injectable()
export class AssmManager {
  //
  private readonly log = new Logger(AssmManager.name);

  constructor(
    private readonly mail: MailManager,
    private readonly file: FileUtil,
    @InjectDataSource() private ds: DataSource,
    @InjectRepository(EqmEntity) private eqmRepo: Repository<EqmEntity>,
    @InjectRepository(EqmPhotoEntity) private eqmPhotoRepo: Repository<EqmPhotoEntity>,
    @InjectRepository(EqmFormsEntity) private eqmFormsRepo: Repository<EqmFormsEntity>,
    @InjectRepository(CategoryEntity) private categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(FormsTypeEntity) private formsTypeRepo: Repository<FormsTypeEntity>,
    @InjectRepository(FormsEntity) private formsRepo: Repository<FormsEntity>,
    @InjectRepository(FormsQstEntity) private formsQstRepo: Repository<FormsQstEntity>,
    @InjectRepository(FormsAwsEntity) private formsAwsRepo: Repository<FormsAwsEntity>,
    @InjectRepository(AssmFormsEntity) private assmFormsRepo: Repository<AssmFormsEntity>,
    @InjectRepository(AssmFormsQstEntity) private assmFormsQstRepo: Repository<AssmFormsQstEntity>,
    @InjectRepository(AssmFormsAwsEntity) private assmFormsAwsRepo: Repository<AssmFormsAwsEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(CompEntity) private compRepo: Repository<CompEntity>
  ) {}

  async eqmFormsList(eqm_id: number, type_id: number, user: UserProfile): Promise<EqmFormsListRes[]> {
    const { role_level, company_id } = user;
    let where = ``;
    let param = [eqm_id, type_id];
    where = `${where} and b.equipment_id  = $1`;
    where = `${where} and b.type_id  = $2`;

    if (role_level === RoleLevel.member) {
      param = [...param, company_id];
      where = `${where} and c.company_id = $3`;
    }

    let result = await this.ds.query(
      `
      select 
        aa.*, bb.id as last_id, bb.created_at as last_date, bb.result,
        (case 
          when bb.result=0 then 0 
          when bb.result=1 then null 
          else bb.status end
        ) as last_status
      from (
        select a.id, a.name, d.allow_repeat
        from forms a, equipment_forms b, equipment c, forms_type d
        where b.forms_id = a.id
        and c.id = b.equipment_id
        and d.id = a.type_id
        and c.deleted_by is null
        and c.active=1
        ${where}
      ) aa
      left join assm_forms bb on bb.forms_id = aa.id 
      and bb.id = (select max(id) from assm_forms where forms_id = aa.id and deleted_by is null and equipment_id = $1 )
      `,
      param
    );

    console.log(`[DEBUG] eqmFormsList - Raw query result count: ${result.length}`);
    const mappedResult = result.map((e: any) => EqmFormsListRes.init(e));
    console.log(`[DEBUG] eqmFormsList - Mapped result count: ${mappedResult.length}`);
    
    return mappedResult;
  }

  async loadEqmFormsMaster(eqm_id: number, forms_id: number): Promise<EqmFormsItem> {
    let forms = await this.formsRepo
      .createQueryBuilder("a")
      .innerJoin(EqmFormsEntity, "b", "b.forms_id=a.id")
      .innerJoinAndMapOne("a.forms_type", FormsTypeEntity, "c", "c.id=a.type_id")
      .leftJoinAndMapMany("a.questions", FormsQstEntity, "qst", "qst.forms_id=a.id")
      .leftJoinAndMapMany("qst.answers", FormsAwsEntity, "aws", "aws.forms_id=a.id and aws.forms_qst_id=qst.id")
      .where("b.equipment_id = :eqm_id and a.id = :forms_id", { eqm_id, forms_id })
      .orderBy({ "a.id": "ASC", "qst.priority": "ASC", "aws.priority": "ASC" })
      .getOneOrFail();
    return EqmFormsItem.init(eqm_id, forms);
  }

  async loadEqmFormsData(eqm_id: number, forms_id: number, status: AssmStatus): Promise<AssmFormsEntity> {
    let where = `a.equipment_id = :eqm_id and a.forms_id = :forms_id and a.status=:status and a.deleted_by is null`;
    let param = { eqm_id, forms_id, status };
    if (status !== null) where = `${where} and a.status=:status`;
    let forms = await this.assmFormsRepo
      .createQueryBuilder("a")
      .addSelect("nm(cd.first_name, cd.last_name)", "a_status_by_name")
      .leftJoinAndMapMany("a.questions", AssmFormsQstEntity, "qst", "qst.assm_forms_id=a.id")
      .leftJoinAndMapMany("qst.answers", AssmFormsAwsEntity, "aws", "aws.assm_forms_qst_id=qst.id")
      .leftJoin(UserEntity, "cd", "cd.id=a.status_by")
      .where(where, param)
      .getOne();
    return forms;
  }

  async eqmFormsItemById(id: number): Promise<EqmFormsItem> {
    let formData = await this.assmFormsRepo
      .createQueryBuilder("a")
      .addSelect("nm(cd.first_name, cd.last_name)", "a_status_by_name")
      .leftJoinAndMapMany("a.questions", AssmFormsQstEntity, "qst", "qst.assm_forms_id=a.id")
      .leftJoinAndMapMany("qst.answers", AssmFormsAwsEntity, "aws", "aws.assm_forms_qst_id=qst.id")
      .leftJoin(UserEntity, "cd", "cd.id=a.status_by")
      .where({ id, deleted_by: IsNull() })
      .getOneOrFail();

    let forms = await this.loadEqmFormsMaster(formData.equipment_id, formData.forms_id);
    return EqmFormsItem.prepare(forms, formData);
  }

  async eqmFormsItemByProgress(eqm_id: number, forms_id: number, user: UserProfile): Promise<EqmFormsItem> {
    const { role_level, company_id } = user;
    if (role_level === RoleLevel.member) {
      await this.eqmRepo.findOneByOrFail({ id: eqm_id, company_id });
    }
    let forms = await this.loadEqmFormsMaster(eqm_id, forms_id);

    let where = `a.equipment_id = :eqm_id and a.forms_id = :forms_id and a.status=:status and a.deleted_by is null`;
    let param = { eqm_id, forms_id, status: AssmStatus.progress };
    let formData = await this.assmFormsRepo
      .createQueryBuilder("a")
      .addSelect("nm(cd.first_name, cd.last_name)", "a_status_by_name")
      .leftJoinAndMapMany("a.questions", AssmFormsQstEntity, "qst", "qst.assm_forms_id=a.id")
      .leftJoinAndMapMany("qst.answers", AssmFormsAwsEntity, "aws", "aws.assm_forms_qst_id=qst.id")
      .leftJoin(UserEntity, "cd", "cd.id=a.status_by")
      .where(where, param)
      .getOne();
    return EqmFormsItem.prepare(forms, formData);
  }

  async eqmFormsSave(formData: EqmFormsSaveReq, user: UserProfile): Promise<EqmFormsSaveRes> {
    const { id, role_level, company_id } = user;
    const { save_type } = formData;
    this.log.debug(`eqmFormsSave => type: ${save_type}`);

    if (role_level === RoleLevel.member) {
      await this.eqmRepo.findOneByOrFail({ id: formData.equipment_id, company_id });
    }

    let forms = await this.loadEqmFormsMaster(formData.equipment_id, formData.id);

    let status = AssmStatus.progress;
    const saveForms: EqmFormsItem = EqmFormsSaveReq.prepare(forms, formData);

    let { equipment_id, assm_id, type_id, questions } = saveForms;
    let isNew = true;
    const forms_id = saveForms.id;

    if (save_type === SaveType.submit) {
      // this.validateForm(saveForms);
      status = this.getStatus(saveForms);
    }

    let assmForms: AssmFormsEntity = new AssmFormsEntity();
    if (assm_id) assmForms = await this.assmFormsRepo.findOneBy({ id: assm_id, deleted_by: IsNull() });
    if (!assmForms) assmForms = new AssmFormsEntity();
    if (assmForms.id) isNew = false;
    if (isNew) {
      assmForms.equipment_id = equipment_id;
      assmForms.forms_id = forms_id;
      assmForms.type_id = type_id;
      assmForms.created_by = id;
    }
    assmForms.status = status;
    assmForms.status_by = id;
    assmForms.status_at = new Date();
    assmForms.result = null;
    assmForms.result_by = null;
    assmForms.result_at = null;
    assmForms.updated_by = id;
    assmForms = await this.assmFormsRepo.save(assmForms, { reload: true });

    let img = null;
    for (const qst of questions) {
      let qstForms: AssmFormsQstEntity = new AssmFormsQstEntity();
      qstForms.id = qst.assm_qst_id;
      qstForms.assm_forms_id = assmForms.id;
      qstForms.equipment_id = equipment_id;
      qstForms.forms_id = forms_id;
      qstForms.forms_qst_id = qst.id;
      qstForms.forms_qst_type = qst.input_type;
      qstForms.forms_qst_note = qst.assm_qst_note;
      qstForms.forms_qst_photo = qst.assm_qst_photo;
      qstForms.updated_by = id;
      if (isNew) qstForms.created_by = id;
      qstForms = await this.assmFormsQstRepo.save(qstForms, { reload: true });

      for (const aws of qst.answers) {
        let awsForms: AssmFormsAwsEntity = new AssmFormsAwsEntity();
        awsForms.id = aws.assm_aws_id;
        awsForms.assm_forms_id = assmForms.id;
        awsForms.assm_forms_qst_id = qstForms.id;
        awsForms.equipment_id = equipment_id;
        awsForms.forms_id = forms_id;
        awsForms.forms_qst_id = qst.id;
        awsForms.forms_aws_id = aws.id;
        awsForms.forms_aws_warning = aws.warning ? Warning.yes : Warning.no;
        awsForms.forms_aws_label = aws.assm_aws_label;
        awsForms.forms_aws_json = aws.assm_aws_payload;
        awsForms.forms_aws_checked = aws.assm_aws_checked ? 1 : 0;
        awsForms.updated_by = id;
        if (isNew) awsForms.created_by = id;
        awsForms = await this.assmFormsAwsRepo.save(awsForms, { reload: true });
        if (img === null) {
          if (
            qst.required_photo &&
            qst.assm_qst_photo &&
            qst.assm_qst_photo instanceof Array &&
            qst.assm_qst_photo.length > 0
          ) {
            img = qst.assm_qst_photo.at(0);
          }
        }
        if (img === null) {
          if (aws.assm_aws_payload && aws.assm_aws_payload instanceof Array && aws.assm_aws_payload.length > 0) {
            let imgAws = aws.assm_aws_payload.at(0);
            if (this.isUrl(imgAws)) img = imgAws;
          }
        }
      }
    }
    if (save_type === SaveType.submit) {
      await this.sendAssmNotify(assmForms.id, user.id);
      await this.runFirstImage(equipment_id, img, user.id);
    }

    return EqmFormsSaveRes.init(assmForms);
  }

  validateForm(form: EqmFormsItem): boolean {
    for (const q of form.questions) {
      let valid = false;
      // if (q.required_note && q.assm_qst_note.length < 1) {
      //   throw new AppException(601, `Section '${q.title}' required note.`);
      // }
      if (q.required_photo && q.assm_qst_photo.length < 1) {
        throw new AppException(601, `Section '${q.title}' required Photo.`);
      }
      switch (q.input_type) {
        case InputType.short_text:
        case InputType.long_text:
          // valid = q.answers.filter((e) => e.assm_aws_label.length > 0).length > 0;
          valid = true;
          break;
        case InputType.dropdown:
        case InputType.choice:
          valid = q.answers.filter((e) => e.assm_aws_checked === true).length == 1;
          break;
        case InputType.checkbox:
          valid = q.answers.filter((e) => e.assm_aws_checked === true).length > 0;
          break;
        case InputType.checkboxDetail:
          valid = q.answers.filter((e) => e.assm_aws_checked === true).length > 0;
          if (valid === false) break;
          valid = !(
            q.answers.filter((e) => e.assm_aws_checked === true).filter((e) => (e.assm_aws_payload || []).length < 1)
              .length > 0
          );
          break;
        case InputType.tblMeasuring:
          for (const i of q.answers) {
            for (const key in i.assm_aws_payload) {
              if (!Array.isArray(i.assm_aws_payload[key])) continue;
              valid = i.assm_aws_payload[key].every((l: { [key: string]: any }[]) =>
                l.every((i: { [key: string]: any }) => !isEmpty(i?.["value"]))
              );
              if (!valid) break;
            }
          }
          break;
        case InputType.tblConfirm:
          for (const i of q.answers) {
            for (const key in i.assm_aws_payload) {
              if (!Array.isArray(i.assm_aws_payload[key])) continue;
              valid = i.assm_aws_payload[key].every((l: { [key: string]: any }) => !isEmpty(l?.["value"]));
              if (!valid) break;
            }
          }
          break;
      }
      if (!valid) throw new AppException(601, `Please complete the information. Section '${q.title}'.`);
    }
    return true;
  }

  getStatus(form: EqmFormsItem): AssmStatus {
    let warning: boolean[] = [];
    for (const q of form.questions) {
      let wn = false;
      switch (q.input_type) {
        case InputType.short_text:
        case InputType.long_text:
          wn = q.answers.filter((e) => e.warning).length > 0;
          break;
        case InputType.dropdown:
        case InputType.choice:
          const checkedAnswer = q.answers.find((e) => e.assm_aws_checked === true);
          wn = checkedAnswer ? checkedAnswer.warning === Warning.yes : false;
          break;
        case InputType.checkbox:
          wn = q.answers.filter((e) => e.assm_aws_checked && e.warning).length > 0;
          break;
      }
      warning.push(wn);
    }

    return warning.filter((e) => e === true).length > 0 ? AssmStatus.repair : AssmStatus.normal;
  }

  async sendAssmNotify(id: number, user_id: number): Promise<void> {
    try {
      const item = await this.assmFormsRepo
        .createQueryBuilder("a")
        .addSelect("ca.name", "a_forms_name")
        .addSelect("cb.name", "a_type_name")
        .addSelect("ba.name", "a_equipment_name")
        .addSelect("cb.name", "a_project_name")
        .leftJoin(FormsEntity, "ca", "ca.id=a.forms_id")
        .leftJoin(FormsTypeEntity, "cb", "cb.id=ca.type_id")
        .leftJoin(EqmEntity, "ba", "ba.id=a.equipment_id")
        .leftJoin(CategoryEntity, "bc", "bc.id=ba.category_id")
        .leftJoin(ProjectEntity, "pj", "pj.id=ba.project_id")
        .where({ id })
        .getOneOrFail();

      const sendby = await this.userRepo.findOneByOrFail({ id: user_id });
      if (!sendby.company_id) throw "company not found";

      const users = await this.userRepo.find({
        where: {
          company_id: sendby.company_id,
          role_id: 3,
          email: Not(IsNull()),
        },
        order: { last_active: "ASC" },
      });
      const emails = users.map((e) => e.email).filter((e) => Util.isEmail(e));
      if (emails.length < 1) throw "admin email not found";

      let subject = `(New) | ${item.type_name} : ${item.forms_name}`;
      let email = emails[0];
      let fileName = "new.assm";
      let param = {
        title: subject,
        form_name: `${item.type_name} : ${item.forms_name}`,
        send_name: sendby.full_name,
        send_date: moment().format("DD MMM YYYY, HH:mm"),
        equipment_name: item.equipment_name,
        project_name: item.project_name,
        url: `${Config.appUrl}/assm/view/${id}`,
      };
      let cc = emails.slice(1);

      await this.mail.sendEmail(subject, email, fileName, param, cc);
    } catch (error) {
      this.log.error(error, error);
    }
  }

  async runFirstImage(equipment_id: number, image: string, user_id: number): Promise<void> {
    if (image) {
      const cnt = await this.eqmPhotoRepo.countBy({ equipment_id });
      if (cnt < 1) {
        let nurl = await this.file.copyFile(image);
        if (nurl) {
          let item = EqmPhotoEntity.create(equipment_id, nurl);
          await this.eqmPhotoRepo.save(item);
        }
      }
    }
  }

  isUrl = (data: string) => {
    return /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(data);
  };
}
