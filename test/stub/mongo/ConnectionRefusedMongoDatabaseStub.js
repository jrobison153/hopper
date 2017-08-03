/**
 * Mongo database stub that always return a client that will fail to connect with an ECONNREFUSED error
 */

import ConnectionRefusedMongoClientSpy from '../../spy/mongo/ConnectionRefusedMongoClientSpy';

const mongodb = {

  MongoClient: new ConnectionRefusedMongoClientSpy(),
};

mongodb.reset = () => {

  mongodb.MongoClient = new ConnectionRefusedMongoClientSpy();
};

export default mongodb;
