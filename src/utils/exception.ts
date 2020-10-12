import status from 'http-status';
import { Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { Room } from '@/modules/Room/room.interface';
import { Response as HttpResponse } from '@shyn123/express-rest';

export const NotFoundException = (res: Response, input: string) => {
  return HttpResponse(
    res,
    {
      message: `${input} not found`
    },
    status.NOT_FOUND
  );
};

export const CreatedException = (res: Response, data: any) => {
  return HttpResponse(
    res,
    { message: 'Create completed', data },
    status.CREATED
  );
};

export const EditedException = (res: Response, data: any) => {
  return HttpResponse(res, { message: 'Edit completed', data });
};

export const ServerErrorException = (res: Response, error: any) => {
  return HttpResponse(
    res,
    { error: error.message },
    status.INTERNAL_SERVER_ERROR
  );
};

export const UploadImageException = (
  res: Response,
  image: UploadApiResponse
) => {
  return HttpResponse(res, { message: 'Upload completed', url: image.secure_url });
};

export const JoinRoomException = (res: Response, data: any) => {
  return HttpResponse(res, { message: 'Join completed', data });
};

export const RoomStatusException = (res: Response, room: Room) => {
  return HttpResponse(
    res,
    { message: `This room is ${room.status}` },
    status.UNAUTHORIZED
  );
};

export const ChangeStatusException = (
  res: Response,
  data: any,
  status: string
) => {
  return HttpResponse(res, { message: `Room is ${status}`, data });
};
