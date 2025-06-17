import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "category" })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
}
