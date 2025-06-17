import { DueRangeType } from "src/enum/master";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "due_range" })
export class DueRangeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300, nullable: false })
  name: string;

  @Column({ nullable: false })
  time: number;

  @Column({ length: 1, nullable: false })
  type: DueRangeType;

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @Column({ default: 0 })
  updated_by: number;

  @UpdateDateColumn({ default: Date.now })
  updated_at: Date;
}
