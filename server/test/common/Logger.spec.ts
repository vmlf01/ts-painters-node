import * as _should from 'should';

import IAppLogger from '../../src/common/IAppLogger';
import Logger from '../../src/common/Logger';
import { LoggerMiddleware } from '../../src/common/Logger';

const should = _should;

describe('Logger', () => {
  it('should export a singleton Logger instance', () => {
    const logger: IAppLogger = Logger;
    should.exist(logger);
  });

  it('should export express Logger middleware', () => {
    should.exist(LoggerMiddleware.logger);
    should.exist(LoggerMiddleware.errorLogger);
  });

});
