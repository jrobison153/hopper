/**
 * MongoDb stub that always returns tickers w/o a chromosome when 'find' is called
 */
import TickersWithoutChromosomeMongoClientStub from './TickersWithoutChromosomeMongoClientStub';

const mongodb = {

  MongoClient: new TickersWithoutChromosomeMongoClientStub(),
};

export default mongodb;
