import { Router } from 'express';
import { register, login, profile } from '../controllers/authController';
import AuthRepository from '../repositories/AuthRepository';
import { APITokenKeyValidator } from '../middlewares/APITokenKeyValidator';
import { userModel } from '../models/userModel';

const authRoute = async (router: Router, db: any): Promise<void> => {
  const UserModel = userModel(db);
  const authRepository = new AuthRepository(UserModel);

  router.post('/api/auth/register', register(authRepository));
  router.post('/api/auth/login', login(authRepository));
  router.get(
    '/api/auth/profile',
    APITokenKeyValidator(authRepository),
    profile(authRepository)
  );
};

export default authRoute;
