import * as express from 'express';

interface IRequestHandler {
  getHandler(): express.RequestHandler;
}

export default IRequestHandler;
