import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "config" })
export class ConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: false })
  key: string;

  @Column({ length: 100 })
  value: string;

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @Column({ default: 0 })
  updated_by: number;

  @UpdateDateColumn({ default: Date.now })
  updated_at: Date;

}
