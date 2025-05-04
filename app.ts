import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import getConfig from './configs/mongoose';
import generateMongoUri from './configs/mongoose_uri';

import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import path from 'path';

const app: Express = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set up MongoDB connection
const dbURI = generateMongoUri(getConfig());
const db = mongoose.createConnection(dbURI);

app.use(express.static(path.join(__dirname, 'public')));

// Handle open connection and set up routes
db.once('open', () => {
    console.log('MongoDB connected successfully');
    
    // Pass the db connection and model to the authRoute
    const router = express.Router();
    authRoute(router, db);
    userRoute(router, db);

    // Use the router with the Express app
    app.use(router);
});

// Error handling middleware (optional)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send('Something went wrong!');
});



export {app, db} ;
