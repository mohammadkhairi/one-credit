import request from 'supertest';
import express from 'express';
import { register, profile, login } from '../../controllers/authController';
import { Model } from 'mongoose';
import AuthRepository from '../../repositories/AuthRepository';

// Mock the AuthRepository class methods
jest.mock('../../repositories/AuthRepository');

jest.mock('mongoose', () => ({
  Model: {
    create: jest.fn(),
    findOne: jest.fn(),
    exists: jest.fn(),
  },
}));


const app = express();
app.use(express.json());

// Happy path tests
describe('Auth Controller', () => {
    let authRepository: AuthRepository;
    let mockUserModel: any;

    beforeEach(() => {
        mockUserModel = Model;
        authRepository = new AuthRepository(mockUserModel);
    });

    // Happy path test for register
    describe('POST /register', () => {
        it('should register a user successfully', async () => {
            // Mock the register function to return a mock user
            authRepository.register = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' });

            // Register the route handler
            app.post('/register', register(authRepository));

            const response = await request(app).post('/register').send({
                email: 'test@example.com',
                password: 'password123'
            });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: 1, email: 'test@example.com' });
        });

        it('should return an error when registration fails', async () => {
            authRepository.register = jest.fn().mockRejectedValue(new Error('Registration failed'));

            app.post('/register', register(authRepository));

            const response = await request(app).post('/register').send({
                email: 'test@example.com',
                password: 'password123'
            });

            expect(response.status).toBe(500);
            expect(response.body).toBe('Error registering user');
        });
    });

    // Happy path test for profile
    describe('GET /profile', () => {
        it('should retrieve user profile successfully', async () => {
            authRepository.getProfileByParam = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' });

            app.get('/profile', profile(authRepository));

            const response = await request(app).get('/profile').send({
                id: 1
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ id: 1, email: 'test@example.com' });
        });

        it('should return an error when getting the profile fails', async () => {
            authRepository.getProfileByParam = jest.fn().mockRejectedValue(new Error('Failed to retrieve profile'));

            app.get('/profile', profile(authRepository));

            const response = await request(app).get('/profile').send({
                id: 1
            });

            expect(response.status).toBe(500);
            expect(response.body).toBe('Failed to retrieved User');
        });
    });

    // Happy path test for login
    describe('POST /login', () => {
        it('should login user successfully', async () => {
            authRepository.login = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' });

            app.post('/login', login(authRepository));

            const response = await request(app).post('/login').send({
                email: 'test@example.com',
                password: 'password123'
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ id: 1, email: 'test@example.com' });
        });

        it('should return an error when login fails', async () => {
            authRepository.login = jest.fn().mockRejectedValue(new Error('Invalid credentials'));

            app.post('/login', login(authRepository));

            const response = await request(app).post('/login').send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

            expect(response.status).toBe(500);
            expect(response.body).toBe('Failed to logged');
        });
    });
});
