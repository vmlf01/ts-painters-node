// import * as mongoose from 'mongoose';

import PaginatedModel from '../../../src/common/IPaginatedModel';
import IPaginatedResults from '../../../src/common/IPaginatedResults';
import IPainter from '../interfaces/IPainter';
import IPainterDocument from '../interfaces/IPainterDocument';
import { IPainterOptions, IPainterService } from '../interfaces/IPainterService';

class PainterService implements IPainterService {

  constructor(private PainterModel: PaginatedModel<IPainterDocument>) {
  }

  public getAll(options?: IPainterOptions): Promise<IPaginatedResults<IPainter>> {
    const paginateOptions = {
      offset: Math.max(options && options.skip || 0),
      limit: Math.min(options && options.take || 10)
    };

    return this.PainterModel.paginate({}, paginateOptions)
      .then((results) => {
        return {
          data: results.docs,
          total: results.total,
          skip: results.offset,
          take: results.limit
        };
      });
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
