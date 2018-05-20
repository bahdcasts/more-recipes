import { createClient } from 'then-redis';
//  import FakeRedis from './redis/fakeRedis';
/**
 * Create a new client redis
 * @returns {object} fake-redis client for testing and real redis-client in production
 */
const getRedisClient = () => {
  if (process.env.NODE_ENV === 'production') {
    return createClient(process.env.REDIS_URL);
  }

  return createClient();
};


export default getRedisClient();
