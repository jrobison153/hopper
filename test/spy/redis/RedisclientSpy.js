
export default class RedisClientSpy {

  constructor() {

    this.lastEventPayload = undefined;
    this.lastChannelPublishedTo = undefined;
  }

  publish(channel, data) {

    this.lastEventPayload = data;
    this.lastChannelPublishedTo = channel;
  }

  getLastTickerEvent() {

    return this.lastEventPayload;
  }

  getLastChannelPublishedTo() {

    return this.lastChannelPublishedTo;
  }
}