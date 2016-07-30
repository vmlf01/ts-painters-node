import * as bluebird from 'bluebird';
import * as mongoose from 'mongoose';

export interface IDBConnection {
  connect(connectionString: string, cb: (err: any) => void): void;
  disconnect(cb: (err: any) => void): void;
}

class DBConnection implements IDBConnection {
  private dbConnection: mongoose.Mongoose;

  constructor() {
    this.dbConnection = mongoose;
    mongoose.Promise = bluebird;
  }

  public connect(connectionString: string, cb: (err: any) => void): void {
    mongoose.connect(connectionString, cb);
  }

  public disconnect(cb: (err: any) => void): void {
    this.dbConnection.disconnect(cb);
  }
}

export default DBConnection;
