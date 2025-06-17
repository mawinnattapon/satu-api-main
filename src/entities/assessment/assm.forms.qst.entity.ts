import { InputType } from "src/enum/master";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AssmFormsAwsEntity } from "./assm.forms.aws.entity";

@Entity({ name: "assm_forms_qst" })
export class AssmFormsQstEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  equipment_id: number;

  @Column({ nullable: false })
  assm_forms_id: number;

  @Column({ nullable: false })
  forms_id: number;

  @Column({ nullable: false })
  forms_qst_id: number;

  @Column({ length: 100, default: InputType.choice, nullable: false })
  forms_qst_type: InputType;

  @Column({ length: 1000 })
  forms_qst_note: string;

  @Column({ type: "json" })
  forms_qst_photo: string[];

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @Column({ default: 0 })
  updated_by: number;

  @UpdateDateColumn({ default: Date.now })
  updated_at: Date;

  @ManyToMany(() => AssmFormsAwsEntity)
  answers: AssmFormsAwsEntity[];
}
