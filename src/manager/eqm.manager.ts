import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EqmEntity } from "src/entities/equipment/equipment.entity";
import { EqmFormsEntity } from "src/entities/equipment/equipment.form.entity";
import { EqmPhotoEntity } from "src/entities/equipment/equipment.photo.entity";
import { IsNull, Repository } from "typeorm";
import shell from "shelljs";
import { QrNo, QrUtil } from "src/util/qr.util";
import { join } from "path";
import { Config } from "src/config";
import { FileUtil } from "src/util/file.util";

@Injectable()
export class EqmManager {
  //
  startName = "SN";

  constructor(
    private readonly fileUtil: FileUtil,
    @InjectRepository(EqmEntity) private eqmRepo: Repository<EqmEntity>,
    @InjectRepository(EqmFormsEntity) private eqmFormRepo: Repository<EqmFormsEntity>,
    @InjectRepository(EqmPhotoEntity) private eqmPhotoRepo: Repository<EqmPhotoEntity>
  ) {}

  genEqmNo = () => {
    let len: number = 12;
    let txt = "";
    const characters = "0123456789";
    for (let i = 0; i < len; i++) {
      txt += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `${this.startName}${txt}`;
  };

  clone = async (id: number, num: number, user_id: number): Promise<number> => {
    //
    const item = await this.eqmRepo.findOneByOrFail({ id, deleted_by: IsNull() });
    const photos = await this.eqmPhotoRepo.findBy({ equipment_id: id });
    const forms = await this.eqmFormRepo.findBy({ equipment_id: id });
    for (let i = 1; i <= num; i++) {
      let itm = { ...{}, ...item };

      // let name = `${item.name} no.${i}`;
      let name = `${item.name}`.trim();
      let eqm_no = this.genEqmNo();

      await QrUtil.createQrcode(itm.company_id, QrNo.eqm, eqm_no);

      itm.id = null;
      itm.name = name;
      itm.eqm_no = eqm_no;
      itm.alt_no = null;
      itm.created_by = user_id;
      itm.created_at = new Date();
      itm.updated_by = user_id;
      itm.updated_at = new Date();
      itm = await this.eqmRepo.save(itm, { reload: true });

      if (forms.length > 0) {
        await this.eqmFormRepo.save(forms.map((e) => EqmFormsEntity.create(itm.id, e.forms_id, e.type_id)));
      }

      if (photos.length > 0) {
        let urls = [];
        for (let p = 0; p < photos.length; p++) {
          const fromName = photos.at(p).url.split("/").reverse().at(0);
          const fromUri: string = join(Config.publicUri, Config.uploadUri, fromName);
          const toName = `${this.fileUtil.getUuid()}.${fromName.split(".").reverse().at(0)}`;
          const toUri: string = join(Config.publicUri, Config.uploadUri, toName);
          shell.cp("-R", fromUri, toUri);
          urls.push(`${Config.uploadUrl}/${toName}`);
        }
        await this.eqmPhotoRepo.save(urls.map((e) => EqmPhotoEntity.create(itm.id, e)));
      }
    }
    return num;
  };
}
