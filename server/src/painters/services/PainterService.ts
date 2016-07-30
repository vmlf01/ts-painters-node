import * as mongoose from 'mongoose';

import IPainter from '../interfaces/IPainter';
import IPainterDocument from '../interfaces/IPainterDocument';
import IPainterService from '../interfaces/IPainterService';

class PainterService implements IPainterService {

  constructor(private PainterModel: mongoose.Model<IPainterDocument>) {
  }

  public getAll(): Promise<IPainter[]> {
    return this.PainterModel.find();
  }

  public get(id: string): Promise<IPainter> {
    return this.PainterModel.findById(id);
  }

  public save(painter: IPainter): Promise<IPainter> {
    let newPainter = new this.PainterModel(painter);
    return newPainter.save();
  }
}

export default PainterService;
