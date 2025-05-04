import { Request, Response } from 'express';
import { getRandomUser } from '../../controllers/userController';
import UserRepository from '../../repositories/UserRepository';

describe('getRandomUser Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let userRepository: Partial<UserRepository>;

  const statusMock = jest.fn();
  const jsonMock = jest.fn();
  const sendMock = jest.fn();

  beforeEach(() => {
    req = {};
    res = {
      status: statusMock.mockReturnThis(),
      json: jsonMock,
      send: sendMock,
    };

    jest.clearAllMocks();
  });

  it('should respond with 201 and user data on success', async () => {
    const fakeUser = { id: 'u1', name: 'Test User' };
    userRepository = {
      getRandomUser: jest.fn().mockResolvedValue(fakeUser),
    };

    await getRandomUser(userRepository as UserRepository)(
      req as Request,
      res as Response
    );

    expect(userRepository.getRandomUser).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(fakeUser);
  });

  it('should respond with 500 and error message on failure', async () => {
    userRepository = {
      getRandomUser: jest.fn().mockRejectedValue(new Error('DB error')),
    };

    await getRandomUser(userRepository as UserRepository)(
      req as Request,
      res as Response
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(sendMock).toHaveBeenCalledWith('Failed to retrieved random user');
  });
});
