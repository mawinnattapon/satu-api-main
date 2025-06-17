import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "equipment_forms" })
export class EqmFormsEntity {
  @PrimaryColumn()
  equipment_id: number;

  @PrimaryColumn()
  forms_id: number;

  @Column()
  type_id: number;

  static create(equipment_id: number, forms_id: number, type_id: number): EqmFormsEntity {
    let item = new EqmFormsEntity();
    item.equipment_id = equipment_id;
    item.forms_id = forms_id;
    item.type_id = type_id;
    return item;
  }
}
