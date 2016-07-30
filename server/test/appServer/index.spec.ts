import * as express from 'express';
import * as _should from 'should';
import * as sinon from 'sinon';
import * as request from 'supertest';

import App from '../../src/appServer';
import IAppModule from '../../src/common/IAppModule';

const should = _should;

// declare a simple test app module
class TestModule implements IAppModule {
    public name: string = 'test';

    public getRoutes() {
        const router = express.Router();
        router.get('/', (req, res) => res.send('ok'));
        return router;
    }
}

describe('App server', () => {
    const ip = '127.0.0.1';
    const port = 3000;

    it('should create a new express instance', () => {
        const app = new App(ip, port, []);
        should.exist(app);
    });

    it('should allow app modules to be registered', () => {
        const testModule = new TestModule();

        const app = new App(ip, port, [ testModule ]);

        app.modules.length.should.equal(1);
        app.modules[0].name.should.equal(testModule.name);
    });

    it('should get app module routes on registration', () => {
        const testModule = new TestModule();
        const getRoutesSpy = sinon.spy(testModule, 'getRoutes');

        const app = new App(ip, port, [ testModule ]);

        should.exist(app);
        getRoutesSpy.called.should.be.True();
        getRoutesSpy.restore();
    });

    it('should map request to app module route', (done) => {
        const testModule = new TestModule();
        const app = new App(ip, port, [ testModule ]);

        request(app.app)
            .get(`/${testModule.name}/`)
            .expect(200, 'ok')
            .end(done);
    });
});
