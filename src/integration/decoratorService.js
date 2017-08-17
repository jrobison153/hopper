export default class DecoratorService {

  constructor(redis, retryStrategy) {

    let host = 'localhost';

    if (process.env.HOPPER_REDIS_CONNECTION_HOST) {

      host = process.env.HOPPER_REDIS_CONNECTION_HOST;
    }

    let port = '6379';

    if (process.env.HOPPER_REDIS_CONNECTION_PORT) {

      port = process.env.HOPPER_REDIS_CONNECTION_PORT;
    }

    this.redisClient = redis.createClient(port, host, { retry_strategy: retryStrategy });
  }

  decorateTicker(ticker) {

    this.redisClient.rpush('UNDECORATED_TICKERS', JSON.stringify(ticker));
  }

  sendBeginProcessingNotification(id) {

    const event = {
      name: 'BATCH_TICKER_PROCESSING_STARTED',
      payload: {
        id,
      },
    };

    this.redisClient.publish('TICKER_BATCH_PROCESSING', event);
  }
}

