import * as _should from 'should';
import * as sinon from 'sinon';

import PainterModule from '../../src/painters';
import GetAllController from '../../src/painters/controllers/GetAllController';
import GetDetailsController from '../../src/painters/controllers/GetDetailsController';

const should = _should;

describe('Painters module', () => {

    it('should be named painters', () => {
        const painterModule = new PainterModule(null);
        painterModule.name.should.equal('painters');
    });

    it('should define GET / route', () => {
        const painterModule = new PainterModule(null);
        const painterRoutes: any = painterModule.getRoutes();

        const route = painterRoutes.stack.find((item) => item.route.path === '/');

        should.exist(route);
        route.route.methods.get.should.be.True();
    });

    it('should define GET /:id route', () => {
        const painterModule = new PainterModule(null);
        const painterRoutes: any = painterModule.getRoutes();

        const route = painterRoutes.stack.find((item) => item.route.path === '/:id');

        should.exist(route);
        route.route.methods.get.should.be.True();
    });

    it('should handle / route', (done) => {
        const getAllMock = sinon.stub(GetAllController.prototype, 'getHandler', () => (req, res, next) => {
            getAllMock.restore();
            done();
        });

        const painterModule = new PainterModule(null);
        const painterRoutes: any = painterModule.getRoutes();

        painterRoutes.handle({ url: '/', method: 'GET' });
    });

    it('should handle /:id route', (done) => {
        const getDetailsMock = sinon.stub(GetDetailsController.prototype, 'getHandler', () => (req, res, next) => {
            req.params.id.should.equal('1');

            getDetailsMock.restore();
            done();
        });

        const painterModule = new PainterModule(null);
        const painterRoutes: any = painterModule.getRoutes();

        painterRoutes.handle({ url: '/1', method: 'GET' }, {}, done);
    });
});
