import { AssmResult, AssmStatus } from "src/enum/master";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AssmFormsQstEntity } from "./assm.forms.qst.entity";
import { EqmEntity } from "../equipment/equipment.entity";
import { FormsEntity } from "../forms/forms.entity";

@Entity({ name: "assm_forms" })
export class AssmFormsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  equipment_id: number;

  @Column({ nullable: false })
  type_id: number;

  @Column({ nullable: false })
  forms_id: number;

  @Column({ default: AssmStatus.progress, nullable: false })
  status: AssmStatus;

  @Column({ nullable: false })
  status_by: number;

  @Column({ nullable: false })
  status_at: Date;

  @Column({})
  result: AssmResult;

  @Column({})
  result_by: number;

  @Column({})
  result_at: Date;

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
  equipment_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  company_id: number;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  company_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  project_id: number;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  project_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  category_id: number;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  category_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  forms_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  type_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  status_by_name: string;

  @ManyToMany(() => AssmFormsQstEntity)
  questions: AssmFormsQstEntity[];

  @OneToOne(() => EqmEntity)
  equipment: EqmEntity;

  @OneToOne(() => FormsEntity)
  forms: FormsEntity;
}
