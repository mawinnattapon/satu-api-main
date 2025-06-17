import { Warning } from "src/enum/master";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "assm_forms_aws" })
export class AssmFormsAwsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  assm_forms_id: number;

  @Column({ nullable: false })
  assm_forms_qst_id: number;

  @Column({ nullable: false })
  equipment_id: number;

  @Column({ nullable: false })
  forms_id: number;

  @Column({ nullable: false })
  forms_qst_id: number;

  @Column({ nullable: false })
  forms_aws_id: number;

  @Column({ nullable: false })
  forms_aws_warning: Warning;

  @Column({ length: 500 })
  forms_aws_label: string;

  @Column({ type: "json" })
  forms_aws_json: any;

  @Column({ default: 0, nullable: false })
  forms_aws_checked: number;

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @Column({ default: 0 })
  updated_by: number;

  @UpdateDateColumn({ default: Date.now })
  updated_at: Date;
}
