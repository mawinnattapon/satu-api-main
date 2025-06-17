import { FileImportStatus, SourceImport } from "src/enum/master";
import { Entity, Column, CreateDateColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "import_movement" })
export class ImportMovementEntity {
  @PrimaryColumn({})
  id: number;

  @Column()
  comp_id: number;

  @Column({ length: 100, unique: true })
  session: string;

  @Column({ length: 200 })
  url: string;

  @Column()
  status: FileImportStatus;

  @Column({ length: 50 })
  source: SourceImport;

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

  @Column({})
  deleted_by: number;

  @Column({})
  deleted_at: Date;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  created_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  comp_name: string;

  @Column({ select: false, insert: false, readonly: true, nullable: true })
  status_name: string;
}
