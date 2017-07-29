import { expect } from 'chai';

import mongoTickerSource from '../../../src/io/mongoTickerSource';
import mongodb from '../../stub/mongo/TickersWithoutChromosomeMongoStub';

describe('MongoTicker Data Source Tests', () => {

  describe('When connecting to mongo', () => {

    const envBackup = {};

    before(() => {

      envBackup.MONGO_CONNECTION_DATABASE = process.env.MONGO_CONNECTION_DATABASE;

      process.env.MONGO_CONNECTION_DATABASE = 'aSuperDatabase';
    });

    after(() => {

      process.env.MONGO_CONNECTION_DATABASE = envBackup.MONGO_CONNECTION_DATABASE;
    });

    it('Then the database to connect to is determined by the environment', () => {


      return mongoTickerSource.connect(mongodb).then(() => {

        const connectionString = mongodb.MongoClient.getConnectionUrl();
        const connectionStringPathBits = connectionString.split('/');
        const databaseConnectedTo = connectionStringPathBits[connectionStringPathBits.length - 1];

        expect(databaseConnectedTo).to.equal('aSuperDatabase');
      });
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
