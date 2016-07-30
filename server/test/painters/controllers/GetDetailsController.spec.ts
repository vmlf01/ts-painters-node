import * as MockRequest from 'mock-express-request';
import * as MockResponse from 'mock-express-response';
import * as _should from 'should';
import * as sinon from 'sinon';

import GetDetailsController from '../../../src/painters/controllers/GetDetailsController';
import IPainter from '../../../src/painters/interfaces/IPainter';
import PainterService from '../../../src/painters/services/PainterService';

const should = _should;

describe('Painters GetDetailsController', () => {
  it('should have a getHandler() method', () => {
    const controller = new GetDetailsController(null);
    controller.getHandler.should.be.a.Function();
  });

  it('should return an express route handler when getHandler() is called', () => {
    const handler = new GetDetailsController(null).getHandler();
    handler.should.be.a.Function();
    handler.should.have.length(3);
  });

  it('should invoke PainterService.get() to handle requests', (done) => {
    const painter: IPainter = { _id: '', name: 'test', dateOfBirth: '1890' };
    const painterResult = new Promise<IPainter>((resolve, reject) => resolve(painter));
    const painterService = new PainterService(null);
    const serviceStub = sinon.stub(painterService, 'get', () => {
      return painterResult;
    });

    const mockRequest = new MockRequest({ params: { id: 'aaa' } });
    const mockResponse = new MockResponse();
    const responseStub = sinon.stub(mockResponse, 'send', (data) => {
      serviceStub.calledOnce.should.be.True();
      serviceStub.calledWith('aaa').should.be.True();
      serviceStub.restore();
      data.dateOfBirth.should.equal('1890');

      responseStub.restore();
      done();
    });

    const handler = new GetDetailsController(painterService).getHandler();
    handler(mockRequest, mockResponse, done);
  });

  it('should return 404 when painter is not found', (done) => {
    const painterResult = new Promise<IPainter>((resolve, reject) => resolve());
    const painterService = new PainterService(null);
    const serviceStub = sinon.stub(painterService, 'get', () => {
      return painterResult;
    });

    const mockRequest = new MockRequest({ params: { id: 'aaa' } });
    const mockResponse = new MockResponse();
    const responseStub = sinon.stub(mockResponse, 'sendStatus', (data) => {
      serviceStub.calledOnce.should.be.True();
      serviceStub.calledWith('aaa').should.be.True();
      serviceStub.restore();
      data.should.equal(404);

      responseStub.restore();
      done();
    });

    const handler = new GetDetailsController(painterService).getHandler();
    handler(mockRequest, mockResponse, done);
  });

  it('should call next() with error when PainterService.get() promise is rejected', (done) => {
    const painterResult = new Promise<IPainter>((resolve, reject) => reject(new Error()));
    const painterService = new PainterService(null);
    const serviceStub = sinon.stub(painterService, 'get', () => {
      return painterResult;
    });

    const mockRequest = new MockRequest({ params: { id: 'aaa' } });
    const mockResponse = new MockResponse();

    const handler = new GetDetailsController(painterService).getHandler();
    handler(mockRequest, mockResponse, (err) => {
      serviceStub.restore();
      should.exist(err);
      done();
    });
  });
});
