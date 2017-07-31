const mongoTickerSource = {};
export default mongoTickerSource;

let testDb;

mongoTickerSource.connect = (mongodb) => {

  let host = 'localhost';
  let port = '27017';
  let databaseName = 'testStockData';

  if (process.env.MONGO_CONNECTION_HOST) {

    host = process.env.MONGO_CONNECTION_HOST;
  }

  if (process.env.MONGO_CONNECTION_PORT) {

    port = process.env.MONGO_CONNECTION_PORT;
  }

  if (process.env.MONGO_CONNECTION_DATABASE) {

    databaseName = process.env.MONGO_CONNECTION_DATABASE;
  }

  const connectionUrl = `mongodb://${host}:${port}/${databaseName}`;

  console.info(`Connectiong to mongo dataabase ${connectionUrl}`);

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

