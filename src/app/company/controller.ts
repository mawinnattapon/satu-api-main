import { Controller, Post, Body, UseGuards, SetMetadata, Request, Req } from "@nestjs/common";
import { CompService } from "./service";
import { SaveCompReq } from "./req/save";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { FormItem } from "src/form/form.item";
import { ApiSortDesc, FormPage } from "src/form/form.page";
import { AppResponse } from "src/rest/app.response";
import { CompListRes } from "./res/list";
import { CompItemRes } from "./res/item";
import { RoleLevel, RoleWeb } from "src/enum/role";
import { FormListId } from "src/form/form.list.id";
import { SaveCompQuickReq } from "./req/save.quick";
import { SaveCompPrjQuickReq } from "./req/save.prj.quick";

@ApiBearerAuth()
@ApiTags("Company")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class CompController {
  constructor(private readonly service: CompService) {}

  @Post("find")
  @ApiOkResponse({ type: CompListRes, isArray: true })
  @ApiOperation({ description: ApiSortDesc(CompService.sort) })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findAll(@Request() req: any, @Body() form: FormPage) {
    return await this.service.findAll(form, req.user);
  }

  @Post("item")
  @ApiOkResponse({ type: CompItemRes })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findOne(@Req() req: any, @Body() form: FormItem) {
    return await this.service.findOne(form, req.user);
  }

  @Post("save")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async create(@Req() req: any, @Body() form: SaveCompReq) {
    if (form.id || req.user.role_level === RoleLevel.admin) {
      return await this.service.update(form, req.user);
    } else {
      return await this.service.create(form, req.user);
    }
  }

  @Post("save/quick")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async createQuick(@Req() req: any, @Body() form: SaveCompQuickReq) {
    return await this.service.createQuick(form, req.user);
  }

  @Post("project/quick")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async createPrjQuick(@Req() req: any, @Body() form: SaveCompPrjQuickReq) {
    return await this.service.createPrjQuick(form, req.user);
  }

  @Post("delete")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async delete(@Req() req: any, @Body() form: FormListId) {
    return await this.service.delete(form, req.user);
  }
}
