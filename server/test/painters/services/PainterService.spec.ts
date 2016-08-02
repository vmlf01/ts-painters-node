import * as bluebird from 'bluebird';
import * as mongoose from 'mongoose';
import * as _should from 'should';
import * as sinon from 'sinon';

import IPaginatedModelResults from '../../../src/common/IPaginatedModelResults';
import IPainter from '../../../src/painters/interfaces/IPainter';
import IPainterDocument from '../../../src/painters/interfaces/IPainterDocument';
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

    describe('Painter Model interaction', () => {

      it('should call paginate() to fetch painters list', (done) => {
        const findSpy = sinon.stub(Painter, 'paginate', () => {
          return CreatePaintersResult([]);
        });

        const painterService = new PainterService(Painter);

        painterService.getAll()
          .then((data) => {
            findSpy.calledOnce.should.be.True();
            done();
          })
          .catch((err) => done(err))
          .then(() => findSpy.restore());
      });

      it('should call paginate() with specified pagination parameters', (done) => {
        const findSpy = sinon.stub(Painter, 'paginate', (query, options) => {
          should.exist(options, 'paginate options parameter should exist');
          should.exist(options.offset, 'paginate offset property should exist');
          should.exist(options.limit, 'paginate limit property should exist');
          options.offset.should.equal(0, 'Incorrect value for offset');
          options.limit.should.equal(4, 'Incorrect value for limit');

          return CreatePaintersResult([]);
        });

        const painterService = new PainterService(Painter);

        painterService.getAll({ skip: 0, take: 4})
          .then((results) => {
            findSpy.calledOnce.should.be.True();
            done();
          })
          .catch((err) => done(err))
          .then(() => findSpy.restore());
      });

      it('should call paginate() with default pagination parameters if not specified', (done) => {
        const findSpy = sinon.stub(Painter, 'paginate', (query, options) => {
          should.exist(options, 'paginate options parameter should exist');
          should.exist(options.offset, 'paginate offset property should exist');
          should.exist(options.limit, 'paginate limit property should exist');
          options.offset.should.equal(0, 'Incorrect value for offset');
          options.limit.should.equal(10, 'Incorrect value for limit');

          return CreatePaintersResult([]);
        });

        const painterService = new PainterService(Painter);

        painterService.getAll()
          .then((results) => {
            findSpy.calledOnce.should.be.True();
            done();
          })
          .catch((err) => done(err))
          .then(() => findSpy.restore());
      });
    });

    describe('Return data', () => {
      it('should return object implementing IPaginatedResults', (done) => {
        const painters: IPainter[] = [
          { _id: new mongoose.Types.ObjectId(), name: 'test1', dateOfBirth: '1891' },
          { _id: new mongoose.Types.ObjectId(), name: 'test2', dateOfBirth: '1892' },
          { _id: new mongoose.Types.ObjectId(), name: 'test3', dateOfBirth: '1893' },
          { _id: new mongoose.Types.ObjectId(), name: 'test4', dateOfBirth: '1894' },
        ];

        const findSpy = sinon.stub(Painter, 'paginate', (query, options) => {
          return CreatePaintersResult(painters, { limit: 4 });
        });

        const painterService = new PainterService(Painter);

        painterService.getAll({ skip: 0, take: 4})
          .then((results) => {
            results.data.should.have.length(4);
            results.total.should.equal(100);
            results.skip.should.equal(0);
            results.take.should.equal(4);

            done();
          })
          .catch((err) => done(err))
          .then(() => findSpy.restore());
      });
    });
  });

  describe('get', () => {
    it('should have a get() method', () => {
      const painterService = new PainterService(null);
      painterService.get.should.be.a.Function();
    });

    it('should fetch painters details from Painter model', (done) => {
      const painter: IPainter = { _id: new mongoose.Types.ObjectId(), name: 'test', dateOfBirth: '1890' };
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

    describe('New Painter', () => {
      it('should generate a new _id for painter', (done) => {
        let testPainter: IPainter = {
          _id: '',
          name: 'test',
          dateOfBirth: '1890'
        };
        delete testPainter._id;

        const saveStub = sinon.stub(Painter.prototype, 'save', function (cb) {
          should.exist(this._id);

          saveStub.restore();
          done();
        });

        const painterService = new PainterService(Painter);

        painterService.save(testPainter);
      });

      it('should insert new painter', (done) => {
        let testPainter: IPainter = {
          _id: '',
          name: 'test',
          dateOfBirth: '1890'
        };
        delete testPainter._id;

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
    });

    describe('Existing Painter', () => {
      it('should use specified _id when updating painter', (done) => {
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

      it('should update existing painter', (done) => {
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
});

function CreatePaintersResult(painters: IPainter[], options?: any) {
  options = options || {};
  return new Promise<IPaginatedModelResults<IPainterDocument>>((resolve, reject) =>
    resolve({
      docs: painters.map((painter) => new Painter(painter)),
      total: options.total || 100,
      offset: options.offset || 0,
      limit: options.limit || 10
    })
  );
}
