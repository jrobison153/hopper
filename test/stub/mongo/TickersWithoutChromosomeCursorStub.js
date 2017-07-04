import Stream from 'stream';

export default class TickersWithoutChromosomeCursorStub {

  constructor() {

    this.data = [
      { id: '1111', ticker: 'GOOG' },
      { id: '1112', ticker: 'C' },
      { id: '1113', tikcer: 'PVH' },
    ];
  }

  toArray() {

    return this.data;
  }

  stream() {

    const readable = new Stream.Readable({ objectMode: true });

    this.data.forEach((item) => {
      readable.push(item);
    });

    readable.push(null);

    return readable;
  }
}
