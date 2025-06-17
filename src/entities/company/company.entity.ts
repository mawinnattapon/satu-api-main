import { StatusType, TrialStatus } from "src/enum/master";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ProjectEntity } from "./projects.entity";
import { UserEntity } from "../auth/user.entity";

@Entity({ name: "company" })
export class CompEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({ length: 255 })
  code: string;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  contact_name: string;

  @Column({ length: 255 })
  contact_phone: string;

  @Column({})
  photo: string;

  @Column()
  addr_info: string;

  @Column()
  addr_city: string;

  @Column()
  addr_state: string;

  @Column()
  addr_zipcode: string;

  @Column({ length: 2, default: "TH" })
  addr_country: string;

  @Column({})
  active: StatusType;

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

  @Column({ default: TrialStatus.yes })
  trial: TrialStatus;

  @Column({})
  trial_begin: Date;

  @Column({})
  trial_end: Date;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  addr_country_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  address_full: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  member_total: number;

  @ManyToMany(() => UserEntity)
  members: UserEntity[];

  @ManyToMany(() => ProjectEntity)
  projects: ProjectEntity[];
}
