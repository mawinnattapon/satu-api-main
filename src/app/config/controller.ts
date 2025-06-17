import { Controller, Get } from '@nestjs/common';
import { AppResponse } from 'src/rest/app.response';
import { ConfigService } from './service';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigRes } from './res/config';

@ApiTags('Config')
@ApiResponse({ type: AppResponse })
@Controller("")
export class ConfigController {

  constructor(private readonly service: ConfigService) { }

  @Get('')
  @ApiOkResponse({ type: ConfigRes })
  async config() {
    return AppResponse.success(await this.service.config());
  }

}
