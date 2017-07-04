
export default class DecoratorService {

  constructor(redis) {

    this.publisher = redis.createClient();
  }

  decorateTicker(ticker) {

    this.publisher.publish('UNDECORATED_TICKER_RECEIVED', ticker);
  }
}

