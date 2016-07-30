import * as express from 'express';

interface IAppModule {
    name: string;
    getRoutes(): express.IRouter;
}

export default IAppModule;
