import { Controller, Post, Body, UseGuards, SetMetadata, Request, Req } from "@nestjs/common";
import { RoleService } from "./service";
import { SaveRoleReq } from "./req/save";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { FormItem } from "src/form/form.item";
import { ApiSortDesc, FormPage } from "src/form/form.page";
import { AppResponse } from "src/rest/app.response";
import { RoleListRes } from "./res/list";
import { RoleItemRes } from "./res/item";
import { RoleDev } from "src/enum/role";

@ApiBearerAuth()
@ApiTags("Role")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Post("find")
  @ApiOkResponse({ type: RoleListRes, isArray: true })
  @ApiOperation({ description: ApiSortDesc(RoleService.sort) })
  @SetMetadata("level", RoleDev)
  @UseGuards(RolesGuard)
  async findAll(@Request() req: any, @Body() form: FormPage) {
    return await this.service.findAll(form, req.user);
  }

  @Post("item")
  @ApiOkResponse({ type: RoleItemRes })
  @SetMetadata("level", RoleDev)
  @UseGuards(RolesGuard)
  async findOne(@Req() req: any, @Body() form: FormItem) {
    return await this.service.findOne(form, req.user);
  }

  @Post("save")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleDev)
  @UseGuards(RolesGuard)
  async create(@Req() req: any, @Body() form: SaveRoleReq) {
    return await this.service.update(form, req.user);
  }
}
