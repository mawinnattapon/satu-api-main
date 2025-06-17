import { Controller, Post, Body, UseGuards, SetMetadata, Request, Req } from "@nestjs/common";
import { DashService } from "./service";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { FormItem } from "src/form/form.item";
import { ApiSortDesc } from "src/form/form.page";
import { AppResponse } from "src/rest/app.response";
import { DashListRes } from "./res/list";
import { DashItemRes } from "./res/item";
import { RoleWeb } from "src/enum/role";
import { FormListId } from "src/form/form.list.id";
import { DashFormPage } from "./req/find";

@ApiBearerAuth()
@ApiTags("Dashboard")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class DashController {
  constructor(private readonly service: DashService) {}

  @Post("find")
  @ApiOkResponse({ type: DashListRes, isArray: true })
  @ApiOperation({ description: ApiSortDesc(DashService.sort) })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findAll(@Request() req: any, @Body() form: DashFormPage) {
    return await this.service.findAll(form, req.user);
  }

  @Post("item")
  @ApiOkResponse({ type: DashItemRes })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findOne(@Req() req: any, @Body() form: FormItem) {
    return await this.service.findOne(form, req.user);
  }

  @Post("approve")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async approve(@Req() req: any, @Body() form: FormListId) {
    return await this.service.approve(form, req.user);
  }

  @Post("reject")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async reject(@Req() req: any, @Body() form: FormListId) {
    return await this.service.reject(form, req.user);
  }

  @Post("delete")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async delete(@Req() req: any, @Body() form: FormListId) {
    return await this.service.delete(form, req.user);
  }
}
