import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';
import { of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Token is required');
  }
  verifyToken(token).pipe(
    switchMap(decoded => {
      req.user = decoded;
      next();
      return of(null);
    }),
    catchError(err => {
      res.status(401).send('Invalid token');
      return of(null);
    })
  ).subscribe();
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).send('You do not have the necessary permissions');
    }
  };
};
