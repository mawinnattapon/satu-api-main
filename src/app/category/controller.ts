import { Controller, Post, Body, UseGuards, SetMetadata, Request, Req } from "@nestjs/common";
import { CategoryService } from "./service";
import { SaveCategoryReq } from "./req/save";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { FormItem } from "src/form/form.item";
import { ApiSortDesc, FormPage } from "src/form/form.page";
import { AppResponse } from "src/rest/app.response";
import { CategoryListRes } from "./res/list";
import { CategoryItemRes } from "./res/item";
import { RoleWeb } from "src/enum/role";
import { FormListId } from "src/form/form.list.id";

@ApiBearerAuth()
@ApiTags("Category")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post("find")
  @ApiOkResponse({ type: CategoryListRes, isArray: true })
  @ApiOperation({ description: ApiSortDesc(CategoryService.sort) })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findAll(@Request() req: any, @Body() form: FormPage) {
    return await this.service.findAll(form, req.user);
  }

  @Post("item")
  @ApiOkResponse({ type: CategoryItemRes })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findOne(@Req() req: any, @Body() form: FormItem) {
    return await this.service.findOne(form, req.user);
  }

  @Post("save")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async create(@Req() req: any, @Body() form: SaveCategoryReq) {
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
}
