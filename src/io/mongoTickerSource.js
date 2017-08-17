const mongoTickerSource = {};
export default mongoTickerSource;

let connectedDatabase;

const DEFAULT_CONNECTION_ATTEMPTS = 60;
const CONNECTION_RETRY_DELAY = 1000;

/**
 *
 * Connect to the database
 *
 * @param mongodb - database implementation
 * @param reconnectAttempts - number of times to attempt connect to database. Optional defaults to 60
 * @returns {Promise}
 */
mongoTickerSource.connect = (mongodb, reconnectAttempts) => {

  const connectionUrl = buildConnectionUrlFromEnv();
  const MongoClient = mongodb.MongoClient;
  const connectionAttempts = reconnectAttempts || DEFAULT_CONNECTION_ATTEMPTS;

  const connectionDonePromise = new Promise((resolve, reject) => {

    connectionRetry(connectionUrl, MongoClient, connectionAttempts, 1, resolve, reject);
  }).then((actualConnectionAttempts) => {

    console.info(`Connected to database after ${actualConnectionAttempts} attempt(s)`);
  });

  return connectionDonePromise;
};

mongoTickerSource.disconnect = () => {

  connectedDatabase.close();
};

/**
 * Find all tickers in the database that do not already have a chromosome
 *
 * @returns {Stream} - return an event stream that will emit Ticker objects from the database
 */
mongoTickerSource.getTickersWithoutChromosome = () => {

  const tickerCollection = connectedDatabase.collection('tickers');
  const cursor = tickerCollection.find({ chromosome: { $exists: false } });

  return cursor.stream();
};

function buildConnectionUrlFromEnv() {

  const host = resolveHostFromEnv('localhost');
  const port = resolvePortFromEnv('27017');
  const databaseName = resolveDatabaseFromEnv('testStockData');

  const connectionUrl = `mongodb://${host}:${port}/${databaseName}`;

  console.info(`Connecting to mongo database ${connectionUrl}`);

  return connectionUrl;
}

function resolveHostFromEnv(defaultValue) {

  return process.env.MONGO_CONNECTION_HOST ? process.env.MONGO_CONNECTION_HOST : defaultValue;
}

function resolvePortFromEnv(defaultValue) {

  return process.env.MONGO_CONNECTION_PORT ? process.env.MONGO_CONNECTION_PORT : defaultValue;
}

function resolveDatabaseFromEnv(defaultValue) {

  return process.env.MONGO_CONNECTION_DATABASE ? process.env.MONGO_CONNECTION_DATABASE : defaultValue;
}

function connectionRetry(url, MongoClient, connectionAttempts, attemptNumber, resolve, reject) {

  MongoClient.connect(url).then((db) => {

    connectedDatabase = db;
    resolve(attemptNumber);
  }, (e) => {

    if (attemptNumber < connectionAttempts) {

      // eslint-disable-next-line max-len
      console.info(`Failed to connect to MongoDb at ${url} with error ${e}, retrying in ${CONNECTION_RETRY_DELAY}ms...`);

      setTimeout(() => {
        connectionRetry(url, MongoClient, connectionAttempts, attemptNumber + 1, resolve, reject);
      }, CONNECTION_RETRY_DELAY);
    } else {

      reject(`Giving up on attempt to connect, tried ${connectionAttempts} times`);
    }
  }).catch((e) => {

    reject(e);
  });
}
