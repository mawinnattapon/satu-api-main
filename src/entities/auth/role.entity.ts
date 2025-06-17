import { RoleLevel } from "src/enum/role";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { MenuEntity } from "./menu.entity";

@Entity({ name: "role" })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: false })
  level: RoleLevel;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 100, nullable: false })
  name_short: string;

  @Column({ length: 300, nullable: false })
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

  @ManyToMany(() => MenuEntity)
  @JoinTable({ name: "role_menu", joinColumn: { name: "role_id" }, inverseJoinColumn: { name: "menu_id" } })
  menus: MenuEntity[];
}
