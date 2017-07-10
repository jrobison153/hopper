import { expect } from 'chai';

import RedisStub from '../../stub/redis/RedisStub';
import DecoratorService from '../../../src/integration/decoratorService';

describe('Decorator Service Tests', () => {

  describe('when decorating a ticker', () => {

    const MAX_MILLISECONDS_IN_ONE_SECOND = 1000;

    const tickerToDecorate = {
      id: 'aadsfasfs',
      ticker: 'GOOG',
      open: '334.54',
      close: '367.89',
    };

    let redisClientSpy;
    let lastEvent;

    beforeEach(() => {

      const redisStub = new RedisStub();
      redisClientSpy = redisStub.createClient();

      const decoratorService = new DecoratorService(redisStub);
      decoratorService.decorateTicker(tickerToDecorate);

      lastEvent = redisClientSpy.getLastTickerEvent();
    });

    it('emits an event with the event type set', () => {

      expect(lastEvent.eventType).to.equal('UNDECORATED_TICKER_RECEIVED');
    });

    it('emits an the event with the ticker as the payload', () => {

      expect(lastEvent.payload).to.deep.equal(tickerToDecorate);
    });

    it('emits the event with a unique id', () => {

      expect(lastEvent.id).to.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{10}/);
    });

    it('emits the event with a creation timestamp', () => {

      // eslint-disable-next-line no-unused-expressions
      expect(lastEvent.createdTime).to.not.be.undefined;
    });

    it('emits the event with a human readable creation timestamp', () => {

      const prettyTimeAsTime = Date.parse(lastEvent.createdTimePretty);
      const timeDifference = lastEvent.createdTime - prettyTimeAsTime;

      expect(timeDifference).to.be.below(MAX_MILLISECONDS_IN_ONE_SECOND);
    });

    it('emits the event on the right channel', () => {

      expect(redisClientSpy.getLastChannelPublishedTo()).to.equal('DECORATION');
    });
  });
});
