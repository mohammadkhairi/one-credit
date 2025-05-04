import assert from 'assert';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import { Model, Document } from 'mongoose';
import _ from 'underscore';

import UserInterface from '../interfaces/UserInterface';


class AuthRepository {
    private userModel: Model<UserInterface & Document>;

    constructor(userModel: Model<UserInterface & Document>) {
        this.userModel = userModel;
    }

    // Register Method with Assertions
    async register(param: any): Promise<UserInterface & Document> {
        // Ensure 'param' contains required fields
        assert(param, 'param must be an object');
        assert(typeof param.password === 'string', 'Password must be a string');
        assert(typeof param.email === 'string', 'Email must be a string');
        
        let user: any;

        // Add generated API token and hash the password
        param = {
            ...param,
            api_token: this.generateRandomString(32),
            password: bcrypt.hashSync(param.password, 10),
            status:'A'
        };

        try {
            user = await this.userModel.create(param);
        } catch (err) {
            throw new Error('Failed to register User');
        }

        return user;
    }

    // Login Method with Assertions
    async login(email: String, password: String): Promise<UserInterface & Document> {
        assert(typeof email === 'string', 'Email is required and must be a string');
        assert(typeof password === 'string', 'Password is required and must be a string');

        let user: any;

        try {
            user = await this.userModel.findOne({ email: email });
        } catch (err) {
            throw new Error('Error finding user by Email: ' + (err as Error).message);
        }
       
        if (!user || _.isEmpty(user)) {
            throw new Error('User not found with provided Email');
        }

        const isMatch = await bcrypt.compare(password.toString(), user.password.toString());

        if (!isMatch) {
            throw new Error('User not found with provided Password');
        }

        return user as UserInterface;
    }

    // Get Profile by Param with Assertions
    async getProfileByParam(param: any): Promise<UserInterface & Document> {
        // Ensure 'param' is an object and contains valid key(s)
        assert(param && typeof param === 'object', 'param must be an object');
        assert(param.api_token || param.email, 'API token or Email must be provided');
        
        let user: any;

        try {
            user = await this.userModel.findOne(param);
        } catch (err) {
            throw new Error('Error finding user by API token: ' + (err as Error).message);
        }

        if (!user || _.isEmpty(user)) {
            throw new Error('User not found with provided Email');
        }

        return user as UserInterface;
    }

    // Validate API Key with Assertions
    async validateAPIKey(api_token: String): Promise<UserInterface & Document> {
        assert(typeof api_token === 'string', 'API token must be a string');

        let user: any;

        try {
            user = await this.userModel.exists({ api_token: api_token });
        } catch (err) {
            throw new Error('Error finding API token: ' + (err as Error).message);
        }

        if (!user || _.isEmpty(user)) {
            throw new Error('User not found with provided API token');
        }

        return user as UserInterface;
    }

    // Utility function to generate a random string
    generateRandomString(length: number): string {
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }
}

export default AuthRepository;
