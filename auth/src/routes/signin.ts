import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
  res.send('Sign in OK');
});

export { router as signinRouter };
