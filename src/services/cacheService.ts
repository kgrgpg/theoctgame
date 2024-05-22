import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient({ host: process.env.REDIS_HOST });

client.on('error', (err) => {
  console.error('Redis error:', err);
});

export const getAsync = promisify(client.get).bind(client);
export const setAsync = promisify(client.set).bind(client);
