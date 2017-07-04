import TickersWithoutChromosomeMongoDatabaseStub from './TickersWithoutChromosomeMongoDatabaseStub';

export default class TickersWithoutChromosomeMongoClientStub {

  constructor() {

    this.database = new TickersWithoutChromosomeMongoDatabaseStub();
  }

  connect() {

    return Promise.resolve(this.database);
  }

  /* methods below this comment are convenience methods for testing and are not part of the interface
   * being stubbed/spied/faked
  */

  getDatabase() {

    return this.database;
  }
}
