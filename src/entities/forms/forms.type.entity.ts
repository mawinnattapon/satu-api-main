import { AllowRepeat } from "src/enum/master";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "forms_type" })
export class FormsTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300, nullable: false })
  slug: string;

  @Column({ length: 300, nullable: false })
  name: string;

  @Column({ length: 300 })
  detail: string;

  @Column({ nullable: false })
  allow_repeat: AllowRepeat;

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @Column({ default: 0 })
  updated_by: number;

  @UpdateDateColumn({ default: Date.now })
  updated_at: Date;
}
