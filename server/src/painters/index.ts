import * as express from 'express';

import IAppModule from '../common/IAppModule';
import GetAllController from './controllers/GetAllController';
import GetDetailsController from './controllers/GetDetailsController';
import IPainterService from './interfaces/IPainterService';
import PainterModel from './models/Painter';
import PainterService from './services/PainterService';

class PainterModule implements IAppModule {
    public name: string = 'painters';

    private moduleRouter: express.Router;

    public static Init(): IAppModule {
        return new PainterModule(
            new PainterService(PainterModel)
        );
    }

    constructor(private painterService: IPainterService) {
        this.moduleRouter = express.Router();
    }

    public getRoutes(): express.Router {
        this.registerRoutes();

        return this.moduleRouter;
    }

    private registerRoutes() {
        this.moduleRouter.get('/', new GetAllController(this.painterService).getHandler());
        this.moduleRouter.get('/:id', new GetDetailsController(this.painterService).getHandler());
    }
}

export default PainterModule;
