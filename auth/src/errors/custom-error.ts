// abstract class is like interface but it exists in JS world while interface doesn't
export abstract class CustomError extends Error {
  // must have statusCode
  abstract statusCode: number;

  constructor(message: string) {
    // for logging purposes
    // same as throw new Error('some message')
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // must have serializeError method that returns an array
  abstract serializeErrors(): { message: string; field?: string }[];
}
