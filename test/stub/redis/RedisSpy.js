import RedisClientSpy from '../../spy/redis/RedisclientSpy';

export default class RedisSpy {

  constructor() {

    this.redisClient = new RedisClientSpy();
  }

  createClient(host, port) {

    this.host = host;
    this.port = port;

    return this.redisClient;
  }
}
