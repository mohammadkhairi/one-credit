// config.ts
import EnvironmentConfig from '../types/EnvironmentType'

const environments: Record<string, EnvironmentConfig> = {
    LOCAL: {
         host: 'localhost',
        //host: '127.0.0.1',
        port: 27017,
        db: 'onecredit-app',
        username:undefined,
        password:undefined
    },
    INTEGRATION: {
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        db: process.env.MONGODB_DB,
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD
    },
    STAGING: {
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        db: process.env.MONGODB_DB,
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD
    },
    PRODUCTION: {
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        db: process.env.MONGODB_DB,
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD
    }
};

export default function getConfig(): EnvironmentConfig {
    const environment = process.env.NODE_ENV || 'LOCAL';
    return environments[environment] || environments.LOCAL;
}
