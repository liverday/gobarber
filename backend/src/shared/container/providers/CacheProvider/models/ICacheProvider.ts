export default interface ICacheProvider {
    put(key: string, value: any): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    invalidate(key: string): Promise<void>;
    invalidateAll(prefix: string): Promise<void>;
}
