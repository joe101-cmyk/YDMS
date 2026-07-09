import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { editFileName } from '../common/utils/file-upload.util';

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  @Post('single')
  @ApiOperation({ summary: 'Upload a single image' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: './uploads', filename: editFileName }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\//)) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return { fileName: file.filename, path: file.path };
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple images' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({ destination: './uploads', filename: editFileName }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\//)) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadMultiple(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map((file) => ({ fileName: file.filename, path: file.path }));
  }
}
