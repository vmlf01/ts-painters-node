import * as nconf from 'nconf';
import * as path from 'path';

export interface IConfig {
  get(key: string): any;
}

class Config implements IConfig {
  constructor() {
    nconf
      .argv()
      .env({
        separator: '__'
      });

    nconf.defaults({
      'NODE_ENV': 'development'
    });

    const environment = nconf.get('NODE_ENV');
    const configDir = path.join(__dirname, '..', '..', '..', '..', 'config');

    nconf.file(environment, path.join(configDir, `${environment}.json`));
    nconf.file('default', path.join(configDir, 'default.json'));
  }

  public get(key: string): any {
    return nconf.get(key);
  }
}

const config: IConfig = new Config();

export default config;
