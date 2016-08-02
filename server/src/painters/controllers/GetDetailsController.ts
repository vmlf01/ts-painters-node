import * as express from 'express';

import IRequestHandler from '../../common/IRequestHandler';
import IPainterService from '../interfaces/IPainterService';

class GetDetailsController implements IRequestHandler {

  private static isInvalidIdError(err: any): boolean {
    return err && err.name === 'CastError' && err.path === '_id';
  }

  constructor(private painterService: IPainterService) {
  }

  public getHandler(): express.RequestHandler {
    // capture object reference inside closure
    const painterService = this.painterService;

    return function get(req: express.Request, res: express.Response, next: express.NextFunction) {
      painterService.get(req.params.id)
        .then((painter) => {
          if (!painter) {
            return res.sendStatus(404);
          }

          res.send(painter);
        })
        .catch((err) => {
          if (GetDetailsController.isInvalidIdError(err)) {
            return res.sendStatus(400);
          }

          next(new Error('Error fetching painter details'));
        });
    };
  }
}

export default GetDetailsController;
