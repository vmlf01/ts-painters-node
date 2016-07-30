import * as mongoose from 'mongoose';

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

let painterModel: mongoose.Model<IPainterDocument> = mongoose.model<IPainterDocument>('Painter', painterSchema);

export default painterModel;
