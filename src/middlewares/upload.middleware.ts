import path from 'path';
import multer from 'multer';
import { Request } from 'express';
import Datauri from 'datauri/parser';

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');
const dUri = new Datauri();
const dataUri = (req: Request) =>
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
export { multerUploads, dataUri };
