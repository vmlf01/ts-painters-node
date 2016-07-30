interface IAppLogger {
  error(msg: string, ... meta: any[]): void;
  warn(msg: string, ... meta: any[]): void;
  info(msg: string, ... meta: any[]): void;
  debug(msg: string, ... meta: any[]): void;
}

export default IAppLogger;
