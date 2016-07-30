import * as express from 'express';

import IRequestHandler from '../../common/IRequestHandler';
import IPainterService from '../interfaces/IPainterService';

class GetAllController implements IRequestHandler {

  constructor(private painterService: IPainterService) {
  }

  public getHandler(): express.RequestHandler {
    // capture object reference inside closure
    const painterService = this.painterService;

    return function getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
      painterService.getAll()
        .then((painters) => {
          res.send(painters);
        })
        .catch((err) => {
          next(new Error('Error fetching painters'));
        });
    };
  }
}

export default GetAllController;
