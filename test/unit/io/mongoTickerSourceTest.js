import { expect } from 'chai';

import mongoTickerSource from '../../../src/io/mongoTickerSource';
import mongodb from '../../stub/mongo/TickersWithoutChromosomeMongoStub';

describe('MongoTicker Data Source Tests', () => {

  before(() => {

    return mongoTickerSource.connect(mongodb);
  });

  after(() => {

    mongoTickerSource.disconnect();
  });

  describe('Given connection to a mongo database', () => {

    describe('When getting tickers without a chromosome', () => {

      it('Then only tickers w/o a chromosome are returned', () => {

        mongoTickerSource.getTickersWithoutChromosome();

        const collectionSpy = mongodb.MongoClient.getDatabase().collection();
        const findQuery = collectionSpy.getLastFindQuery();

        expect(findQuery.chromosome.$exists).to.equal(false);
      });

      it('Then a stream of tickers is returned', () => {

        const expectedTickers = [
          { id: '1111', ticker: 'GOOG' },
          { id: '1112', ticker: 'C' },
          { id: '1113', tikcer: 'PVH' },
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
