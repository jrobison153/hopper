import TickersWithoutChromosomeCursorStub from '../../stub/mongo/TickersWithoutChromosomeCursorStub';

export default class TickersWithoutChromosomeCollectionSpy {

  constructor() {
    this.lastFindQuery = {};
  }

  find(query) {

    this.lastFindQuery = query;
    return new TickersWithoutChromosomeCursorStub();
  }

  getLastFindQuery() {

    return this.lastFindQuery;
  }
}
