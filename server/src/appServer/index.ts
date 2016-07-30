import * as express from 'express';

import IAppModule from '../common/IAppModule';
import IAppServer from '../common/IAppServer';
import { LoggerMiddleware } from '../common/Logger';
import appModules from './appModules';

class App implements IAppServer {
    public app: express.Express;

    public modules: IAppModule[];

    constructor(public ip: string, public port: number, modules?: IAppModule[]) {

        this.modules = modules || appModules();
        this.app = express();

        this.registerMiddleware();
        this.registerRoutes();
        this.registerPingRoute();
        this.registerErrorMiddleware();
    }

    private registerMiddleware() {
        this.app.use(LoggerMiddleware.logger);
    }

    private registerRoutes() {
        this.modules.forEach((appModule) =>
            this.app.use(`/${appModule.name}`, appModule.getRoutes())
        );
    }

    private registerPingRoute() {
        // setup 'ping pong' route
        this.app.get('/ping', function (req, res) {
            res.end('pong');
        });
    }

    private registerErrorMiddleware() {
        this.app.use(LoggerMiddleware.errorLogger);
    }
}

export default App;
