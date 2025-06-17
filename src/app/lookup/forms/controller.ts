import { Controller, UseGuards, SetMetadata, Req, Get, Body, Post } from "@nestjs/common";
import { LookupFormsService } from "./service";
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { AppResponse } from "src/rest/app.response";
import { LookupOption } from "../master/res/option";
import { RoleAll } from "src/enum/role";
import { FormsOptReq } from "./req/forms";
import { FormItem } from "src/form/form.item";

@ApiBearerAuth()
@ApiTags("Lookup")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class LookupFormsController {
  constructor(private readonly service: LookupFormsService) {}

  @Post("forms")
  @ApiOkResponse({ type: LookupOption, isArray: true })
  @SetMetadata("level", RoleAll)
  @UseGuards(RolesGuard)
  async forms(@Req() req: any, @Body() form: FormsOptReq) {
    return await this.service.forms(form, req.user);
  }

  @Get("form_type")
  @ApiOkResponse({ type: LookupOption, isArray: true })
  @SetMetadata("level", RoleAll)
  @UseGuards(RolesGuard)
  async formType(@Req() req: any) {
    return await this.service.formType(req.user);
  }

  @Post("eqm_type")
  @ApiOkResponse({ type: LookupOption, isArray: true })
  @SetMetadata("level", RoleAll)
  @UseGuards(RolesGuard)
  async eqmType(@Req() req: any, @Body() form: FormItem) {
    return await this.service.eqmType(form, req.user);
  }
}
