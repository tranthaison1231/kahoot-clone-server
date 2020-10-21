import { NextFunction, Response } from 'express';
import { DEFAULT_PAGE, PERPAGE } from '@/constant';
import { RequestWithUser } from './auth.middleware';

interface Pagination {
  limit: number;
  skip: number;
  page: number;
}
export interface RequestWithPagination extends RequestWithUser {
  pagination: Pagination;
}

const pagination = (
  req: RequestWithPagination,
  res: Response,
  next: NextFunction
) => {
  const { page = DEFAULT_PAGE, limit = PERPAGE } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  req.pagination = {
    limit: Number(limit),
    skip,
    page: Number(page)
  };
  next();
};

export default pagination;
