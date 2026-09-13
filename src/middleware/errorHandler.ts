import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(`[Error] ${err.name}: ${err.message}`);
  
  if (res.headersSent) {
    return next(err);
  }

  // Gracefully handle 500 internal server errors during deployment
  res.status(500).json({
    error: 'InternalServerError',
    message: err.message || 'Authentication API error during deployment',
    timestamp: new Date().toISOString()
  });
}
