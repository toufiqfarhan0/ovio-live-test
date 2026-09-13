import express, { Request, Response, NextFunction } from 'express';
import { validateSessionToken, revokeSession, MAX_RETRY_ATTEMPTS, sessionBlacklist } from './auth';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || 'unknown';
  next();
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/validate', rateLimiter, (req: Request, res: Response) => {
  const { sessionToken } = req.body;
  const isValid = validateSessionToken(sessionToken, req.headers.authorization);
  if (!isValid) {
    return res.status(401).json({ error: 'Unauthorized', retryLimit: MAX_RETRY_ATTEMPTS });
  }
  res.json({ authenticated: true });
});

app.post('/api/auth/revoke', (req: Request, res: Response) => {
  const { sessionToken } = req.body;
  revokeSession(sessionToken);
  res.json({ revoked: true, blacklistedTokensCount: sessionBlacklist.size });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

