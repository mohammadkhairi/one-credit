// apiTokenKeyValidator.ts
import { Request, Response, NextFunction } from 'express';
import AuthRepository from '../repositories/AuthRepository';

const getToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts[0].toLowerCase() === 'bearer' && parts[1]) {
      return parts[1];
    }
  }
  return null;
};

export const APITokenKeyValidator = (authRepository: AuthRepository) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const apiKey = getToken(req);

    const isValid = apiKey ? await authRepository.validateAPIKey(apiKey) : false;

    if (!isValid) {
      res.status(401).send("Invalid API Token");
      return; // important: avoid returning the Response object
    }

    next();
  };
};
