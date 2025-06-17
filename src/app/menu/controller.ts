import { Controller, Post, Body, UseGuards, SetMetadata, Request, Req } from "@nestjs/common";
import { MenuService } from "./service";
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { FormItem } from "src/form/form.item";
import { AppResponse } from "src/rest/app.response";
import { RoleDev } from "src/enum/role";
import { MenuListRes } from "./res/list";
import { MenuItemRes } from "./res/item";
import { MenuSaveReq } from "./req/save";

@ApiBearerAuth()
@ApiTags("Menu")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class MenuController {
  constructor(private readonly service: MenuService) {}

  @Post("find")
  @ApiOkResponse({ type: MenuListRes, isArray: true })
  @SetMetadata("level", RoleDev)
  @UseGuards(RolesGuard)
  async findAll(@Request() req: any) {
    return await this.service.findAll(req.user);
  }

  @Post("item")
  @ApiOkResponse({ type: MenuItemRes })
  @SetMetadata("level", RoleDev)
  @UseGuards(RolesGuard)
  async findOne(@Req() req: any, @Body() form: FormItem) {
    return await this.service.findOne(form, req.user);
  }

  @Post("save")
  @ApiOkResponse({ type: Boolean })
  @SetMetadata("level", RoleDev)
  @UseGuards(RolesGuard)
  async create(@Req() req: any, @Body() form: MenuSaveReq) {
    if (form.id) {
      return await this.service.update(form, req.user);
    } else {
      return await this.service.create(form, req.user);
    }
  }

  @Post("delete")
  @ApiOkResponse({ type: Boolean })
  @SetMetadata("level", RoleDev)
  @UseGuards(RolesGuard)
  async delete(@Request() req: any, @Body() form: FormItem) {
    return await this.service.delete(form, req.user);
  }
}
