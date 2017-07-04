import restify from 'restify';
import mongodb from 'mongodb';
import redis from 'redis';
import undecoratedChromosomeProcessor from './service/undecoratedChromosomeProcessor';
import mongoTickerSource from './io/mongoTickerSource';
import DecoratorService from './integration/decoratorService';

const port = process.env.PORT || 8080;
let restifyServer = null;

const server = {};

export default server;

server.start = (dataSource, redisIntegration) => {

  const theDataSource = pickDataSource(dataSource);
  const theRedisIntegration = pickRedisIntegration(redisIntegration);

  mongoTickerSource.connect(theDataSource);

  const decoratorService = new DecoratorService(theRedisIntegration);
  restifyServer = restify.createServer();

  configureResources(decoratorService);

  return startServer();
};

server.stop = () => {

  mongoTickerSource.disconnect();

  if (restifyServer !== null) {

    console.info(`Stopping server ${restifyServer.name} at ${restifyServer.url}`);

    restifyServer.close();
  }
};

const pickDataSource = (providedDataSource) => {

  let dataSourceToUse = mongodb;
  if (providedDataSource !== undefined) {

    dataSourceToUse = providedDataSource;
  }

  return dataSourceToUse;
};

const pickRedisIntegration = (providedRedis) => {

  let redisIntegrationToUse = redis;
  if (providedRedis !== undefined) {

    redisIntegrationToUse = providedRedis;
  }

  return redisIntegrationToUse;
};

const configureResources = (decoratorService) => {

  restifyServer.post('/chromosomes', (req, resp) => {

    undecoratedChromosomeProcessor.process(mongoTickerSource, decoratorService).then((batchId) => {

      resp.send(batchId);
    });
  });

  restifyServer.get('/chromosomes/:batchId', (req, resp) => {

    const processedTickerIds = undecoratedChromosomeProcessor.getProcessedTickers(req.params.batchId);
    resp.send(processedTickerIds);
  });
};

const startServer = () => {

  return new Promise((resolve) => {

    restifyServer.listen(port, () => {

      console.info(`${restifyServer.name} listening at ${restifyServer.url}`);
      resolve();
    });
  });
};

