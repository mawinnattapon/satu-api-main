import { Controller, UseGuards, SetMetadata, Req, Get } from "@nestjs/common";
import { LookupAuthService } from "./service";
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { AppResponse } from "src/rest/app.response";
import { RoleWeb } from "src/enum/role";
import { ChildOption } from "./res/child.option";
import { RoleOption } from "./res/role.option";
import { UserOption } from "./res/user.option";

@ApiBearerAuth()
@ApiTags("Lookup")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class LookupAuthController {
  constructor(private readonly service: LookupAuthService) {}

  @Get("user")
  @ApiOkResponse({ type: UserOption, isArray: true })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async user(@Req() req: any) {
    return await this.service.user(req.user);
  }

  @Get("member")
  @ApiOkResponse({ type: UserOption, isArray: true })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async member(@Req() req: any) {
    return await this.service.member(req.user);
  }

  @Get("role")
  @ApiOkResponse({ type: RoleOption, isArray: true })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async role(@Req() req: any) {
    return await this.service.role(req.user);
  }

  @Get("menu")
  @ApiOkResponse({ type: ChildOption, isArray: true })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async Menu(@Req() req: any) {
    return await this.service.menu(req.user);
  }
}
