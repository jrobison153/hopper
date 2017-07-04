const mongoTickerSource = {};
export default mongoTickerSource;

let testDb;

const testStockDataUrl = 'mongodb://localhost:27017/testStockData';

mongoTickerSource.connect = (mongodb) => {

  const MongoClient = mongodb.MongoClient;
  return MongoClient.connect(testStockDataUrl).then((db) => {

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

