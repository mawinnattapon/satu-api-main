import { Body, Controller, Get, Headers, Param, Post, Redirect, Req, Res } from "@nestjs/common";
import { ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppResponse } from "src/rest/app.response";
import { SignupReq } from "./req/signup";
import { SignupService } from "./service";
import { Config } from "src/config";
import { ForgotReq } from "./req/forgot";
import { ChangePwdReq } from "./req/chg.pwd";

@ApiTags("Auth")
@ApiResponse({ type: AppResponse })
@Controller()
export class SignupController {
  constructor(private readonly service: SignupService) {}

  @Post("signup")
  @ApiOkResponse({ type: Boolean })
  async signup(@Req() req: any, @Body() form: SignupReq) {
    return await this.service.signup(form);
  }

  @Post("password/forgot")
  @ApiOkResponse({ type: Boolean })
  async forgot(@Req() req: any, @Body() form: ForgotReq) {
    return await this.service.forgot(form);
  }

  @Post("password/reset")
  @ApiOkResponse({ type: Boolean })
  async forgotResetPwd(@Req() req: any, @Body() form: ChangePwdReq) {
    return await this.service.forgotResetPwd(form);
  }

  @ApiResponse({ type: Redirect })
  @Get("/verify/:ref_code")
  async get(@Req() req: any, @Res() res: any, @Param("ref_code") ref_code: string) {
    try {
      await this.service.verify(ref_code);
      return res.redirect(`${Config.appUrl}/action/verify?status=ok&message=Verify Email Success`);
    } catch (error) {
      return res.redirect(`${Config.appUrl}/action/verify?status=err&message=${error.message || error}`);
    }
  }
}
