import { expect } from 'chai';

import mongoTickerSource from '../../../src/io/mongoTickerSource';
import mongodb from '../../stub/mongo/TickersWithoutChromosomeMongoStub';
import connectionRefusedMongoDb from '../../stub/mongo/ConnectionRefusedMongoDatabaseStub';

describe('MongoTicker Data Source Tests', () => {

  describe('When connecting to mongo', () => {

    const envBackup = {};
    const connectionUrlRegEx = /mongodb:\/\/(.+):([0-9]+)\/(.+)/;

    beforeEach(() => {

      envBackup.MONGO_CONNECTION_DATABASE = process.env.MONGO_CONNECTION_DATABASE;
      envBackup.MONGO_CONNECTION_HOST = process.env.MONGO_CONNECTION_HOST;
      envBackup.MONGO_CONNECTION_PORT = process.env.MONGO_CONNECTION_PORT;

      process.env.MONGO_CONNECTION_DATABASE = 'aSuperDatabase';
      process.env.MONGO_CONNECTION_HOST = 'somehost';
      process.env.MONGO_CONNECTION_PORT = '76543';
    });

    afterEach(() => {

      process.env.MONGO_CONNECTION_HOST = envBackup.MONGO_CONNECTION_HOST;
      process.env.MONGO_CONNECTION_DATABASE = envBackup.MONGO_CONNECTION_DATABASE;
      process.env.MONGO_CONNECTION_PORT = envBackup.MONGO_CONNECTION_PORT;

      connectionRefusedMongoDb.reset();
    });

    it('defaults the database to connect to if the environment hasn\'t specified it', () => {

      delete process.env.MONGO_CONNECTION_DATABASE;

      return mongoTickerSource.connect(mongodb).then(() => {

        const connectionString = mongodb.MongoClient.getConnectionUrl();

        const databaseConnectedTo = connectionString.match(connectionUrlRegEx)[3];

        expect(databaseConnectedTo).to.equal('testStockData');
      });
    });

    it('defaults the database host if the environment hasn\'t specified it', () => {

      delete process.env.MONGO_CONNECTION_HOST;

      return mongoTickerSource.connect(mongodb).then(() => {

        const connectionString = mongodb.MongoClient.getConnectionUrl();

        const databaseConnectedTo = connectionString.match(connectionUrlRegEx)[1];

        expect(databaseConnectedTo).to.equal('localhost');
      });
    });

    it('defaults the database port if the environment hasn\'t specified it', () => {

      delete process.env.MONGO_CONNECTION_PORT;

      return mongoTickerSource.connect(mongodb).then(() => {

        const connectionString = mongodb.MongoClient.getConnectionUrl();

        const databaseConnectedTo = connectionString.match(connectionUrlRegEx)[2];

        expect(databaseConnectedTo).to.equal('27017');
      });
    });

    it('gets the database to connect to from the environment', () => {

      return mongoTickerSource.connect(mongodb).then(() => {

        const connectionString = mongodb.MongoClient.getConnectionUrl();

        const databaseConnectedTo = connectionString.match(connectionUrlRegEx)[3];

        expect(databaseConnectedTo).to.equal('aSuperDatabase');
      });
    });

    it('gets the connection host from the environment', () => {

      return mongoTickerSource.connect(mongodb).then(() => {

        const connectionString = mongodb.MongoClient.getConnectionUrl();

        const hostConnctedTo = connectionString.match(connectionUrlRegEx)[1];

        expect(hostConnctedTo).to.equal('somehost');
      });
    });

    it('gets the connection port from the environment', () => {

      return mongoTickerSource.connect(mongodb).then(() => {

        const connectionString = mongodb.MongoClient.getConnectionUrl();

        const hostConnctedTo = connectionString.match(connectionUrlRegEx)[2];

        expect(hostConnctedTo).to.equal('76543');
      });
    });

    describe('and the mongo connection is refused', () => {

      it('attempts to connect the maximum  number of times before giving up', () => {

        return mongoTickerSource.connect(connectionRefusedMongoDb, 3).catch(() => {

          expect(connectionRefusedMongoDb.MongoClient.numberOfTimesConnectCalled).to.equal(3);
        });
      }).timeout(10000);
    });
  });

  describe('Given connection to a mongo database', () => {

    before(() => {

      return mongoTickerSource.connect(mongodb);
    });

    after(() => {

      mongoTickerSource.disconnect();
    });

    describe('When getting tickers without a chromosome', () => {

      it('Then only tickers w/o a chromosome are returned', () => {

        mongoTickerSource.getTickersWithoutChromosome();

        const collectionSpy = mongodb.MongoClient.getDatabase().collection();
        const findQuery = collectionSpy.getLastFindQuery();

        expect(findQuery.chromosome.$exists).to.equal(false);
      });

      it('Then a stream of tickers is returned', () => {

        const expectedTickers = [
          { _id: '1111', ticker: 'GOOG' },
          { _id: '1112', ticker: 'C' },
          { _id: '1113', tikcer: 'PVH' },
        ];

        const tickerStream = mongoTickerSource.getTickersWithoutChromosome();

        return new Promise((resolve) => {

          const actualTickers = [];

          tickerStream.on('data', (aTicker) => {
            actualTickers.push(aTicker);
          });

          tickerStream.on('end', () => {
            resolve(actualTickers);
          });
        }).then((actualTickers) => {

          expect(actualTickers).to.have.length(3);

          expectedTickers.forEach((ticker) => {
            expect(actualTickers).to.deep.include(ticker);
          });
        });
      });
    });
  });
});
