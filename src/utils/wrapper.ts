import createHttpError from 'http-errors';
import express, { RequestHandler } from 'express';

export const asyncWrapper = (fn: RequestHandler) => (req: express.Request, res: express.Response, next: express.NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    if (error instanceof Error) {
      return next(createHttpError(500, error.message));
    }
    return next(createHttpError(500, 'Internal Server Error'));
  });
