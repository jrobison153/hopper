import RedisClientSpy from '../../spy/redis/RedisclientSpy';

export default class RedisSpy {

  constructor() {

    this.redisClient = new RedisClientSpy();
  }

  createClient(port, host, options) {

    this.port = port;
    this.host = host;
    this.retryStrategy = options.retry_strategy;

    return this.redisClient;
  }

  getClient() {

    return this.redisClient;
  }
}
