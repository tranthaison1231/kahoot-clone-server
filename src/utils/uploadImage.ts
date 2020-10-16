import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});
export const uploadImage = (file: string) => {
  return cloudinary.v2.uploader.upload(file);
};
