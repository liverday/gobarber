import { RedisOptions } from 'ioredis';

interface ICacheConfig {
    config: {
        redis: RedisOptions;
    };
}

export default {
    config: {
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
        },
    },
} as ICacheConfig;
