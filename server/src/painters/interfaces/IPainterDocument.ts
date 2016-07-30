import * as mongoose from 'mongoose';

import IPainter from './IPainter';

interface IPainterDocument extends IPainter, mongoose.Document {
}

export default IPainterDocument;
