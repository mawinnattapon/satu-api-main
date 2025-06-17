import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  AfterLoad,
} from "typeorm";
import { RoleEntity } from "./role.entity";
import { StatusType } from "src/enum/master";
import { RoleLevel } from "src/enum/role";
import { CompEntity } from "../company/company.entity";
import { Config } from "src/config";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, nullable: false })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 250 })
  first_name: string;

  @Column({ length: 250 })
  last_name: string;

  @Column({ length: 250 })
  position: string;

  @Column({ length: 250 })
  emp_no: string;

  @Column({ length: 10 })
  mobile: string;

  @Column({ length: 300 })
  photo: string;

  @Column({ length: 400 })
  addr_info: string;

  @Column({ length: 250 })
  addr_city: string;

  @Column({ length: 250 })
  addr_state: string;

  @Column({ length: 5 })
  addr_zipcode: string;

  @Column({ length: 2, default: "TH" })
  addr_country: string;

  @Column({ nullable: false })
  role_id: number;

  @Column()
  company_id: number;

  @Column({ length: 250 })
  auth_web: string;

  @Column({ length: 250 })
  auth_mobile: string;

  @Column({ nullable: false })
  active: StatusType;

  @Column()
  last_active: Date;

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
  full_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  role_level: RoleLevel;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  role_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  addr_country_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  created_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  updated_name: string;

  @OneToOne(() => RoleEntity)
  role: RoleEntity;

  @OneToOne(() => CompEntity)
  company: CompEntity;

  @AfterLoad()
  afterLoad() {
    if (!this.photo) this.photo = Config.appUrl + "/200.png";
    if (!this.full_name) this.full_name = `${this.first_name} ${this.last_name}`.trim();
  }
}
