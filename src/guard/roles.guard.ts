import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserProfile } from "src/partial/user.profile";
import { RoleLevel } from "src/enum/role";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!(request.user instanceof UserProfile)) throw new UnauthorizedException();

    const user = request.user as UserProfile;
    if (!user) return false;

    const level = this.reflector.get<RoleLevel[]>("level", context.getHandler());

    if (!level || level.length < 1) throw new ForbiddenException();

    if (level.filter((e) => e === user.role_level).length < 1) throw new ForbiddenException();

    return true;
  }
}
