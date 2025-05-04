import { Model, Document } from 'mongoose';
import _ from 'underscore';


import UserInterface from '../interfaces/UserInterface';

class UserRepository {
    private userModel: Model<UserInterface & Document>;

    constructor(userModel: Model<UserInterface & Document>) {
        this.userModel = userModel;
    }

    async getRandomUser():Promise<UserInterface & Document> {
        let user: any;

        try {
            user = await this.userModel.aggregate([
                { $sample: { size: 1 } }
              ]);
        } catch (err) {
            throw new Error('Failed to register User');
        }

        return user;
    }
}

export default UserRepository;