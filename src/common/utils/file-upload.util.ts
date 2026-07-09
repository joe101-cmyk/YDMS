import { extname } from 'path';

export function editFileName(_req: any, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${randomName}${extname(file.originalname)}`);
}
