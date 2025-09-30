import type { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  isScheduler?: boolean;
}

/**
 * Middleware to authenticate requests from GitHub Actions scheduler
 * Checks for Bearer token in Authorization header
 */
export const authenticateScheduler = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): void => {
  // Allow requests without auth in development
  if (process.env.NODE_ENV === 'development') {
    req.isScheduler = false;
    return next();
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.status(401).json({ 
      error: 'Authorization header required for scheduled requests',
      hint: 'Include Bearer token in Authorization header'
    });
    return;
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ 
      error: 'Bearer token not found in Authorization header',
      hint: 'Format: Authorization: Bearer <your-token>'
    });
    return;
  }

  if (token !== process.env.SCHEDULER_SECRET) {
    res.status(401).json({ 
      error: 'Invalid scheduler authentication token'
    });
    return;
  }

  // Mark request as authenticated from scheduler
  req.isScheduler = true;
  next();
};