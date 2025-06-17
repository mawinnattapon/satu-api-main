import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "verify_email" })
export class VerifyEmailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  ref_code: string;

  @Column()
  user_id: number;

  @Column({ length: 100 })
  email: string;

  @Column({ default: 0 })
  sended: number;

  @Column({ default: 0 })
  verified: number;

  @Column({})
  verify_time: Date;

  @Column({})
  expire_at: Date;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @UpdateDateColumn({ default: Date.now })
  updated_at: Date;
}
