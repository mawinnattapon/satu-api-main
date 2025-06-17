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
import { UserService } from "./service";
import { SaveUserReq } from "./req/save";
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
import { ApiSortDesc, FormPage } from "src/form/form.page";
import { AppResponse } from "src/rest/app.response";
import { UserListRes } from "./res/list";
import { UserItemRes } from "./res/item";
import { RoleWeb } from "src/enum/role";
import { FormListId } from "src/form/form.list.id";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadReq } from "../profile/req/upload.photo";
import { FindForm } from "./req/find";

@ApiBearerAuth()
@ApiTags("User")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post("find")
  @ApiOkResponse({ type: UserListRes, isArray: true })
  @ApiOperation({ description: ApiSortDesc(UserService.sort) })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findAll(@Request() req: any, @Body() form: FindForm) {
    return await this.service.findAll(form, req.user);
  }

  @Post("item")
  @ApiOkResponse({ type: UserItemRes })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findOne(@Req() req: any, @Body() form: FormItem) {
    return await this.service.findOne(form, req.user);
  }

  @Post("save")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async create(@Req() req: any, @Body() form: SaveUserReq) {
    if (form.id) {
      return await this.service.update(form, req.user);
    } else {
      return await this.service.create(form, req.user);
    }
  }

  @Post("upload/photo")
  @ApiOkResponse({ type: String })
  @ApiBody({ type: FileUploadReq, description: "The file to be uploaded" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async updatePhoto(@UploadedFile() file: any, @Req() req: any) {
    return await this.service.uploadPhoto(file, req.user);
  }

  @Post("delete")
  @ApiOkResponse({ type: Number })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async delete(@Req() req: any, @Body() form: FormListId) {
    return await this.service.delete(form, req.user);
  }
}
