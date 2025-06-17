export enum RoleLevel {
  dev = "dev",
  owner = "owner",
  admin = "admin",
  member = "member",
}

export const RoleAll: RoleLevel[] = [RoleLevel.dev, RoleLevel.owner, RoleLevel.admin, RoleLevel.member];
export const RoleWeb: RoleLevel[] = [RoleLevel.dev, RoleLevel.owner, RoleLevel.admin];
export const RoleOwnerWeb: RoleLevel[] = [RoleLevel.dev, RoleLevel.owner];
export const RoleDev: RoleLevel[] = [RoleLevel.dev];
export const RoleSutu: RoleLevel[] = [RoleLevel.owner, RoleLevel.admin, RoleLevel.member];
export const RoleOwner: RoleLevel[] = [RoleLevel.owner];
export const RoleAdmin: RoleLevel[] = [RoleLevel.owner, RoleLevel.admin];
export const RoleComp: RoleLevel[] = [RoleLevel.admin, RoleLevel.member];
export const RoleMember: RoleLevel[] = [RoleLevel.member];
