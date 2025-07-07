import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ApiMultiFile } from './upload-multi-file.meta';
import { ApiFile } from './upload-file.meta';

export function UploadMedia(
  fileName: string = 'file',
  multi = false,
  num = 10,
) {
  if (multi) {
    return applyDecorators(
      ApiConsumes('multipart/form-data'),
      ApiMultiFile({ name: 'files', isArray: true }),
      UseInterceptors(FilesInterceptor('files', num)),
    );
  }

  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiFile(fileName),
    UseInterceptors(FileInterceptor(fileName)),
  );
}
