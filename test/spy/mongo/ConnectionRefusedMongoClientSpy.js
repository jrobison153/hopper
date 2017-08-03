/**
 * A mongo client that always fails to connect with an ECONNREFUSED error
 */
export default class ConnectionRefusedMongoClientSpy {

  constructor() {

    this.numberOfTimesConnectCalled = 0;
  }

  connect() {

    this.numberOfTimesConnectCalled = this.numberOfTimesConnectCalled + 1;

    return Promise.reject(new Error('blah blah blah, ECONNREFUSED some network address'));
  }

}
