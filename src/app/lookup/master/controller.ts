import { Controller, UseGuards, SetMetadata, Req, Get, Body, Post } from "@nestjs/common";
import { LookupMasterService } from "./service";
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { AppResponse } from "src/rest/app.response";
import { LookupOption } from "./res/option";
import { RoleAll } from "src/enum/role";
import { FindPrjInCompReq } from "./req/prj";

@ApiBearerAuth()
@ApiTags("Lookup")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class LookupMasterController {
  constructor(private readonly service: LookupMasterService) {}

  @Get("country")
  @ApiOkResponse({ type: LookupOption, isArray: true })
  @SetMetadata("level", RoleAll)
  @UseGuards(RolesGuard)
  async country(@Req() req: any) {
    return await this.service.country(req.user);
  }

  @Get("category")
  @ApiOkResponse({ type: LookupOption, isArray: true })
  @SetMetadata("level", RoleAll)
  @UseGuards(RolesGuard)
  async category(@Req() req: any) {
    return await this.service.category(req.user);
  }

  @Get("equipment_type")
  @ApiOkResponse({ type: LookupOption, isArray: true })
  @SetMetadata("level", RoleAll)
  @UseGuards(RolesGuard)
  async type(@Req() req: any) {
    return await this.service.type(req.user);
  }

  @Get("company")
  @ApiOkResponse({ type: LookupOption, isArray: true })
  @SetMetadata("level", RoleAll)
  @UseGuards(RolesGuard)
  async company(@Req() req: any) {
    return await this.service.company(req.user);
  }

  @Post("project")
  @ApiOkResponse({ type: LookupOption, isArray: true })
  @SetMetadata("level", RoleAll)
  @UseGuards(RolesGuard)
  async project(@Req() req: any, @Body() form: FindPrjInCompReq) {
    return await this.service.project(form, req.user);
  }
}
