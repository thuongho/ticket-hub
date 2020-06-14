import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // handling error type
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // log out uncaught error
  console.error(err);

  // catch all
  res.status(400).send({
    errors: [{ message: 'Something went wrong' }]
  });
};
