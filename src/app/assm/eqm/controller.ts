import { Controller, Post, Body, UseGuards, SetMetadata, Request } from "@nestjs/common";
import { AssmEqmService } from "./service";
import { EqmFormFindReq } from "./req/eqm.find";
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { AppResponse } from "src/rest/app.response";
import { RoleDev, RoleMember } from "src/enum/role";
import { EqmFindItemRes } from "./res/item";
import { EqmFormsListReq } from "./req/eqm.forms.list";
import { EqmFormsListRes } from "src/app/assm/eqm/res/eqm.forms.list";
import { EqmFormsItemReq } from "./req/eqm.forms.item";
import { EqmFormsItem } from "src/app/assm/eqm/res/eqm.forms.item";
import { EqmFormsSaveReq } from "./req/eqm.forms.save";
import { EqmFormsSaveRes } from "./res/eqm.forms.save";

@ApiBearerAuth()
@ApiTags("Assm - Equipment")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller("equipment")
export class AssmEqmController {
  constructor(private readonly service: AssmEqmService) {}

  @Post("find")
  @ApiOkResponse({ type: EqmFindItemRes, isArray: true })
  @SetMetadata("level", [...RoleMember, ...RoleDev])
  @UseGuards(RolesGuard)
  async eqmFind(@Request() req: any, @Body() form: EqmFormFindReq) {
    return await this.service.eqmFind(form, req.user);
  }

  @Post("forms/list")
  @ApiOkResponse({ type: EqmFormsListRes, isArray: true })
  @SetMetadata("level", [...RoleMember, ...RoleDev])
  @UseGuards(RolesGuard)
  async eqmFormsList(@Request() req: any, @Body() form: EqmFormsListReq) {
    return await this.service.eqmFormsList(form, req.user);
  }

  @Post("forms/item")
  @ApiOkResponse({ type: EqmFormsItem })
  @SetMetadata("level", [...RoleMember, ...RoleDev])
  @UseGuards(RolesGuard)
  async eqmFormsItem(@Request() req: any, @Body() form: EqmFormsItemReq) {
    return await this.service.eqmFormsItem(form, req.user);
  }

  @Post("forms/save")
  @ApiOkResponse({ type: EqmFormsSaveRes })
  @SetMetadata("level", [...RoleMember, ...RoleDev])
  @UseGuards(RolesGuard)
  async eqmFormsSave(@Request() req: any, @Body() form: EqmFormsSaveReq) {
    return await this.service.eqmFormsSave(form, req.user);
  }
}
