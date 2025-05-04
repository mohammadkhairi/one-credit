import userRoute from '../../routes/userRoute';
import { Router } from 'express';
import * as userController from '../../controllers/userController';
import * as middleware from '../../middlewares/APITokenKeyValidator';
import * as model from '../../models/userModel';
import AuthRepository from '../../repositories/AuthRepository';
import UserRepository from '../../repositories/UserRepository';

jest.mock('../../controllers/userController');
jest.mock('../../middlewares/APITokenKeyValidator');
jest.mock('../../repositories/AuthRepository');
jest.mock('../../repositories/UserRepository');
jest.mock('../../models/userModel');

describe('user Route', () => {
  let router: any;
  const mockDb = {}; // dummy DB

  beforeEach(() => {
    router = {
      get: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should register /api/user/random route with middleware and controller', async () => {
    const mockUserModel = {};
    const mockAuthRepoInstance = {} as AuthRepository;
    const mockUserRepoInstance = {} as UserRepository;
    const mockMiddleware = jest.fn();
    const mockController = jest.fn();

    // Mocks
    (model.userModel as jest.Mock).mockReturnValue(mockUserModel);
    (AuthRepository as jest.Mock).mockImplementation(() => mockAuthRepoInstance);
    (UserRepository as jest.Mock).mockImplementation(() => mockUserRepoInstance);
    (middleware.APITokenKeyValidator as jest.Mock).mockReturnValue(mockMiddleware);
    (userController.getRandomUser as jest.Mock).mockReturnValue(mockController);

    await userRoute(router, mockDb);

    expect(model.userModel).toHaveBeenCalledWith(mockDb);
    expect(AuthRepository).toHaveBeenCalledWith(mockUserModel);
    expect(UserRepository).toHaveBeenCalledWith(mockUserModel);
    expect(middleware.APITokenKeyValidator).toHaveBeenCalledWith(mockAuthRepoInstance);
    expect(userController.getRandomUser).toHaveBeenCalledWith(mockUserRepoInstance);
    expect(router.get).toHaveBeenCalledWith(
      '/api/user/random',
      mockMiddleware,
      mockController
    );
  });

  it('should not register route if userModel throws error', async () => {
    (model.userModel as jest.Mock).mockImplementation(() => {
      throw new Error('DB init failed');
    });
  
    await expect(userRoute(router, mockDb)).rejects.toThrow('DB init failed');
    expect(router.get).not.toHaveBeenCalled();
  });
  
  it('should not register route if APITokenKeyValidator throws', async () => {
    const mockUserModel = {};
    (model.userModel as jest.Mock).mockReturnValue(mockUserModel);
    (AuthRepository as jest.Mock).mockImplementation(() => ({}));
    (UserRepository as jest.Mock).mockImplementation(() => ({}));
    (middleware.APITokenKeyValidator as jest.Mock).mockImplementation(() => {
      throw new Error('Middleware setup error');
    });
  
    await expect(userRoute(router, mockDb)).rejects.toThrow('Middleware setup error');
    expect(router.get).not.toHaveBeenCalled();
  });
  
  it('should not register route if getRandomUser throws', async () => {
    const mockUserModel = {};
    (model.userModel as jest.Mock).mockReturnValue(mockUserModel);
    (AuthRepository as jest.Mock).mockImplementation(() => ({}));
    (UserRepository as jest.Mock).mockImplementation(() => ({}));
    (middleware.APITokenKeyValidator as jest.Mock).mockReturnValue(jest.fn());
    (userController.getRandomUser as jest.Mock).mockImplementation(() => {
      throw new Error('Controller setup error');
    });
  
    await expect(userRoute(router, mockDb)).rejects.toThrow('Controller setup error');
    expect(router.get).not.toHaveBeenCalled();
  })
});
