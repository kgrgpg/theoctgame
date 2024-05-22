import { createClient } from 'redis';
import { from, Observable } from 'rxjs';
import { promisify } from 'util';

const client = createClient({
  url: `redis://${process.env.REDIS_HOST}`
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

const getAsync = promisify(client.get).bind(client) as (key: string) => Promise<string | null>;
const setAsync = promisify(client.set).bind(client) as (key: string, value: string, mode: string, duration: number) => Promise<string>;

export const getCachedData = (key: string): Observable<string | null> => from(getAsync(key));
export const setCachedData = (key: string, value: string, expiry: number): Observable<string> => from(setAsync(key, value, 'EX', expiry));
