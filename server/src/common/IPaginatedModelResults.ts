import * as mongoose from 'mongoose';

interface IPaginatedModelResults<T extends mongoose.Document> {
  docs: T[];
  total: number;
  pages?: number;
  offset?: number;
  limit: number;
  page?: number;
}

export default IPaginatedModelResults;
