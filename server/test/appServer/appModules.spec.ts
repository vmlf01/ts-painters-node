import * as _should from 'should';

import appModules from '../../src/appServer/appModules';

const should = _should;

describe('App modules', () => {
    it('should export a function to return app modules', () => {
      appModules.should.be.a.Function();
    });

    it('should return app modules array', () => {
      const modules = appModules();

      should.exist(modules);
    });
});
