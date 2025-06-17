import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "country" })
export class CountryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2 })
  code: string;

  @Column({ length: 255 })
  name_th: string;

  @Column({ length: 255 })
  name_en: string;
}
