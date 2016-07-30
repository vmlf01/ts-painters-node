declare module "express-winston" {

    import * as express from "express";

    function errorLogger(options?: any): express.ErrorRequestHandler;
    function logger(options?: any): express.RequestHandler;
}
