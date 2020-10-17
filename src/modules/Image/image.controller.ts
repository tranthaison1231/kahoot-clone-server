import express from 'express';
import { isImage } from '@/utils';
import { Request, Response } from 'express';
import { uploadImage } from '@/utils/uploadImage';
import requireAuth from '@/middlewares/auth.middleware';
import { UploadImageException } from '@/utils/exception';
import { Controller, Exception } from '@shyn123/express-rest';
import { dataUri, multerUploads } from '@/middlewares/upload.middleware';

class ImageController implements Controller {
  public path = '/image';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post(this.path, requireAuth, multerUploads, this.upload);
  };

  upload = async (req: Request, res: Response) => {
    try {
      if (!req.file || !isImage(req.file)) {
        return Exception.NotFound(res, 'Image');
      }
      const file = dataUri(req).content;
      const image = await uploadImage(file);
      return UploadImageException(res, image);
    } catch (error) {
      return Exception.ServerError(res, error);
    }
  };
}
export default ImageController;
