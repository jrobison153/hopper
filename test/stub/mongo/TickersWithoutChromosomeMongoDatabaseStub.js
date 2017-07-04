import TickersWithoutChromosomeCollectionSpy from '../../spy/mongo/TickersWithoutChromosomeCollectionSpy';

export default class TickersWithoutMongoDatabaseStub {

  constructor() {

    this.collectionSpy = new TickersWithoutChromosomeCollectionSpy();
  }

  // eslint-disable-next-line class-methods-use-this
  close() {

  }

  collection() {

    return this.collectionSpy;
  }
}
