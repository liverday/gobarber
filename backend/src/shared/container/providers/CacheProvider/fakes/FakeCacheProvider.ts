import ICacheProvider from '../models/ICacheProvider';

type ICache = {
    [key: string]: any;
};

export default class FakeCacheProvider implements ICacheProvider {
    public cache: ICache = {};

    public async put(key: string, value: any): Promise<void> {
        this.cache[key] = value;
    }

    public async get<T>(key: string): Promise<T | null> {
        const data = this.cache[key];

        if (!data) {
            return null;
        }

        return data as T;
    }

    public async invalidate(key: string): Promise<void> {
        delete this.cache[key];
    }

    public async invalidateAll(prefix: string): Promise<void> {
        const keys = Object.keys(this.cache).filter(key =>
            key.startsWith(`${prefix}:`),
        );

        keys.forEach(key => {
            delete this.cache[key];
        });
    }
}
