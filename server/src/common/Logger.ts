import * as express from 'express';
import * as expressWinston from 'express-winston';
import * as winston from 'winston';

import config from './Config';
import IAppLogger from './IAppLogger';

const logger = new (winston.Logger)({
  level: config.get('LOG_LEVEL')
});

if (config.get('NODE_ENV') !== 'test') {
  logger.add(winston.transports.Console);
}

export interface ILoggerMiddleware {
  logger: express.RequestHandler;
  errorLogger: express.ErrorRequestHandler;
}

const loggerSingleton: IAppLogger = logger;
const LoggerMiddleware: ILoggerMiddleware = {
  logger: expressWinston.logger({
    winstonInstance: logger
  }),
  errorLogger: expressWinston.errorLogger({
    winstonInstance: logger
  })
};

export default loggerSingleton;

export {
  LoggerMiddleware
};
