
export default class RedisClientSpy {

  rpush(queueName, message) {

    this.lastQueueRightPushedTo = queueName;
    this.lastRightPushedMessage = message;
  }

  publish(topicName, event) {

    this.lastPublishedEvent = event;
    this.lastTopicPublishedTo = topicName;
  }
}
