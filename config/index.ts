import { join } from 'path'
import { merge } from 'lodash';
import configSchema from './config.schema'
import devConfig from './config.dev'
import prodConfig from './config.prod'
import testConfig from './config.test'

let config: Record<string, any> = {};

switch (process.env.NODE_ENV) {
  case 'production':
    config =prodConfig();
    break;
  case 'test':
    config = testConfig();
    break;
  default:
    config = devConfig();
    break;
}

export default (): Record<string, any> => {
    const baseConfig = {
        appName: 'MyApp',
        port: 8000,
        database: {
            host: 'localhost',
            port: 5432,
            username: 'user',
            password: 'password',
            dbName: 'myapp_db',
        },
        security: {
            jwtSecret: 'your_jwt_secret',
            saltRounds: 10,
        },
    };
    const mergedConfig = merge(baseConfig, config);
    return configSchema.parse(mergedConfig);
};