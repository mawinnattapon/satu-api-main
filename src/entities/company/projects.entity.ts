import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "projects" })
export class ProjectEntity {
  //
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({})
  company_id: number;

  @Column({ length: 300, nullable: false })
  name: string;

  @Column({ length: 300 })
  detail: string;

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
}
