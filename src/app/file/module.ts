import { Module } from '@nestjs/common';
import { FileService } from './service';
import { FileController } from './controller';
import { FileUtil } from 'src/util/file.util';

@Module({
  imports: [
    
  ],
  controllers: [
    FileController
  ],
  providers: [
    FileUtil,
    FileService,
  ]
})
export class FileModule {}
