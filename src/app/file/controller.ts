import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppResponse } from 'src/rest/app.response';
import { FileService } from './service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileReq } from 'src/form/file.req';

@ApiBearerAuth()
@ApiTags('File')
@UseGuards(JwtAuthGuard)
@Controller()
export class FileController {

  constructor(private readonly fileService: FileService) { }

  @Post('/upload/image')
  @ApiResponse({ type: AppResponse })
  @ApiOkResponse({ type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileReq, description: 'The file to be uploaded' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: any, @Req() req: any) {
    return AppResponse.success(await this.fileService.uploadImage(file, req.user));
  }

  @Post('/upload/file')
  @ApiResponse({ type: AppResponse })
  @ApiOkResponse({ type: String })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any, @Req() req: any) {
    return AppResponse.success(await this.fileService.uploadFile(file, req.user));
  }

}
