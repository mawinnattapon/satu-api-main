import { Controller, Post, Body, UseGuards, SetMetadata, Request, Req } from "@nestjs/common";
import { FormsService } from "./service";
import { SaveFormsReq, SaveNormalReq } from "./req/save";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { FormItem } from "src/form/form.item";
import { ApiSortDesc } from "src/form/form.page";
import { AppResponse } from "src/rest/app.response";
import { FormsListRes } from "./res/list";
import { FormsItemRes } from "./res/item";
import { RoleWeb } from "src/enum/role";
import { FormListId } from "src/form/form.list.id";
import { FormsFindReq } from "./req/find";
import { NormalItemRes } from "./res/normal.item";

@ApiBearerAuth()
@ApiTags("Forms")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class FormsController {
  constructor(private readonly service: FormsService) {}

  @Post("find")
  @ApiOkResponse({ type: FormsListRes, isArray: true })
  @ApiOperation({ description: ApiSortDesc(FormsService.sort) })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findAll(@Request() req: any, @Body() form: FormsFindReq) {
    return await this.service.findAll(form, req.user);
  }

  @Post("item")
  @ApiOkResponse({ type: FormsItemRes })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findOne(@Req() req: any, @Body() form: FormItem) {
    return await this.service.findOne(form, req.user);
  }

  @Post("save")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async create(@Req() req: any, @Body() form: SaveFormsReq) {
    if (form.id) {
      return await this.service.update(form, req.user);
    } else {
      return await this.service.create(form, req.user);
    }
  }

  @Post("delete")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async delete(@Req() req: any, @Body() form: FormListId) {
    return await this.service.delete(form, req.user);
  }

  @Post("normal/item")
  @ApiOkResponse({ type: NormalItemRes, isArray: false })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async normalItem(@Request() req: any, @Body() form: FormItem) {
    return await this.service.normalItem(form, req.user);
  }

  @Post("normal/update")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async normalUpdate(@Req() req: any, @Body() form: SaveNormalReq) {
    return await this.service.updateNormal(form, req.user);
  }
}
