import { Need, InputType } from "src/enum/master";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { FormsAwsEntity } from "./forms.aws.entity";

@Entity({ name: "forms_qst" })
export class FormsQstEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  forms_id: number;

  @Column({ length: 100, default: InputType.choice, nullable: false })
  input_type: InputType;

  @Column({ length: 300, nullable: false })
  title: string;

  @Column({ length: 300 })
  detail: string;

  @Column({ default: 0, nullable: false })
  priority: number;

  @Column({ default: Need.no, nullable: false })
  required_photo: Need;

  @Column({ default: Need.no, nullable: false })
  required_note: Need;

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @Column({ default: 0 })
  updated_by: number;

  @UpdateDateColumn({ default: Date.now })
  updated_at: Date;

  @ManyToMany(() => FormsAwsEntity)
  answers: FormsAwsEntity[];
}
