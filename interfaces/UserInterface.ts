import { Document } from 'mongoose';

export default interface UserInterface extends Document {
    name: string;
    password: string;
    status: string;
    email: string;
    api_token: String; // Use the correct type for messages (e.g., IuserMessage)
    created_at: Date;
    updated_at: Date;
}

