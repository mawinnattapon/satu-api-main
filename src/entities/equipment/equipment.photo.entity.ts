import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "equipment_photo" })
export class EqmPhotoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  equipment_id: number;

  @Column({ length: 300 })
  url: string;

  static create(equipment_id: number, url: string): EqmPhotoEntity {
    let item = new EqmPhotoEntity();
    item.equipment_id = equipment_id;
    item.url = url;
    return item;
  }
}
