import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "equipment_type" })
export class EqmTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300, nullable: false })
  name: string;

  @Column({ nullable: false })
  category_id: number;

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @Column({ default: 0 })
  updated_by: number;

  @UpdateDateColumn({ default: Date.now })
  updated_at: Date;
}
