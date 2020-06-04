// type to describe requirements
import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    // Only because we are extending a built in class in ts
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
