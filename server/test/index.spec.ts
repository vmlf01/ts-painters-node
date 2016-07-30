import * as _should from 'should';
import * as sinon from 'sinon';
import * as superagent from 'superagent';

import Server from '../src';
import DBConnection from '../src/common/DBConnection';

const should = _should;

describe('Server', () => {
    const ip = '127.0.0.1';
    const port = 3333;
    const serverUrl = `http://${ip}:${port}`;
    let dbConnectionStub: Sinon.SinonStub;

    before(() => {
        // stub database connection method
        dbConnectionStub = sinon.stub(DBConnection.prototype, 'connect', (url, cb) => cb());
    });

    after(() => {
        // restore db connection implementation
        dbConnectionStub.restore();
    });

    it('should create a new http server', () => {
        const server = new Server(ip, port);
        should.exist(server);
    });

    it('should have a start method', () => {
        const server = new Server(ip, port);
        server.start.should.be.a.Function();
    });

    it('should have a shutdown method', () => {
        const server = new Server(ip, port);
        server.shutdown.should.be.a.Function();
    });

    it('should listen on specified port', (done) => {
        const server = new Server(ip, port);
        server.start();
        superagent
            .get(`${serverUrl}/`)
            .end((err, res) => {
                server.shutdown();
                res.status.should.equal(404);
                done();
            });
    });

    it('should respond with pong to ping request', (done) => {
        const server = new Server(ip, port);
        server.start();

        superagent
            .get(`${serverUrl}/ping`)
            .end((err, res) => {
                server.shutdown();
                res.status.should.equal(200);
                res.text.should.equal('pong');
                done();
            });
    });
});
