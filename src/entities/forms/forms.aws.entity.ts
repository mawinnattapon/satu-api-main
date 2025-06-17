import { Warning } from "src/enum/master";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "forms_aws" })
export class FormsAwsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  forms_id: number;

  @Column({ nullable: false })
  forms_qst_id: number;

  @Column({ length: 300, nullable: false })
  title: string;

  @Column({ length: 1000 })
  sub_title: string;

  @Column({ type: "json" })
  extra: any;

  @Column({ default: Warning.no, nullable: false })
  warning: Warning;

  @Column({ default: 0, nullable: false })
  priority: number;

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @Column({ default: 0 })
  updated_by: number;

  @UpdateDateColumn({ default: Date.now })
  updated_at: Date;
}
