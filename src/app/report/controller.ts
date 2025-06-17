import { Controller, Post, SetMetadata, Request, UseGuards, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { AppResponse } from "src/rest/app.response";
import { ReportService } from "./service";
import { RoleWeb } from "src/enum/role";
import { RolesGuard } from "src/guard/roles.guard";
import { ReportFindReq } from "./req/find";
import { ReportRes } from "./res/report";

@ApiBearerAuth()
@ApiTags("Report")
@ApiResponse({ type: AppResponse })
@UseGuards(JwtAuthGuard)
@Controller()
export class ReportController {
  constructor(private readonly service: ReportService) { }

  @Post("find")
  @ApiOkResponse({ type: ReportRes, isArray: false })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async findAll(@Request() req: any, @Body() form: ReportFindReq) {
    return await this.service.findAll(form, req.user);
  }

  @Post("export")
  @ApiOkResponse({ type: String, isArray: false })
  @SetMetadata("level", RoleWeb)
  @UseGuards(RolesGuard)
  async export(@Request() req: any, @Body() form: ReportFindReq) {
    return await this.service.export(form, req.user);
  }
}