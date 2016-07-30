import * as mongoose from 'mongoose';
import * as _should from 'should';
import * as sinon from 'sinon';

import { IDBConnection } from '../../src/common/DBConnection';
import DBConnection from '../../src/common/DBConnection';

const should = _should;

describe('DBConnection', () => {
  it('should export a singleton IDBConnection instance', () => {
    const connection: IDBConnection = new DBConnection();
    should.exist(connection);
  });

  it('should have a connect() method', () => {
    const connection: IDBConnection = new DBConnection();
    connection.connect.should.be.a.Function();
  });

  it('should have a disconnect() method', () => {
    const connection: IDBConnection = new DBConnection();
    connection.disconnect.should.be.a.Function();
  });

  it('should open db connection', (done) => {
    const dbConnectionString = 'mongodb://xxx';
    const mongooseStub = sinon.stub(mongoose, 'connect', (url, cb) => {
      url.should.equal(dbConnectionString);
      cb();
    });

    const connection: IDBConnection = new DBConnection();
    connection.connect(dbConnectionString, (err) => {
      mongooseStub.calledOnce.should.be.True();
      should.not.exist(err);

      mongooseStub.restore();
      done(err);
    });
  });

  it('should close db connection', (done) => {
    const mongooseStub = sinon.stub(mongoose, 'disconnect', (cb) => {
      cb();
    });

    const connection: IDBConnection = new DBConnection();
    connection.disconnect((err) => {
      mongooseStub.calledOnce.should.be.True();
      should.not.exist(err);

      mongooseStub.restore();
      done(err);
    });
  });

});
