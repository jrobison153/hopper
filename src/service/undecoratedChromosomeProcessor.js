/**
 * Orchestrate the process of decorating with a chromosome all tickers that don't have one
 */
import uuid from 'uuid';

const undecoratedChromosomeProcessor = {};
export default undecoratedChromosomeProcessor;
const processedTickerBatches = {};

undecoratedChromosomeProcessor.process = (tickerDataSource, decoratorService) => {

  const stream = tickerDataSource.getTickersWithoutChromosome();
  const batchId = uuid.v4();

  processedTickerBatches[batchId] = [];

  pipeSourceToDecoratorService(stream, decoratorService, batchId);

  return new Promise((resolve) => {

    stream.on('end', () => {

      resolve(batchId);
    });
  });
};

undecoratedChromosomeProcessor.getProcessedTickers = (batchProcessId) => {

  return processedTickerBatches[batchProcessId];
};

function pipeSourceToDecoratorService(streamOfTickers, decoratorService, batchId) {

  streamOfTickers.on('data', (ticker) => {

    decoratorService.decorateTicker(ticker);

    // eslint-disable-next-line no-underscore-dangle
    processedTickerBatches[batchId].push(ticker._id);
  });
}
