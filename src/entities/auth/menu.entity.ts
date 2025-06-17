import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "menu" })
export class MenuEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({ default: 0, nullable: false })
  parent: number;

  @Column({ length: 100, nullable: false })
  url: string;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ nullable: false })
  priority: number;

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

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  created_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  updated_name: string;

  @ManyToMany(() => MenuEntity)
  @JoinTable({ name: "menu", joinColumn: { name: "parent" }, inverseJoinColumn: { name: "id" } })
  children: MenuEntity[];
}
