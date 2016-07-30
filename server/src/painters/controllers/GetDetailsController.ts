import * as express from 'express';

import IRequestHandler from '../../common/IRequestHandler';
import IPainterService from '../interfaces/IPainterService';

class GetDetailsController implements IRequestHandler {

  constructor(private painterService: IPainterService) {
  }

  public getHandler(): express.RequestHandler {
    // capture object reference inside closure
    const painterService = this.painterService;

    return function get(req: express.Request, res: express.Response, next: express.NextFunction) {
      painterService.get(req.params.id)
        .then((painter) => {
          if (!painter) {
            res.sendStatus(404);
          } else {
            res.send(painter);
          }
        })
        .catch((err) => {
          next(new Error('Error fetching painter details'));
        });
    };
  }
}

export default GetDetailsController;
