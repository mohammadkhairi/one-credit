import mongoose, { Document, Schema, Model } from 'mongoose';
import UserInterface from '../interfaces/UserInterface';
// Interface for user document

// Create the user schema
const userSchema = new Schema<UserInterface>(
    {
        name: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        status: { type: String, required: true },
        api_token: { type: String, required: true }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        toJSON: {
            transform: function (doc: UserInterface, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
);


const userModel = (connection: mongoose.Connection): Model<UserInterface> => {
    return connection.model<UserInterface>('users', userSchema);
};

// Export the model and schema
export { userModel, userSchema };
