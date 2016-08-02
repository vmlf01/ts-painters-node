import * as mongoose from 'mongoose';

type IPaginatedModel<T extends mongoose.Document> = mongoose.Model<T> & {
    paginate(query: any, options: any): Promise<T[]>;
}

export default IPaginatedModel;
