import redis from 'redis';
import { from } from 'rxjs';
import { promisify } from 'util';

const client = redis.createClient({ host: process.env.REDIS_HOST });
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

client.on('error', (err) => {
  console.error('Redis error:', err);
});

export const getCachedData = (key: string) => from(getAsync(key));
export const setCachedData = (key: string, value: string, expiry: number) => from(setAsync(key, value, 'EX', expiry));
