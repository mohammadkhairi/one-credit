// controllers/userController.ts
import { Request, Response } from 'express';
import AuthRepository from '../repositories/AuthRepository';

// You can inject the repository via constructor for better testability
export const register = (authRepository: AuthRepository) => async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await authRepository.register(req.body);
        res.status(201).json(user);
    } catch (err) {
    
        res.status(500).json('Error registering user');
    }
};

export const profile = (authRepository: AuthRepository) => async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.query.email as string; 

        const param = {
            email : email
        };

        const user = await authRepository.getProfileByParam(param);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const login = (authRepository: AuthRepository) => async (req: Request, res: Response): Promise<void> => {
    try {

        const user = await authRepository.login(req.body.email, req.body.password);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json('Failed to logged');
    }
};
