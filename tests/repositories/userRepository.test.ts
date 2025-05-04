import UserRepository from '../../repositories/UserRepository'; // Adjust the import path
import { Model, Document } from 'mongoose';

// Mocking the User model
jest.mock('mongoose', () => ({
  Model: {
    aggregate: jest.fn(),
  },
}));

describe('UserRepository', () => {
  let mockUserModel: any;
  let userRepository: UserRepository;

  beforeEach(() => {
    mockUserModel = Model;
    userRepository = new UserRepository(mockUserModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Happy test: Successfully get a random user
  it('should return a random user on success', async () => {
    const fakeUser = { _id: '123', name: 'John Doe', email: 'john@example.com' };

    // Mock the aggregate method to return a random user
    mockUserModel.aggregate.mockResolvedValue([fakeUser]);

    const result = await userRepository.getRandomUser();

    expect(mockUserModel.aggregate).toHaveBeenCalledWith([
      { $sample: { size: 1 } },
    ]);
    expect(result).toEqual([fakeUser]);
  });

  // Unhappy test: Failure when the aggregate method throws an error
  it('should throw an error if getting a random user fails', async () => {
    // Mock the aggregate method to throw an error
    mockUserModel.aggregate.mockRejectedValue(new Error('Database error'));

    await expect(userRepository.getRandomUser()).rejects.toThrow(
      'Failed to register User'
    );
  });
});
