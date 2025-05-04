import { Router } from 'express';
import { getRandomUser } from '../controllers/userController';

import { APITokenKeyValidator } from '../middlewares/APITokenKeyValidator';

import { userModel } from '../models/userModel';

import AuthRepository from '../repositories/AuthRepository';
import UserRepository from '../repositories/UserRepository';

const authRoute = async (router: Router, db: any): Promise<void> => {
  const UserModel = userModel(db);
  const authRepository = new AuthRepository(UserModel);
  const userRepository = new UserRepository(UserModel);

  router.get(
    '/api/user/random',
    APITokenKeyValidator(authRepository),
    getRandomUser(userRepository)
  );
};

export default authRoute;
