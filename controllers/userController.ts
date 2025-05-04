// controllers/userController.ts
import { Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';

export const getRandomUser = (userRepository: UserRepository) => async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userRepository.getRandomUser();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json("Failed to retrieved random user");
    }
};
