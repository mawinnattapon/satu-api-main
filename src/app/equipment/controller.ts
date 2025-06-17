import {
  Controller,
  Post,
  Body,
  UseGuards,
  SetMetadata,
  Request,
  Req,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { EqmService } from "./service";
import { SaveEqmReq } from "./req/save";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { FormItem } from "src/form/form.item";
import { ApiSortDesc } from "src/form/form.page";
import { AppResponse } from "src/rest/app.response";
import { EqmListRes } from "./res/list";
import { EqmItemRes } from "./res/item";
import { RoleWeb } from "src/enum/role";
import { FormListId } from "src/form/form.list.id";
import { EqmActiveListIdReq } from "./req/active";
import { CloneItemReq } from "./req/clone";
import { EqmFindReq } from "./req/find";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadEqmReq, UploadFailReq } from "./req/import";
import { SearchUploadReq } from "./req/search";
import { ImportMovemontListRes } from "./res/list.import";
import { EqmTestDateReq } from "./req/test.date";
import { EqmTestDateRes } from "./res/test.date";

@ApiBearerAuth()
@ApiTags("Equipment")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class EqmController {
  constructor(private readonly service: EqmService) {}

  @Post("find")
  @ApiOkResponse({ type: EqmListRes, isArray: true })
  @ApiOperation({ description: ApiSortDesc(EqmService.sort) })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findAll(@Request() req: any, @Body() form: EqmFindReq) {
    return await this.service.findAll(form, req.user);
  }

  @Post("item")
  @ApiOkResponse({ type: EqmItemRes })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findOne(@Req() req: any, @Body() form: FormItem) {
    return await this.service.findOne(form, req.user);
  }

  @Post("save")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async create(@Req() req: any, @Body() form: SaveEqmReq) {
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

  @Post("active")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async active(@Req() req: any, @Body() form: EqmActiveListIdReq) {
    return await this.service.active(form, req.user);
  }

  @Post("clone")
  @ApiOkResponse({ type: EqmItemRes })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async clone(@Req() req: any, @Body() form: CloneItemReq) {
    return await this.service.clone(form, req.user);
  }

  @Post("/upload/find")
  @ApiOkResponse({ type: ImportMovemontListRes, isArray: true })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async find(@Req() req: any, @Body() form: SearchUploadReq) {
    return await this.service.uploadFind(form, req.user);
  }

  @Post("/upload/item/delete")
  @ApiOkResponse({ type: Number})
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async deleteUpload(@Req() req: any, @Body() form: FormListId) {
    return await this.service.deleteUpload(form, req.user);
  }

  @Post("/upload/file")
  @ApiResponse({ status: 200, type: Boolean })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadEqmReq, description: "The file to be uploaded" })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Body() form: UploadEqmReq
  ): Promise<boolean> {
    return await this.service.uploadFile(req.user, file, form);
  }

  @Post("/upload/fail")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async uploadFail(@Req() req: any, @Body() form: UploadFailReq) {
    return await this.service.uploadFail(form, req.user);
  }

  @Post("/test_date")
  @ApiOkResponse({ type: EqmTestDateRes, isArray: true })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async testDate(@Req() req: any, @Body() form: EqmTestDateReq) {
    return await this.service.testDate(form, req.user);
  }
}
