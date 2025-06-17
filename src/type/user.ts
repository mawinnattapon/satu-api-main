import { Platform } from "src/enum/master";
import { RoleLevel } from "src/enum/role";

export interface UserJwt {
  id: number;
  key: string;
  platform: Platform;
  role_level: RoleLevel;
  company_id: number[];
}
