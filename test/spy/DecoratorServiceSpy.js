

export default class DecoratorServiceSpy {

  constructor() {

    this.tickersSentForDecoration = [];
  }

  decorateTicker(ticker) {

    this.tickersSentForDecoration.push(ticker);
  }

  /* methods below this comment are for spy purposes only and not part of the module being spied on
   */

  getTickersSentForDecoration() {

    return this.tickersSentForDecoration;
  }
}
