import { Body, Controller, Get, Headers, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppResponse } from "src/rest/app.response";
import { AuthLoginRes } from "./res/auth.login";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { SigninReq } from "./req/signin";
import { SigninService } from "./service";

@ApiTags("Auth")
@ApiResponse({ type: AppResponse })
@Controller()
export class SigninController {
  constructor(private readonly service: SigninService) {}

  @Post("signin")
  @ApiOkResponse({ type: AuthLoginRes })
  async signin(@Req() req: any, @Body() form: SigninReq) {
    return await this.service.signin(form);
  }

  @Get("signout")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Boolean })
  async signout(@Req() req: any) {
    return await this.service.signout(req.user);
  }
}
