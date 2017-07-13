import { expect } from 'chai';
import undecoratedChromosomeProcessor from '../../../src/service/undecoratedChromosomeProcessor';
import TickersWithoutChromosomeSourceSpy from '../../spy/TickersWithoutChromosomeSourceSpy';
import DecoratorServiceSpy from '../../spy/DecoratorServiceSpy';

/* eslint no-unused-expressions: "off" */
describe('UndecoratedChromosomeProcessor Tests', () => {

  describe('when processing', () => {

    let tickerSourceSpy;
    let decoratorServiceSpy;
    let batchResourceId;

    beforeEach(() => {

      tickerSourceSpy = new TickersWithoutChromosomeSourceSpy();

      decoratorServiceSpy = new DecoratorServiceSpy();

      return undecoratedChromosomeProcessor.process(tickerSourceSpy, decoratorServiceSpy).then((batchId) => {

        batchResourceId = batchId;
      });

    });

    it('sends each ticker without a chromosome to the decorator service', () => {

      const tickersSentToDecoratorService = decoratorServiceSpy.getTickersSentForDecoration();
      const tickerStream = tickerSourceSpy.getTickersWithoutChromosome();

      return new Promise((resolve) => {

        readTickersFromStream(tickerStream, resolve);
      }).then((tickersWithoutChromosome) => {

        expect(tickersSentToDecoratorService).to.have.length(3);

        tickersSentToDecoratorService.forEach((ticker) => {

          expect(tickersWithoutChromosome).to.include(ticker);
        });
      });
    });

    it('creates a resource id for the batch of tickers processed', () => {

      expect(batchResourceId).to.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{10}/);
    });

    it('records each ticker that was processed as part of the batch', () => {

      const processedTickers = undecoratedChromosomeProcessor.getProcessedTickers(batchResourceId);
      const tickerStream = tickerSourceSpy.getTickersWithoutChromosome();

      return new Promise((resolve) => {

        readTickersFromStream(tickerStream, resolve);
      }).then((tickersWithoutChromosome) => {

        const expectedTickerIds = tickersWithoutChromosome.map((ticker) => {

          // eslint-disable-next-line no-underscore-dangle
          return ticker._id;
        });

        expect(processedTickers).to.have.deep.members(expectedTickerIds);
      });
    });
  });
});


function readTickersFromStream(stream, resolve) {

  const tickersWithoutChromosome = [];

  stream.on('data', (ticker) => {

    tickersWithoutChromosome.push(ticker);
  });

  stream.on('end', () => {

    resolve(tickersWithoutChromosome);
  });
}
