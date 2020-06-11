import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@thtickets/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // encryption off
    secure: process.env.NODE_ENV !== 'test' // make sure it is https
  })
);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
