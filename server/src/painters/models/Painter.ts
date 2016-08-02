import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

import IPaginatedModel from '../../../src/common/IPaginatedModel';
import IPainterDocument from '../interfaces/IPainterDocument';

const painterSchema = new mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    dateOfBirth: {
        type: mongoose.SchemaTypes.String
    }
});
painterSchema.plugin(mongoosePaginate);

let painterModel: IPaginatedModel<IPainterDocument> =
    mongoose.model<IPainterDocument>('Painter', painterSchema) as IPaginatedModel<IPainterDocument>;

export default painterModel;
