import { Response } from 'express';

interface SuccessOptions<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  statusCode?: number;
}

export function sendSuccess<T>(res: Response, options: SuccessOptions<T>) {
  const { data, meta, statusCode = 200 } = options;
  res.status(statusCode).json({
    success: true,
    data,
    ...(meta && { meta }),
  });
}

export function paginate(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function paginationArgs(page: number, limit: number) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
