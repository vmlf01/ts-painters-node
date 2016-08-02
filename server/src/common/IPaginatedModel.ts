import * as mongoose from 'mongoose';

import IPaginatedModelResults from './IPaginatedModelResults';

type IPaginatedModel<T extends mongoose.Document> = mongoose.Model<T> & {
    paginate(query: any, options: any): Promise<IPaginatedModelResults<T>>;
}

export default IPaginatedModel;
