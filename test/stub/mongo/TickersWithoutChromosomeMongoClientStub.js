import TickersWithoutChromosomeMongoDatabaseStub from './TickersWithoutChromosomeMongoDatabaseStub';

export default class TickersWithoutChromosomeMongoClientStub {

  constructor() {

    this.database = new TickersWithoutChromosomeMongoDatabaseStub();
  }

  connect(url) {

    this.connectionUrl = url;

    return Promise.resolve(this.database);
  }

  /* methods below this comment are convenience methods for testing and are not part of the interface
   * being stubbed/spied/faked
  */

  getConnectionUrl() {

    return this.connectionUrl;
  }

  getDatabase() {

    return this.database;
  }
}
