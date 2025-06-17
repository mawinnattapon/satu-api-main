import { Injectable } from "@nestjs/common";
import { SaveFormsReq, SaveNormalReq } from "./req/save";
import { ResPaging } from "src/form/res.paging";
import { Sort } from "src/form/form.page";
import { In, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FormItem } from "src/form/form.item";
import { FormsListRes } from "./res/list";
import { FormsItemRes } from "./res/item";
import { UserProfile } from "src/partial/user.profile";
import { FormListId } from "src/form/form.list.id";
import { FormsEntity } from "src/entities/forms/forms.entity";
import { FormsQstEntity } from "src/entities/forms/forms.qst.entity";
import { FormsAwsEntity } from "src/entities/forms/forms.aws.entity";
import { CategoryEntity } from "src/entities/forms/category.entity";
import { FormsTypeEntity } from "src/entities/forms/forms.type.entity";
import { FormsFindReq } from "./req/find";
import { EqmFormsEntity } from "src/entities/equipment/equipment.form.entity";
import { AppException } from "src/rest/app.error";
import { NormalItemRes } from "./res/normal.item";

@Injectable()
export class FormsService {
  //
  static sort: { [key: string]: string } = {
    created_at: "a.created_at",
    name: "a.name",
    type_name: "b.name",
    category_name: "c.name",
  };

  constructor(
    @InjectRepository(FormsEntity) private formsRepo: Repository<FormsEntity>,
    @InjectRepository(FormsQstEntity) private qstRepo: Repository<FormsQstEntity>,
    @InjectRepository(FormsAwsEntity) private awsRepo: Repository<FormsAwsEntity>,
    @InjectRepository(EqmFormsEntity) private eqmFormsRepo: Repository<EqmFormsEntity>
  ) {}

  async findAll(form: FormsFindReq, user: UserProfile) {
    const { keyword, type_id, category_id, per_page, page, sort_by, sort_type } = form;
    let where = `1=1`;
    let param: any = { k: `%${keyword}%`, type_id, category_id };

    if (keyword) where = `${where} and a.name ilike :k `;
    if (type_id) where = `${where} and a.type_id = :type_id `;
    if (category_id) where = `${where} and a.category_id = :category_id `;

    let [result, total] = await this.formsRepo
      .createQueryBuilder("a")
      .addSelect("b.name", "b_name")
      .addSelect("c.name", "c_name")
      .addSelect("b.name", "a_type_name")
      .addSelect("c.name", "a_category_name")
      .addSelect((db) => {
        return db.select("count(aa.id)").from(FormsQstEntity, "aa").where("aa.forms_id = a.id");
      }, "a_questions_total")
      .leftJoin(FormsTypeEntity, "b", "b.id=a.type_id")
      .leftJoin(CategoryEntity, "c", "c.id=a.category_id")
      .where(where, param)
      .orderBy(Sort(FormsService.sort, sort_by), sort_type)
      .take(per_page)
      .skip((page - 1) * per_page)
      .getManyAndCount();

    return new ResPaging(
      total,
      result.map((e) => FormsListRes.init(e))
    );
  }

  async findOne(form: FormItem, user: UserProfile): Promise<FormsItemRes> {
    const { id } = form;
    let result = await this.formsRepo
      .createQueryBuilder("a")
      .addSelect("b.name", "a_type_name")
      .addSelect("c.name", "a_category_name")
      .leftJoin(FormsTypeEntity, "b", "b.id=a.type_id")
      .leftJoin(CategoryEntity, "c", "c.id=a.category_id")
      .leftJoinAndMapMany("a.questions", FormsQstEntity, "qst", "qst.forms_id=a.id")
      .leftJoinAndMapMany("qst.answers", FormsAwsEntity, "aws", "aws.forms_id=a.id and aws.forms_qst_id=qst.id")
      .where({ id })
      .orderBy({ "a.id": "ASC", "qst.priority": "ASC", "aws.priority": "ASC" })
      .getOneOrFail();
    return FormsItemRes.init(result);
  }

  async create(form: SaveFormsReq, user: UserProfile): Promise<Number> {
    const { name, detail, type_id, category_id, questions } = form;
    let item = new FormsEntity();
    item.name = name;
    item.detail = detail;
    item.type_id = type_id;
    item.category_id = category_id;
    item.created_by = user.id;
    item.updated_by = user.id;
    item = await this.formsRepo.save(item, { reload: true });
    for (const [i, question] of questions.entries()) {
      let qst = new FormsQstEntity();
      qst.forms_id = item.id;
      qst.input_type = question.input_type;
      qst.title = question.title;
      qst.detail = question.detail;
      qst.priority = i + 1;
      qst.required_photo = question.required_photo;
      qst.required_note = question.required_note;
      qst.created_by = user.id;
      qst.updated_by = user.id;
      qst = await this.qstRepo.save(qst, { reload: true });
      for (const [j, answer] of question.answers.entries()) {
        let aws = new FormsAwsEntity();
        aws.forms_id = item.id;
        aws.forms_qst_id = qst.id;
        aws.title = answer.title;
        aws.sub_title = answer.sub_title;
        aws.extra = answer.extra;
        aws.warning = answer.warning;
        aws.priority = j + 1;
        aws.created_by = user.id;
        aws.updated_by = user.id;
        aws = await this.awsRepo.save(aws, { reload: true });
      }
    }
    return item.id;
  }

  async update(form: SaveFormsReq, user: UserProfile): Promise<Number> {
    const { id, name, detail, type_id, category_id, questions } = form;
    let item = await this.formsRepo.findOneByOrFail({ id });
    item.name = name;
    item.detail = detail;
    item.type_id = type_id;
    item.category_id = category_id;
    item.updated_by = user.id;
    item = await this.formsRepo.save(item, { reload: true });

    let qId = questions.filter((e) => Boolean(e.id)).map((e) => e.id);
    await this.qstRepo.delete({ forms_id: item.id, id: Not(In([0, ...qId])) });

    for (const [i, question] of questions.entries()) {
      let qst = question.id ? await this.qstRepo.findOneBy({ id: question.id }) : null;
      if (!qst) {
        qst = new FormsQstEntity();
        qst.created_by = user.id;
      }
      qst.forms_id = item.id;
      qst.input_type = question.input_type;
      qst.title = question.title;
      qst.detail = question.detail;
      qst.priority = i + 1;
      qst.required_photo = question.required_photo;
      qst.required_note = question.required_note;
      qst.updated_by = user.id;
      qst = await this.qstRepo.save(qst, { reload: true });

      let aId = question.answers.filter((e) => Boolean(e.id)).map((e) => e.id);
      await this.awsRepo.delete({ forms_id: item.id, forms_qst_id: qst.id, id: Not(In([0, ...aId])) });

      for (const [j, answer] of question.answers.entries()) {
        let aws = answer.id ? await this.awsRepo.findOneBy({ id: answer.id }) : null;
        if (!aws) {
          aws = new FormsAwsEntity();
          aws.created_by = user.id;
        }
        aws.forms_id = item.id;
        aws.forms_qst_id = qst.id;
        aws.title = answer.title;
        aws.sub_title = answer.sub_title;
        aws.extra = answer.extra;
        aws.warning = answer.warning;
        aws.priority = j + 1;
        aws.updated_by = user.id;
        aws = await this.awsRepo.save(aws, { reload: true });
      }
    }
    return item.id;
  }

  async delete(form: FormListId, user: UserProfile): Promise<Number> {
    const { id } = form;
    const inUse = await this.eqmFormsRepo.countBy({ forms_id: In(id) });
    if (inUse > 0) throw new AppException(501, "Some Form is currently in use.");
    await this.awsRepo.delete({ forms_id: In(id) });
    await this.qstRepo.delete({ forms_id: In(id) });
    let cnt = await this.formsRepo.delete(id);
    return cnt.affected;
  }

  async normalItem(form: FormItem, user: UserProfile): Promise<NormalItemRes> {
    const { id } = form;
    let result = await this.formsRepo
      .createQueryBuilder("a")
      .addSelect("b.name", "a_type_name")
      .addSelect("c.name", "a_category_name")
      .leftJoin(FormsTypeEntity, "b", "b.id=a.type_id")
      .leftJoin(CategoryEntity, "c", "c.id=a.category_id")
      .where({ id })
      .getOneOrFail();
    return NormalItemRes.init(result);
  }

  async updateNormal(form: SaveNormalReq, user: UserProfile): Promise<Number> {
    const { id, name, detail, type_id, category_id, doc_url } = form;
    let item = await this.formsRepo.findOneByOrFail({ id });
    item.name = name;
    item.detail = detail;
    item.type_id = type_id;
    item.category_id = category_id;
    item.doc_url = doc_url;
    item.updated_by = user.id;
    item = await this.formsRepo.save(item, { reload: true });
    return item.id;
  }
}
