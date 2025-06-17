import { StatusType } from "src/enum/master";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  AfterLoad,
  OneToOne,
} from "typeorm";
import { EqmPhotoEntity } from "./equipment.photo.entity";
import { EqmFormsEntity } from "./equipment.form.entity";
import { QrNo, QrUtil } from "src/util/qr.util";
import { CategoryEntity } from "../forms/category.entity";
import { CompEntity } from "../company/company.entity";
import { ProjectEntity } from "../company/projects.entity";

@Entity({ name: "equipment" })
export class EqmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300, nullable: false })
  name: string;

  @Column({ length: 300, nullable: false })
  eqm_no: string;

  @Column({ length: 300 })
  alt_no: string;

  @Column({ length: 300 })
  brand_name: string;

  @Column({ length: 300 })
  model_name: string;

  @Column({ length: 300 })
  location: string;

  @Column({ length: 300 })
  detail: string;

  @Column({ nullable: false })
  category_id: number;

  @Column({ nullable: false })
  company_id: number;

  @Column({ nullable: false })
  project_id: number;

  @Column({ nullable: false })
  type_id: number;

  @Column({})
  due_range: number;

  @Column()
  due_date: Date;

  @Column()
  purchase_date: Date;

  @Column()
  installation_date: Date;

  @Column({ nullable: false })
  active: StatusType;

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @Column({ default: 0 })
  updated_by: number;

  @UpdateDateColumn({ default: Date.now })
  updated_at: Date;

  @Column({})
  deleted_by: number;

  @Column({})
  deleted_at: Date;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  type_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  company_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  project_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  category_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  eqm_qrcode: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  eqm_barcode: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  alt_qrcode: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  alt_barcode: string;

  @ManyToMany(() => EqmPhotoEntity)
  photos: EqmPhotoEntity[];

  @ManyToMany(() => EqmFormsEntity)
  forms: EqmFormsEntity[];

  @OneToOne(() => CategoryEntity)
  category: CategoryEntity;

  @OneToOne(() => CompEntity)
  company: CompEntity;

  @OneToOne(() => ProjectEntity)
  project: ProjectEntity;

  @AfterLoad()
  afterLoad() {
    if (this.eqm_no) this.eqm_qrcode = QrUtil.getQrUrl(this.company_id, QrNo.eqm, this.eqm_no);
    if (this.eqm_no) this.eqm_barcode = QrUtil.getBarUrl(this.company_id, QrNo.eqm, this.eqm_no);
    if (this.alt_no) this.alt_qrcode = QrUtil.getQrUrl(this.company_id, QrNo.alt, this.alt_no);
    if (this.alt_no) this.alt_barcode = QrUtil.getBarUrl(this.company_id, QrNo.alt, this.alt_no);
  }
}
