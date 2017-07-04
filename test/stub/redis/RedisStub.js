import RedisClientSpy from '../../spy/redis/RedisclientSpy';

export default class RedisStub {

  constructor() {

    this.redisClient = new RedisClientSpy();
  }

  createClient() {

    return this.redisClient;
  }
}