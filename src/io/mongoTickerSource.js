const mongoTickerSource = {};
export default mongoTickerSource;

let testDb;

let connectionUrl = 'mongodb://localhost:27017';

mongoTickerSource.connect = (mongodb) => {

  let databaseName = 'testStockData';
  if(process.env.MONGO_CONNECTION_DATABASE) {
    databaseName = process.env.MONGO_CONNECTION_DATABASE;

  }

  connectionUrl = `${connectionUrl}/${databaseName}`;

  const MongoClient = mongodb.MongoClient;
  return MongoClient.connect(connectionUrl).then((db) => {

    testDb = db;
  });
};

mongoTickerSource.disconnect = () => {

  testDb.close();
};

/**
 * Find all tickers in the database that do not already have a chromosome
 *
 * @returns {Stream} - return an event stream that will emit Ticker objects from the database
 */
mongoTickerSource.getTickersWithoutChromosome = () => {

  const tickerCollection = testDb.collection('tickers');
  const cursor = tickerCollection.find({ chromosome: { $exists: false } });

  return cursor.stream();
};

