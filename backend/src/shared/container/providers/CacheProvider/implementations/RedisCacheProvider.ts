import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
    private client: RedisClient;

    constructor() {
        this.client = new Redis(cacheConfig.config.redis);
    }

    async put(key: string, value: any): Promise<void> {
        this.client.set(key, JSON.stringify(value));
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);

        if (!data) {
            return null;
        }

        return JSON.parse(data) as T;
    }

    async invalidate(key: string): Promise<void> {
        this.client.del(key);
    }

    async invalidateAll(prefix: string): Promise<void> {
        const keys = await this.client.keys(`${prefix}:*`);

        const pipeline = this.client.pipeline();

        keys.forEach(key => {
            pipeline.del(key);
        });

        await pipeline.exec();
    }
}
