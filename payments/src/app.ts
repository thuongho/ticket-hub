import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, NotFoundError, errorHandler } from '@thtickets/common';

import { createChargeRouter } from './routes/new';

const app = express();

// Middlewares
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // encryption off
    // secure: process.env.NODE_ENV !== 'test' // make sure it is https
    secure: false
  })
);
app.use(currentUser);

// Route handlers
app.use(createChargeRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
