import Stream from 'stream';

export default class TickersWithoutChromosomeCursorStub {

  constructor() {

    this.data = [
      { _id: '1111', ticker: 'GOOG' },
      { _id: '1112', ticker: 'C' },
      { _id: '1113', tikcer: 'PVH' },
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
