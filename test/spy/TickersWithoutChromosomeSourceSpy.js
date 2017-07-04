/**
 * A test Spy for accessing ticker data
 */
import Stream from 'stream';

export default class TickersWithoutChromosomeSourceSpy {

  constructor() {

    this.tickerData = [
      { id: '1111', ticker: 'GOOG' },
      { id: '1112', ticker: 'C' },
      { id: '1113', tikcer: 'PVH' },
    ];
  }

  getTickersWithoutChromosome() {

    const readable = new Stream.Readable({ objectMode: true });

    this.tickerData.forEach((item) => {
      readable.push(item);
    });

    readable.push(null);

    return readable;
  }
}
