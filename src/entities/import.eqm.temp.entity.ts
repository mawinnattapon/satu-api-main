import { FileImportStatus, SourceImport } from "src/enum/master";
import { ValidateData } from "src/type/temp";
import { Entity, Column, CreateDateColumn, PrimaryColumn } from "typeorm";

@Entity({ name: "import_equip_temp" })
export class ImportEqmTempEntity {

  @PrimaryColumn({})
  id: number;

  @Column()
  comp_id: number;

  @Column()
  session: string;

  @Column()
  line: number;

  @Column()
  name: string;

  @Column()
  eqm_no: string;

  @Column()
  alt_no: string;

  @Column()
  brand_name: string;

  @Column()
  model_name: string;

  @Column()
  category_id: number;

  @Column()
  equip_type_id: number;

  @Column()
  project: string;

  @Column()
  location: string;

  @Column()
  purchase_date: Date;

  @Column()
  installation_date: Date;

  @Column()
  detail: string;

  @Column()
  active: number;

  @Column("json", { array: true, })
  validate: ValidateData[];

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn({ default: Date.now })
  created_at: Date;

}