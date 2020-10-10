import status from 'http-status';
import { Response } from 'express';
import { Response as HttpResponse } from '@shyn123/express-rest';

export const notFoundException = (res: Response, input: string) => {
  return HttpResponse(
    res,
    {
      message: `${input} not found`
    },
    status.NOT_FOUND
  );
};

export const createdException = (res: Response, data: any) => {
  return HttpResponse(
    res,
    { message: 'Create completed', data },
    status.CREATED
  );
};

export const editedException = (res: Response, data: any) => {
  return HttpResponse(res, { message: 'Edit completed', data }, status.OK);
};

export const serverErrorException = (res: Response, error: any) => {
  return HttpResponse(
    res,
    { error: error.message },
    status.INTERNAL_SERVER_ERROR
  );
};
