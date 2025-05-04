import AuthRepository from '../../repositories/AuthRepository'; // Adjust the import path
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Mocking the User model
jest.mock('mongoose', () => ({
  Model: {
    create: jest.fn(),
    findOne: jest.fn(),
    exists: jest.fn(),
  },
}));

describe('AuthRepository', () => {
  let mockUserModel: any;
  let authRepo: AuthRepository;

  beforeEach(() => {
    mockUserModel = Model;
    authRepo = new AuthRepository(mockUserModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Happy test: Successful user registration
  it('should register a user successfully', async () => {
    const fakeUser = {
      email: 'test@example.com',
      password: 'password123',
      api_token: 'aaaaaa',
      name: 'NAME'
    };

    const createdUser = { ...fakeUser, _id: '123' };

    mockUserModel.create.mockResolvedValue(createdUser);

    const result = await authRepo.register(fakeUser);

    // expect(mockUserModel.create).toHaveBeenCalledWith({
    //   ...fakeUser
    // });
    expect(result.name).toEqual(createdUser.name);
  });

  // Unhappy test: Registration fails
  it('should throw an error if user registration fails', async () => {
    const fakeUser = {
      email: 'test@example.com',
      password: 'password123',
    };

    mockUserModel.create.mockRejectedValue(new Error('DB error'));

    await expect(authRepo.register(fakeUser)).rejects.toThrow('Failed to register User');
  });

  // Happy test: Successful user login
  it('should login successfully with valid credentials', async () => {
    const fakeUser = {
      email: 'test@example.com',
      password: 'password123',
      _id: '123',
    };

    const hashedPassword = bcrypt.hashSync(fakeUser.password, 10);
    mockUserModel.findOne.mockResolvedValue({
      ...fakeUser,
      password: hashedPassword,
    });

    const result = await authRepo.login(fakeUser.email, fakeUser.password);

    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: fakeUser.email });
    expect(result.email).toEqual(fakeUser.email);
  });

  // Unhappy test: Login with incorrect password
  it('should throw an error if password is incorrect during login', async () => {
    const fakeUser = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    mockUserModel.findOne.mockResolvedValue({
      ...fakeUser,
      password: bcrypt.hashSync('password123', 10),
    });

    await expect(authRepo.login(fakeUser.email, fakeUser.password)).rejects.toThrow(
      'User not found with provided Password'
    );
  });

  // Unhappy test: Login with non-existing email
  it('should throw an error if user does not exist during login', async () => {
    const fakeUser = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    mockUserModel.findOne.mockResolvedValue(null);

    await expect(authRepo.login(fakeUser.email, fakeUser.password)).rejects.toThrow(
      'User not found with provided Email'
    );
  });

  // Happy test: Get user profile by API token
  it('should return user profile if API token is valid', async () => {
    const fakeUser = {
      email: 'test@example.com',
    };

    mockUserModel.findOne.mockResolvedValue(fakeUser);

    const result = await authRepo.getProfileByParam({ api_token: 'valid_api_token' });

    expect(mockUserModel.findOne).toHaveBeenCalledWith({ api_token: 'valid_api_token' });
    expect(result).toEqual(fakeUser);
  });


  // Unhappy test: Validate API key fails (invalid API token)
  it('should throw an error if API key is invalid', async () => {
    mockUserModel.exists.mockResolvedValue(false);

    await expect(authRepo.validateAPIKey('invalid_api_token')).rejects.toThrow(
      'User not found with provided API token'
    );
  });
});
