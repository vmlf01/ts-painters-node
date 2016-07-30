import * as _should from 'should';

import { IConfig } from '../../src/common/Config';
import config from '../../src/common/Config';

const should = _should;

describe('Config', () => {
  it('should export a singleton IConfig instance', () => {
    const conf: IConfig = config;
    should.exist(conf);
  });

  it('should have a get() method', () => {
    config.get.should.be.a.Function();
  });

  it('should return requested config value', () => {
    config.get('NODE_ENV').should.equal('test');
  });
});
