import { IMAGE_TYPE } from '@/constant';

const isImage = (file: Express.Multer.File) => {
  const type = file.originalname.split('.').slice(-1)[0];
  return IMAGE_TYPE.includes(type);
};
export default isImage;
