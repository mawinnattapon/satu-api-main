
import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'role_menu' })
export class RoleMenuEntity {

  @PrimaryColumn({})
  role_id: number;

  @PrimaryColumn({})
  menu_id: number;

  static create(role_id: number, menu_id: number): RoleMenuEntity {
    let item = new RoleMenuEntity();
    item.role_id = role_id;
    item.menu_id = menu_id;
    return item
  }

}