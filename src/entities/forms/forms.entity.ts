import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToMany,
} from "typeorm";
import { FormsTypeEntity } from "./forms.type.entity";
import { FormsQstEntity } from "./forms.qst.entity";

@Entity({ name: "forms" })
export class FormsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type_id: number;

  @Column()
  category_id: number;

  @Column({ length: 300, nullable: false })
  name: string;

  @Column({ length: 300 })
  detail: string;

  @Column({ default: null })
  test_cycle: number;

  @Column({ length: 100 })
  doc_url: string;

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @Column({ default: 0 })
  updated_by: number;

  @UpdateDateColumn({ default: Date.now })
  updated_at: Date;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  type_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  category_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  questions_total: number;

  @OneToOne(() => FormsTypeEntity)
  forms_type: FormsTypeEntity;

  @ManyToMany(() => FormsQstEntity)
  questions: FormsQstEntity[];
}
