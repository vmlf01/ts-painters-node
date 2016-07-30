import * as express from 'express';
import * as http from 'http';

import App from './appServer';
import config from './common/Config';
import DBConnection from './common/DBConnection';
import { IDBConnection } from './common/DBConnection';
import Logger from './common/Logger';

class Server {
    private server: http.Server;
    private dbConnection: IDBConnection;

    constructor(public ip: string, public port: number, app?: express.Express) {
        // init new app
        app = app || new App(ip, port).app;

        // create db connection
        this.dbConnection = new DBConnection();

        // create http server
        this.server = http.createServer(app);
    }

    public start() {
        const dbConnectionString = config.get('db:connection');
        Logger.info(`Connecting to database on ${dbConnectionString}...`);
        this.dbConnection.connect(dbConnectionString, (err) => {
            if (err) {
                Logger.error('Error connecting to database', err);
                throw err;
            }

            // start listening on specified port
            this.server.listen(this.port, this.ip, () => {
                Logger.info(`Server is listening on http://${this.ip}:${this.port}`);
            });
        });
    }

    public shutdown() {
        Logger.info('Application shuting down...');
        // shutdown server
        this.server.close(() => {
            Logger.info('Server shutdown');
        });

        this.dbConnection.disconnect(() => {
            Logger.info('Database disconnected');
        });
    }
}

if (require.main === module) {
    const ip = config.get('server:IP');
    const port = config.get('server:PORT');
    Logger.info('Starting server...');
    const server = new Server(ip, port);
    server.start();

    // shutdown server if user terminates application
    process.on('SIGINT', () => server.shutdown());
}

export default Server;
