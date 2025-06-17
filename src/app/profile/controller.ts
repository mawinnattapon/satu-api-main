import { Controller, Post, Body, UseGuards, Req, Get, UseInterceptors, UploadedFile } from "@nestjs/common";
import { ProfileService } from "./service";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { SaveProfileReq } from "./req/update.profile";
import { AppResponse } from "src/rest/app.response";
import { UserProfile } from "../../partial/user.profile";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadReq } from "./req/upload.photo";
import { UserItem } from "./res/user.item";
import { PasswordChangeReq } from "./req/update.pass";

@ApiBearerAuth()
@ApiTags("Profile")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get()
  @ApiOkResponse({ type: UserProfile })
  async profile(@Req() req: any) {
    return await this.service.findProfileById(req.user);
  }

  @Get("remove")
  @ApiOkResponse({ type: UserProfile })
  async remove(@Req() req: any) {
    return await this.service.remove(req.user);
  }

  @Get("detail")
  @ApiOkResponse({ type: UserItem })
  async profileDetail(@Req() req: any) {
    return await this.service.findOne(req.user);
  }

  @Post("update")
  @ApiOkResponse({ type: Boolean })
  async updateProfile(@Req() req: any, @Body() form: SaveProfileReq) {
    return await this.service.update(form, req.user);
  }

  @Post("password/change")
  @ApiOkResponse({ type: Boolean })
  async passwordChange(@Req() req: any, @Body() form: PasswordChangeReq) {
    return await this.service.passwordChange(form, req.user);
  }

  @Post("upload/photo")
  @ApiOkResponse({ type: String })
  @ApiBody({ type: FileUploadReq, description: "The file to be uploaded" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async updatePhoto(@UploadedFile() file: any, @Req() req: any) {
    return await this.service.uploadPhoto(file, req.user);
  }
}
