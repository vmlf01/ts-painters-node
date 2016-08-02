import * as bluebird from 'bluebird';
import * as mongoose from 'mongoose';
import * as _should from 'should';
import * as sinon from 'sinon';

import IPainter from '../../../src/painters/interfaces/IPainter';
import Painter from '../../../src/painters/models/Painter';
import PainterService from '../../../src/painters/services/PainterService';

const should = _should;
mongoose.Promise = bluebird;

describe('Painter Service', () => {

  describe('getAll', () => {
    it('should have a getAll() method', () => {
      const painterService = new PainterService(null);
      painterService.getAll.should.be.a.Function();
    });

    it('should fetch painters list from Painter model', (done) => {
      const painters: IPainter[] = [ { _id: '', name: 'test', dateOfBirth: '1890' }];
      const paintersResult = new Promise<IPainter[]>((resolve, reject) => resolve(painters));

      const findSpy = sinon.stub(Painter, 'paginate', () => {
        return paintersResult;
      });

      const painterService = new PainterService(Painter);

      painterService.getAll()
        .then((data) => {
          findSpy.calledOnce.should.be.True();
          data.should.have.length(1);
          data[0].name.should.equal('test');

          findSpy.restore();
          done();
        })
        .catch((err) => done(err));
    });

    it('should support pagination parameters', (done) => {
      const painters: IPainter[] = [
        { _id: new mongoose.Types.ObjectId(), name: 'test1', dateOfBirth: '1891' },
        { _id: new mongoose.Types.ObjectId(), name: 'test2', dateOfBirth: '1892' },
        { _id: new mongoose.Types.ObjectId(), name: 'test3', dateOfBirth: '1893' },
        { _id: new mongoose.Types.ObjectId(), name: 'test4', dateOfBirth: '1894' },
      ];
      const paintersResult = new Promise<IPainter[]>((resolve, reject) => resolve(painters));

      const findSpy = sinon.stub(Painter, 'paginate', (query, options) => {
        should.exist(options, 'paginate options parameter should exist');
        should.exist(options.offset, 'paginate offset property should exist');
        should.exist(options.limit, 'paginate limit property should exist');
        options.offset.should.equal(0);
        options.limit.should.equal(4);
        return paintersResult;
      });

      const painterService = new PainterService(Painter);

      painterService.getAll({ skip: 0, take: 4})
        .then((data) => {
          findSpy.calledOnce.should.be.True();
          data.should.have.length(4);

          findSpy.restore();
          done();
        })
        .catch((err) => done(err));
    });

  });

  describe('get', () => {
    it('should have a get() method', () => {
      const painterService = new PainterService(null);
      painterService.get.should.be.a.Function();
    });

    it('should fetch painters details from Painter model', (done) => {
      const painter: IPainter = { _id: '', name: 'test', dateOfBirth: '1890' };
      const painterResult = new Promise<IPainter>((resolve, reject) => resolve(painter));

      const findSpy = sinon.stub(Painter, 'findById', () => {
        return painterResult;
      });

      const painterService = new PainterService(Painter);

      painterService.get('12')
        .then((data) => {
          findSpy.calledOnce.should.be.True();
          findSpy.calledWith('12').should.be.True();
          data.name.should.equal('test');

          findSpy.restore();
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('save', () => {
    it('should have a save() method', () => {
      const painterService = new PainterService(Painter);
      painterService.save.should.be.a.Function();
    });

    it('should generate a new _id when inserting a new painter', (done) => {
      const testPainter = <IPainter> {
        name: 'test',
        dateOfBirth: '1890'
      };

      const saveStub = sinon.stub(Painter.prototype, 'save', function (cb) {
        should.exist(this._id);

        saveStub.restore();
        done();
      });

      const painterService = new PainterService(Painter);

      painterService.save(testPainter);
    });

    it('should insert a new painter', (done) => {
      const testPainter = <IPainter> {
        name: 'test',
        dateOfBirth: '1890'
      };
      const newPainter: IPainter = new Painter({
        _id: new mongoose.Types.ObjectId('555b555b55bbb55555b55555'),
        name: 'test',
        dateOfBirth: '1890'
      });

      const saveStub = sinon.stub(Painter.prototype, 'save', function (cb) {
        cb(null, newPainter);
      });

      const painterService = new PainterService(Painter);

      painterService.save(testPainter)
        .then((data) => {
          saveStub.calledOnce.should.be.true();
          data._id.should.equal(newPainter._id);

          saveStub.restore();
          done();
        })
        .catch((err) => done(err));
    });

    it('should use specified _id when updating an existing painter', (done) => {
      const testPainter: IPainter = {
        _id: new mongoose.Types.ObjectId('555a555a55aaa55555a55555'),
        name: 'test-update',
        dateOfBirth: '1890'
      };

      const saveStub = sinon.stub(Painter.prototype, 'save', function (cb) {
        this._id.should.equal(testPainter._id);
        saveStub.restore();
        done();
        cb(null, testPainter);
      });

      const painterService = new PainterService(Painter);

      painterService.save(testPainter);
    });

    it('should update an existing painter', (done) => {
      const testPainter: IPainter = {
        _id: new mongoose.Types.ObjectId('555a555a55aaa55555a55555'),
        name: 'test-update',
        dateOfBirth: '1890'
      };

      const saveStub = sinon.stub(Painter.prototype, 'save', function (cb) {
        cb(null, testPainter);
      });

      const painterService = new PainterService(Painter);

      painterService.save(testPainter)
        .then((data) => {
          saveStub.calledOnce.should.be.true();
          data._id.should.equal(testPainter._id);

          saveStub.restore();
          done();
        })
        .catch((err) => done(err));
    });
  });
});
