import { Router, Request, Response } from 'express';
import { validateSessionToken, sessionBlacklist } from '../auth';

export const authRouter = Router();

export const tokenBlacklist = sessionBlacklist;

authRouter.post('/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken || tokenBlacklist.has(refreshToken)) {
    return res.status(401).json({ error: 'Invalid or revoked refresh token' });
  }
  const newAccessToken = `acc_${Date.now()}_valid`;
  res.json({ accessToken: newAccessToken });
});

authRouter.post('/logout', (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    tokenBlacklist.add(refreshToken);
  }
  res.json({ message: 'Session logged out successfully' });
});
