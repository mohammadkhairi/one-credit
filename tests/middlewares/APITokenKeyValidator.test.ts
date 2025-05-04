import { Request, Response, NextFunction } from 'express';
import { APITokenKeyValidator } from '../../middlewares/APITokenKeyValidator';
import AuthRepository from '../../repositories/AuthRepository';

// Mocking AuthRepository
jest.mock('../../repositories/AuthRepository');

describe('APITokenKeyValidator', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: 'Bearer valid_api_token',
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockNext = jest.fn();

    // Resetting the mock behavior before each test
    mockAuthRepository = new AuthRepository({} as any) as jest.Mocked<AuthRepository>;
  });

  it('should call next() when the API token is valid', async () => {
    // Arrange: mock validateAPIKey to return true for valid API token
    mockAuthRepository.validateAPIKey = jest.fn().mockResolvedValue(true);

    const middleware = APITokenKeyValidator(mockAuthRepository);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert: verify that next() is called when the token is valid
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled(); // 401 should not be triggered
  });

  it('should return 401 and an error message when the API token is invalid', async () => {
    // Arrange: mock validateAPIKey to return false for invalid API token
    mockAuthRepository.validateAPIKey = jest.fn().mockResolvedValue(false);

    const middleware = APITokenKeyValidator(mockAuthRepository);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert: verify that 401 is returned for an invalid API token
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith('Invalid API Token');
    expect(mockNext).not.toHaveBeenCalled(); // next() should not be called on invalid token
  });

  it('should return 401 and an error message when no API token is provided', async () => {
    // Arrange: request without authorization header
    mockRequest = { headers: {} };

    const middleware = APITokenKeyValidator(mockAuthRepository);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert: verify that 401 is returned for missing API token
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith('Invalid API Token');
    expect(mockNext).not.toHaveBeenCalled(); // next() should not be called on missing token
  });
});
