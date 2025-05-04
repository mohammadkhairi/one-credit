import { Router } from 'express';
import authRoute from '../../routes/authRoute';
import AuthRepository from '../../repositories/AuthRepository';
import * as controller from '../../controllers/authController';
import * as middleware from '../../middlewares/APITokenKeyValidator';
import * as model from '../../models/userModel';

jest.mock('../../controllers/authController');
jest.mock('../../middlewares/APITokenKeyValidator');
jest.mock('../../repositories/AuthRepository');
jest.mock('../../models/userModel');

describe('authRoute', () => {
  let router: any;
  const mockDb = {}; // dummy DB object

  beforeEach(() => {
    // Mock router methods
    router = {
      post: jest.fn(),
      get: jest.fn(),
    };

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should register /register, /login and /profile routes with correct handlers', async () => {
    const mockUserModel = jest.fn();
    const mockRegisterHandler = jest.fn();
    const mockLoginHandler = jest.fn();
    const mockProfileHandler = jest.fn();
    const mockValidatorMiddleware = jest.fn();

    // Mock userModel to return a fake model
    (model.userModel as jest.Mock).mockReturnValue(mockUserModel);

    // Mock AuthRepository constructor to return a mock instance
    const authRepoInstance = {} as AuthRepository;
    (AuthRepository as jest.Mock).mockImplementation(() => authRepoInstance);

    // Mock controller handlers
    (controller.register as jest.Mock).mockReturnValue(mockRegisterHandler);
    (controller.login as jest.Mock).mockReturnValue(mockLoginHandler);
    (controller.profile as jest.Mock).mockReturnValue(mockProfileHandler);

    // Mock middleware
    (middleware.APITokenKeyValidator as jest.Mock).mockReturnValue(mockValidatorMiddleware);

    // Call the route registration function
    await authRoute(router, mockDb);

    // Assert router.post and router.get calls
    expect(router.post).toHaveBeenCalledWith('/api/auth/register', mockRegisterHandler);
    expect(router.post).toHaveBeenCalledWith('/api/auth/login', mockLoginHandler);
    expect(router.get).toHaveBeenCalledWith(
      '/api/auth/profile',
      mockValidatorMiddleware,
      mockProfileHandler
    );

    // Assert userModel and AuthRepository were called
    expect(model.userModel).toHaveBeenCalledWith(mockDb);
    expect(AuthRepository).toHaveBeenCalledWith(mockUserModel);
  });

  it('should fail if userModel throws an error', async () => {
    (model.userModel as jest.Mock).mockImplementation(() => {
      throw new Error('userModel failed');
    });
  
    await expect(authRoute(router, mockDb)).rejects.toThrow('userModel failed');
    expect(router.post).not.toHaveBeenCalled();
    expect(router.get).not.toHaveBeenCalled();
  });
  
  it('should fail if AuthRepository throws an error', async () => {
    (model.userModel as jest.Mock).mockReturnValue({});
    (AuthRepository as jest.Mock).mockImplementation(() => {
      throw new Error('AuthRepository failed');
    });
  
    await expect(authRoute(router, mockDb)).rejects.toThrow('AuthRepository failed');
    expect(router.post).not.toHaveBeenCalled();
    expect(router.get).not.toHaveBeenCalled();
  });
  
  it('should fail if APITokenKeyValidator throws an error', async () => {
    (model.userModel as jest.Mock).mockReturnValue({});
    (AuthRepository as jest.Mock).mockReturnValue({});
  
    (controller.register as jest.Mock).mockReturnValue(jest.fn());
    (controller.login as jest.Mock).mockReturnValue(jest.fn());
    (controller.profile as jest.Mock).mockReturnValue(jest.fn());
  
    (middleware.APITokenKeyValidator as jest.Mock).mockImplementation(() => {
      throw new Error('Middleware error');
    });
  
    await expect(authRoute(router, mockDb)).rejects.toThrow('Middleware error');
    expect(router.get).not.toHaveBeenCalled();
  });
  
  it('should fail if controller.profile throws during setup', async () => {
    (model.userModel as jest.Mock).mockReturnValue({});
    (AuthRepository as jest.Mock).mockReturnValue({});
  
    (controller.register as jest.Mock).mockReturnValue(jest.fn());
    (controller.login as jest.Mock).mockReturnValue(jest.fn());
  
    (middleware.APITokenKeyValidator as jest.Mock).mockReturnValue(jest.fn());
  
    (controller.profile as jest.Mock).mockImplementation(() => {
      throw new Error('Controller error');
    });
  
    await expect(authRoute(router, mockDb)).rejects.toThrow('Controller error');
    expect(router.get).not.toHaveBeenCalled();
  });
});
