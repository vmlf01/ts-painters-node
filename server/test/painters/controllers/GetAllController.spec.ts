import * as MockRequest from 'mock-express-request';
import * as MockResponse from 'mock-express-response';
import * as _should from 'should';
import * as sinon from 'sinon';

import GetAllController from '../../../src/painters/controllers/GetAllController';
import IPainter from '../../../src/painters/interfaces/IPainter';
import PainterService from '../../../src/painters/services/PainterService';

const should = _should;

describe('Painters GetAllController', () => {
  it('should have a getHandler() method', () => {
    const controller = new GetAllController(null);
    controller.getHandler.should.be.a.Function();
  });

  it('should return an express route handler when getHandler() is called', () => {
    const handler = new GetAllController(null).getHandler();
    handler.should.be.a.Function();
    handler.length.should.equal(3);
  });

  it('should invoke PainterService.getAll() to handle requests', (done) => {
    const painters: IPainter[] = [ { _id: '', name: 'test', dateOfBirth: '1890' }];
    const paintersResult = new Promise<IPainter[]>((resolve, reject) => resolve(painters));
    const painterService = new PainterService(null);
    const serviceStub = sinon.stub(painterService, 'getAll', () => {
      return paintersResult;
    });

    const mockRequest = new MockRequest();
    const mockResponse = new MockResponse();
    const responseStub = sinon.stub(mockResponse, 'send', (data) => {
      serviceStub.calledOnce.should.be.true();
      serviceStub.restore();
      data.length.should.equal(1);
      data[0].dateOfBirth.should.equal('1890');

      responseStub.restore();
      done();
    });

    const handler = new GetAllController(painterService).getHandler();
    handler(mockRequest, mockResponse, () => undefined);
  });

  it('should call next() with error when PainterService.getAll() promise is rejected', (done) => {
    const paintersResult = new Promise<IPainter[]>((resolve, reject) => reject(new Error()));
    const painterService = new PainterService(null);
    const serviceStub = sinon.stub(painterService, 'getAll', () => {
      return paintersResult;
    });

    const mockRequest = new MockRequest();
    const mockResponse = new MockResponse();

    const handler = new GetAllController(painterService).getHandler();
    handler(mockRequest, mockResponse, (err) => {
      serviceStub.restore();
      should.exist(err);
      done();
    });
  });
});
