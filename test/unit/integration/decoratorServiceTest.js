import { expect } from 'chai';

import RedisStub from '../../stub/redis/RedisStub';
import DecoratorService from '../../../src/integration/decoratorService';

describe('Decorator Service Tests', () => {

  describe('when decorating a ticker', () => {

    const tickerToDecorate = {
      id: 'aadsfasfs',
      ticker: 'GOOG',
      open: '334.54',
      close: '367.89',
    };

    let redisClientSpy;

    beforeEach(() => {

      const redisStub = new RedisStub();
      redisClientSpy = redisStub.createClient();

      const decoratorService = new DecoratorService(redisStub);
      decoratorService.decorateTicker(tickerToDecorate);
    });

    it('emits the ticker as an event', () => {

      expect(redisClientSpy.getLastTickerEvent()).to.deep.equal(tickerToDecorate);
    });

    it('emits the event on the right channel', () => {

      expect(redisClientSpy.getLastChannelPublishedTo()).to.equal('UNDECORATED_TICKER_RECEIVED');
    });
  });
});
