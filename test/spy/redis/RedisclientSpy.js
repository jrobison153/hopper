
export default class RedisClientSpy {

  constructor() {

    this.lastQueueRightPushedTo = undefined;
    this.lastRightPushedMessage = undefined;
  }

  rpush(queueName, message) {

    this.lastQueueRightPushedTo = queueName;
    this.lastRightPushedMessage = message;
  }
}
