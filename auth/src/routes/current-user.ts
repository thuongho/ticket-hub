import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', (req: Request, res: Response) => {
  // Check for cookie with JWT
  if (!req.session?.jwt) {
    return res.send({ currentuser: null });
  }

  // Decode JWT
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ currentuser: payload });
  } catch (err) {
    res.send({ currentuser: null });
  }
});

export { router as currentUserRouter };
