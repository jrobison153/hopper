import uuid from 'uuid';

export default class DecoratorService {

  constructor(redis) {

    this.publisher = redis.createClient();
  }

  decorateTicker(ticker) {

    const timestamp = new Date();

    const event = {
      id: uuid.v4(),
      createdTime: timestamp.getTime(),
      createdTimePretty: timestamp.toUTCString(),
      eventType: 'UNDECORATED_TICKER_RECEIVED',
      payload: ticker,
    };

    this.publisher.publish('DECORATION', event);
  }
}

