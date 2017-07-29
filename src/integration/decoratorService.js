export default class DecoratorService {

  constructor(redis) {

    this.redisClient = redis.createClient();
  }

  decorateTicker(ticker) {

    this.redisClient.rpush('UNDECORATED_TICKERS', JSON.stringify(ticker));
  }
}

