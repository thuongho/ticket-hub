import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@thtickets/common';

const app = express();
// traffic proxied through ingress
// tell express to trust the traffic
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // encryption off
    secure: process.env.NODE_ENV !== 'test'
  })
);
app.use(currentUser);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
