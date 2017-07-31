import { expect } from 'chai';

import RedisSpy from '../../stub/redis/RedisSpy';
import DecoratorService from '../../../src/integration/decoratorService';

describe('Decorator Service Tests', () => {

  let redisClientSpy;
  let decoratorService;
  let redisSpy;

  beforeEach(() => {

    redisSpy = new RedisSpy();
    redisClientSpy = redisSpy.createClient();
  });

  describe('when connecting to redis', () => {

    const envBackup = {};

    beforeEach(() => {

      envBackup.HOPPER_REDIS_CONNECTION_HOST = process.env.HOPPER_REDIS_CONNECTION_HOST;
      envBackup.HOPPER_REDIS_CONNECTION_PORT = process.env.HOPPER_REDIS_CONNECTION_PORT;
    });

    afterEach(() => {

      process.env.HOPPER_REDIS_CONNECTION_HOST = envBackup.HOPPER_REDIS_CONNECTION_HOST;
      process.env.HOPPER_REDIS_CONNECTION_PORT = envBackup.HOPPER_REDIS_CONNECTION_PORT;
    });

    describe('and connection environment variables are set', () => {

      beforeEach(() => {

        process.env.HOPPER_REDIS_CONNECTION_HOST = 'aRedisHost';
        process.env.HOPPER_REDIS_CONNECTION_PORT = '12345';

        decoratorService = new DecoratorService(redisSpy);
      });

      it('sets the host from the environment', () => {

        expect(redisSpy.host).to.equal('aRedisHost');
      });

      it('sets the port from the environment', () => {

        expect(redisSpy.port).to.equal('12345');
      });
    });

    describe('and connection environment variables are not set', () => {

      beforeEach(() => {

        delete process.env.HOPPER_REDIS_CONNECTION_HOST;
        delete process.env.HOPPER_REDIS_CONNECTION_PORT;

        decoratorService = new DecoratorService(redisSpy);
      });

      it('defaults the host', () => {

        expect(redisSpy.host).to.equal('localhost');
      });

      it('defaults the port', () => {

        expect(redisSpy.port).to.equal('6379');
      });
    });
  });

  describe('when decorating a ticker', () => {

    const tickerToDecorate = {
      id: 'aadsfasfs',
      ticker: 'GOOG',
      open: '334.54',
      close: '367.89',
    };

    beforeEach(() => {

      decoratorService = new DecoratorService(redisSpy);
      decoratorService.decorateTicker(tickerToDecorate);
    });

    it('pushes a message to the task queue', () => {

      expect(redisClientSpy.lastQueueRightPushedTo).to.equal('UNDECORATED_TICKERS');
    });

    it('pushes the ticker to the task queue', () => {

      expect(redisClientSpy.lastRightPushedMessage).to.deep.equal(JSON.stringify(tickerToDecorate));
    });
  });
});
