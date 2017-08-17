

export default class DecoratorServiceSpy {

  constructor() {

    this.tickersSentForDecoration = [];
    this.beginProcessingNotificationSent = false;
    this.beginProcessingNotificationSentId = '';
  }

  decorateTicker(ticker) {

    this.tickersSentForDecoration.push(ticker);
  }

  sendBeginProcessingNotification(id) {

    this.beginProcessingNotificationSent = true;
    this.beginProcessingNotificationSentId = id;
  }

  /* methods below this comment are for spy purposes only and not part of the module being spied on
   */

  getTickersSentForDecoration() {

    return this.tickersSentForDecoration;
  }
}
